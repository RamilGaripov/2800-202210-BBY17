const express = require("express");
const session = require("express-session");
const {
  append
} = require("express/lib/response");
const app = express();
const fs = require("fs");
const {
  JSDOM
} = require("jsdom");
//mysql2 is ALSO REQUIRED. 

app.use("/css", express.static("./public/css"));
app.use("/js", express.static("./public/js"));
app.use("/img", express.static("./public/img"))
app.use("/html", express.static("./app/html"));

//Still don't understand entirely what session is and why we need it, but I guess it's fine for now...
app.use(session({
  secret: "I can Put HERE Whatever I Want. Security Reasons.", //basically a random string of characters. You can input smth yourself, or generate an actual random string. Protects vs hackers trying to get into your session.
  name: "MyVeryPrivateSession_ID", //similar as line above 
  resave: false,
  saveUninitialized: true //allows us to stay logged in or something? Gotta double check.
}));

//This function feeds the index.html on first load. 
app.get("/", function(req, res) {
  //if the user is logged in, it'll redirect them to their main page
    if(req.session.loggedIn) {
      if(req.session.admin)
        res.redirect("/admin");
      else 
        res.redirect("/main");
    } else {
        let doc = fs.readFileSync("./app/html/index.html", "utf8");
        res.set("Server", "RabbitServer"); //Random server name I came up with. When hosting a website on an actual server, you'd put their name here.
        res.set("Powered-By", "0.1xHorsePower"); //Same as line above.
        res.send(doc);
        
    }
});

app.get("/main", function(req, res) {
  if (req.session.loggedIn) {
    if (req.session.admin) 
      console.log("GO BACK TO THE ADMIN PAGE");
      // res.redirect("/");
    let profile = fs.readFileSync("./app/html/main.html", "utf8");
    let profileDOM = new JSDOM(profile);

    console.log("Redirecting to the main page of " + req.session.first_name, req.session.last_name);
    profileDOM.window.document.getElementsByTagName("title")[0].innerHTML = req.session.first_name + "'s Profile";
    profileDOM.window.document.getElementById("username").innerHTML = req.session.first_name;
    res.send(profileDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.get("/dashboard", function (req, res) {
  if (req.session.loggedIn) {
    if (!req.session.admin) {

      console.log("This user is not an admin. Redirecting them back to their main page.");
      res.redirect("/main");
      return;
    }
    let admin_profile = fs.readFileSync("./app/html/admin.html", "utf8");
    let profileDOM = new JSDOM(admin_profile);

    console.log("Redirecting to the admin dashboard page of " + req.session.first_name, req.session.last_name);
    profileDOM.window.document.getElementsByTagName("title")[0].innerHTML = req.session.first_name + "'s Admin Profile";
    profileDOM.window.document.getElementById("username").innerHTML = req.session.first_name;
    res.send(profileDOM.serialize());

  } else {
    res.redirect("/");
  }
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//pulls all accounts for the admin dashboard table
app.get('/get-accounts', function (req, res) {
  const mysql = require("mysql2");
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("SELECT * FROM BBY_17_accounts", function (error, results, fields) {
    if (error) {
      console.log(error);
    }
    // console.log('Accounts found are: ', results);
    res.send({
      status: "success",
      rows: results
    });

  });
  connection.end();
});

//Pre-populates the forms on the edit page. 
app.get("/edit", function (req, res) {
  if (req.session.loggedIn) {
    if (!req.session.admin) {

      // to bring user to edit page as a non-admin
      console.log("This user is not an administrator. going to edit page but removing admin checkbox.");
      res.redirect("/main");
      return;


    }
    let edit_profile = fs.readFileSync("./app/html/edit.html", "utf8");
    let edit_profileDOM = new JSDOM(edit_profile);


    const mysql = require("mysql2");
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800"
    });
    connection.connect();
    connection.query(
      "SELECT * FROM BBY_17_accounts WHERE id = ?", req.session.id_to_edit,
      function (error, results) {
        if (error) {
          console.log(error);
          res.send({
            status: "fail",
            msg: "something went wrong here"
          });
        }
        if (results.length > 0) {
          // email and password found
          // console.log("USER TO EDIT: ", edited_user);
          edit_profileDOM.window.document.getElementsByTagName("title")[0].textContent = "Editing", results[0].first_name + "'s Profile";
          edit_profileDOM.window.document.getElementById("username").textContent = results[0].first_name + " " + results[0].last_name;
          edit_profileDOM.window.document.getElementById("firstname").setAttribute("value", results[0].first_name);
          edit_profileDOM.window.document.getElementById("lastname").setAttribute("value", results[0].last_name);
          edit_profileDOM.window.document.getElementById("email").setAttribute("value", results[0].email);

          if (results[0].is_admin) {
            edit_profileDOM.window.document.getElementById("admin").setAttribute("checked", "true");
          }
          edit_profileDOM.window.document.getElementById("password").setAttribute("value", results[0].password);

          var dobJSON = JSON.stringify(results[0].dob);
          var dobJSON = dobJSON.substring(1, 11);

          edit_profileDOM.window.document.getElementById("dob").setAttribute("value", dobJSON);
          res.send(edit_profileDOM.serialize());
        }
      }

    );
    connection.end();
    // res.send(edit_profileDOM.serialize());

  } else {
    res.redirect("/");
  }
});

//Feels like this function is redundant and can be removed, but currently I don't know how to avoid using this approach...
app.post("/edit-user", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  req.session.id_to_edit = req.body.id;
  console.log("Redirecting the admin to the page where they can edit the user with id ", req.session.id_to_edit);
  res.send({
    status: "success",
    msg: "session 'id_to_edit' has been updated."
  });
});

//updates the user information in the db
app.post("/update-user", function (req, res) {
  console.log("New user information to be updated in the database:");
  console.log(req.body);

  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'COMP2800'
  });
  connection.connect();

  const user = req.body;

  connection.query("UPDATE BBY_17_accounts SET first_name=?, last_name=?, email=?, is_admin=?, password=?, dob=? WHERE id=?", [user.first_name, user.last_name, user.email, user.admin, user.password, user.dob, req.session.id_to_edit], function (error, results) {

    if (error) {
      console.log(error);
      res.send({
        status: "fail",
        msg: "Something went wrong there"
      });
    } else {
      // user not found
      console.log("User info updated");
      res.send({
        status: "success",
        msg: "User info has been updated."
      })
    }

  });
  connection.end();
});

//Deletes a user. Function accessible from the admin dashboard.
app.post("/delete-user", function (req, res) {
  console.log("Deleting the user with the id of:", req.body.id);

  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'COMP2800'
  });
  connection.connect();

  connection.query("DELETE FROM BBY_17_accounts WHERE id=?", [req.body.id], function (error, results) {

    if (error) {
      console.log(error);
      res.send({
        status: "fail",
        msg: "Something went wrong there"
      });
    } else {
      // user not found
      console.log("User record deleted.");
      res.send({
        status: "success",
        msg: "User record deleted."
      })
    }

  });
  connection.end();
});

//  register
//  http://localhost/phpmyadmin/
app.post('/create-account', function (req, res) {
  
  const mysql = require("mysql2");
  // const jwt = require('jsonwebtoken');
  // const bcrypt = require('bcryptjs');

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800"
  });
  connection.connect();

  console.log(req.body);

  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;
  const pwd = req.body.password;
  const dob = req.body.birthday;

  connection.query('SELECT email FROM BBY_17_accounts WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }

    // if users that come up is greater than 1 that means email is already being used
    if (results.length > 0) {
      return res.render('create-account', {
        msg: 'That email is already in use!'
      })
    }

    //let hashedPassword = await bcrypt.hash(password, 8);
    //console.log(hashedPassword);

    const isAdmin = 0;

    var sql = "INSERT INTO `BBY_17_accounts` (`email`, `first_name`, `last_name`, `password`, `is_admin`, `dob`) VALUES ('" + email + "', '" + fname + "', '" + lname + "', '" + pwd + "', '" + isAdmin + "', '" + dob + "')"

    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        // throw err;
      } else {
        console.log("1 record inserted");
        if(req.session.admin) {
          console.log("An existing admin is going to add a new user!");
          res.send({status: "success", privileges : req.session.admin});
          return;
        } else {
          console.log("A new user has been added.");
          res.send({status: "success", privileges : false});
        }
      }
     
    });
    
  });
  // connection.end();
  
  // res.redirect("/");

});


//Logs the user in. Creates a session. Determines if the user is an administrator or not.
app.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  const email = req.body.email;
  const password = req.body.password;
  console.log("What we received from the client:", email, password);

  authenticate(email, password, function (userRecord) {
    if (!userRecord) {
      res.send({
        status: "fail",
        msg: "Wrong password or user does not exist."
      });
    } else {
      req.session.loggedIn = true;
      req.session.email = userRecord.email;
      req.session.first_name = userRecord.first_name;
      req.session.last_name = userRecord.last_name;
      req.session.password = userRecord.password;
      req.session.admin = userRecord.is_admin;
      if (req.session.admin) {
        console.log("This user is an admin.");
        res.send({
          status: "success",
          msg: "Logged in.",
          privileges: true
        });
      } else {
        console.log("This is a regular user.");
        res.send({
          status: "success",
          msg: "Logged in.",
          privileges: false
        });
      }
      req.session.save(function (err) {
        // console.log(err);
      });
    }
  });
});

//Logs the user out, destroys the session.
app.get("/logout", function (req, res) {
  console.log("Logging the user out.");
  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Unable to log out")
      } else {
        // session deleted, redirect to home
        res.redirect("/");
      }
    });
  }
});




//checks if the user is found in the database or not
function authenticate(email, pwd, callback) {

  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800"
  });
  connection.connect();
  connection.query(
    //This query returns an array of results, in JSON format, where email and pwd match exactly some record in the accounts table in the database.
    //NOTE: since email MUST BE UNIQUE (from our CREATE TABLE query in the init function), the array will have a maximum of 1 user records returned.
    "SELECT * FROM BBY_17_accounts WHERE email = ? AND password = ?", [email, pwd],
    function (error, results) {
      console.log("Results from DB", results, "Number of records returned: ", results.length);

      if (error) {
        // in production, you'd really want to send an email to admin but for now, just console
        console.log(error);
      }
      if (results.length > 0) {
        // email and password found
        console.log("User is found!");
        return callback(results[0]);
      } else {
        // user not found
        console.log("User not found");
        return callback(null);
      }

    }
  );
  connection.end();
}

// //initializes the database and pre-populates it with some data. This function is called at the bottom of this file.
// async function init() {
//   const mysql = require("mysql2/promise");
//   // Let's build the DB if it doesn't exist
//   const connection = await mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "COMP2800",
//     multipleStatements: true,
//   });

//   const createDBAndTables = `CREATE DATABASE IF NOT EXISTS heroku_a4d6380661adf84;
//     use heroku_a4d6380661adf84;
//     CREATE TABLE IF NOT EXISTS BBY_17_accounts (
//     id INT Primary Key AUTO_INCREMENT,
//     email VARCHAR(50) UNIQUE NOT NULL,
//     first_name VARCHAR(30) NOT NULL,
//     last_name VARCHAR(30) NOT NULL, 
//     password VARCHAR(30) NOT NULL,
//     is_admin BOOL NULL, 
//     dob DATE NOT NULL);`;

//   await connection.query(createDBAndTables);

//   // await allows for us to wait for this line to execute ... synchronously
//   // also ... destructuring. There's that term again!
//   const [rows, fields] = await connection.query("SELECT * FROM BBY_17_accounts");
//   // no records? Let's add a couple - for testing purposes
//   if (rows.length == 0) {
//       let is_admin = true;
//     // no records, so let's add a couple
//     let userRecords =
//       "INSERT INTO BBY_17_accounts (email, first_name, last_name, password, is_admin, dob) VALUES ?";
//     let recordUserValues = [
//       ["rgaripov@my.bcit.ca", "Ramil", "Garipov", "123456", is_admin, 19930401],
//       [
//         "royxavier@yahoo.com",
//         "Roy Xavier",
//         "Pimentel",
//         "123456",
//         is_admin,
//         19880330,
//       ],
//       ["joshuachenyyc@gmail.com", "Joshua", "Chen", "123456", is_admin, 20030101],
//       ["rkong360@hotmail.com", "Randall", "Kong", "123456", is_admin, 20030423],
//       ["test@test.ca", "Tobey", "Maguire", "123456", !is_admin, 19750627],
//       [
//         "callmeauntmay@bully.com",
//         "May",
//         "Parker-Jameson",
//         "123456",
//         !is_admin,
//         19641204,
//       ],
//     ];
//     await connection.query(userRecords, [recordUserValues]);
//   }

//   console.log("Listening on port " + port + "!");
// }

//initializes the database and pre-populates it with some data. This function is called at the bottom of this file.
async function init() {
  const mysql = require("mysql2/promise");
  // Let's build the DB if it doesn't exist
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true,
  });

  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS COMP2800;
    use COMP2800;
    CREATE TABLE IF NOT EXISTS BBY_17_accounts (
    id INT Primary Key AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL, 
    password VARCHAR(30) NOT NULL,
    is_admin BOOL NULL, 
    dob DATE NOT NULL);`;

  await connection.query(createDBAndTables);

  const [rows, fields] = await connection.query("SELECT * FROM BBY_17_accounts");
  // adds records if there are currently none
  if (rows.length == 0) {
    let is_admin = true;
    let userRecords =
      "INSERT INTO BBY_17_accounts (email, first_name, last_name, password, is_admin, dob) VALUES ?";
    let recordUserValues = [
      ["rgaripov@my.bcit.ca", "Ramil", "Garipov", "123456", is_admin, 19930401],
      [
        "royxavier@yahoo.com",
        "Roy Xavier",
        "Pimentel",
        "123456",
        is_admin,
        19880330,
      ],
      ["joshuachenyyc@gmail.com", "Joshua", "Chen", "123456", is_admin, 20030101],
      ["rkong360@hotmail.com", "Randall", "Kong", "123456", is_admin, 20030423],
      ["test@test.ca", "Tobey", "Maguire", "123456", !is_admin, 19750627],
      [
        "callmeauntmay@bully.com",
        "May",
        "Parker-Jameson",
        "123456",
        !is_admin,
        19641204,
      ],
    ];
    await connection.query(userRecords, [recordUserValues]);
  }

  console.log("Listening on port " + port + "!");
}

// Sets the port and runs the server. Calls init().
let port = 8000;
app.listen(port, init);



let http = require('http');
let url = require('url');

http.createServer((req, res) => {
  let q = url.parse(req.url, true);
  console.log(q.query);

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Alloy-Origin": "*"
  });

  res.end(`Hello ${q.query['name1']}`);
}).listen(process.env.PORT || 3000);