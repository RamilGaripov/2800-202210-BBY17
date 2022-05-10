const express = require("express");
const session = require("express-session"); 
const { append } = require("express/lib/response");
const app = express();
const fs = require("fs");
const { JSDOM } = require("jsdom");
//mysql2 is ALSO REQUIRED. 

app.use("/css", express.static("./public/css"));
app.use("/js", express.static("./public/js"));
app.use("/img",express.static("./public/img"))
app.use("/html", express.static("./app/html"));

app.use(session(
    {
        secret: "I can Put HERE Whatever I Want. Security Reasons.", //basically a random string of characters. You can input smth yourself, or generate an actual random string. Protects vs hackers trying to get into your session.
        name: "MyVeryPrivateSession_ID", //similar as line above 
        resave: false,
        saveUninitialized: true //allows us to stay logged in or something? Gotta double check.
    })
);

//This function feeds the index.html on first load. 
app.get("/", function(req, res) {
  //if the user is logged in, it'll redirect them to their profile page
    if(req.session.loggedIn) {
      if(req.session.admin)
        res.redirect("/admin");
      else 
        res.redirect("/profile");
    } else {
        let doc = fs.readFileSync("./app/html/index.html", "utf8");
        res.set("Server", "RabbitServer"); //Random server name I came up with. When hosting a website on an actual server, you'd put their name here.
        res.set("Powered-By", "0.1xHorsePower"); //Same as line above.
        res.send(doc);
        
    }
});

app.get("/profile", function(req, res) {
  if (req.session.loggedIn) {
    if (req.session.admin) 
      console.log("GO BACK TO THE ADMIN PAGE");
      // res.redirect("/");
    let profile = fs.readFileSync("./app/html/profile.html", "utf8");
    let profileDOM = new JSDOM(profile);

    console.log("Redirecting to the profile page of " + req.session.first_name, req.session.last_name);
    profileDOM.window.document.getElementsByTagName("title")[0].innerHTML = req.session.first_name + "'s Profile";
    profileDOM.window.document.getElementById("username").innerHTML = req.session.first_name;

    res.send(profileDOM.serialize());
    
  } else {
    res.redirect("/");
  }
});

app.get("/dashboard", function(req, res) {
  if (req.session.loggedIn) {
    if (!req.session.admin) {
      console.log("YOURE NOT AN ADMIN!");
      // res.redirect("/profile");
    }
    let admin_profile = fs.readFileSync("./app/html/admin.html", "utf8");
    let profileDOM = new JSDOM(admin_profile);

    console.log("Redirecting to the admin dashboard page of " + req.session.first_name, req.session.last_name);
    profileDOM.window.document.getElementsByTagName("title")[0].innerHTML = req.session.first_name + "'s Admin Profile";
    profileDOM.window.document.getElementById("username").innerHTML = req.session.first_name;

    
    // const connection = mysql.createConnection({
    //   host: "localhost",
    //   user: "root",
    //   password: "",
    //   database: "COMP2800"
    // });
    // connection.connect();

    // const admin = false;
    // const num_admins = connection.query("SELECT * FROM BBY_17_accounts", function(error, results, fields) {
    //   if (error) {
    //     console.log(error);
    // }
    // if(results.length > 0) {
    //     console.log("Administrator can see", results.length, "registered user(s):");
    //     for (let i = 0; i < results.length; i++)
    //       console.log(results[i].first_name, results[i].last_name, results[i].email, results[i].password, results[i].is_admin);
          
    //     return results;
    // } else {
    //     console.log("users not found");
    //     // return callback(null);
    // }
    // });

    // console.log("We ran this query: ", num_admins.sql, "and calculated the number of returned users");

    res.send(profileDOM.serialize());
    
    // connection.end();
  } else {
    res.redirect("/");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/get-accounts', function (req, res) {
  const mysql = require("mysql2");
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("SELECT * FROM BBY_17_accounts", function(error, results, fields) {
      if (error) {
          console.log(error);
      }
      console.log('Rows returned are: ', results);
      res.send({ status: "success", rows: results });

  });
  connection.end();
});

app.get("/register", function(req, res) {
    let profile = fs.readFileSync("./app/html/register.html", "utf8");
    let profileDOM = new JSDOM(profile);

    console.log("HI, we're in the register now!");
});

app.post("/login", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  const email = req.body.email;
  const password = req.body.password;
  console.log("What we received from the client:", email, password);

  authenticate(email, password, function(userRecord) {
    if (!userRecord) {
      res.send({status: "fail", msg: "Wrong password or user does not exist."});
    } else {
      req.session.loggedIn = true;
      req.session.email = userRecord.email;
      req.session.first_name = userRecord.first_name;
      req.session.last_name = userRecord.last_name;
      req.session.password = userRecord.password;
      req.session.admin = userRecord.is_admin;
      if (req.session.admin) {
        console.log("This user is an admin.");
        res.send({ status: "success", msg: "Logged in.", privileges: true});
      } else {
        console.log("This is a regular user.");
        res.send({ status: "success", msg: "Logged in.", privileges: false});
      }
      
    }
  });
});

app.get("/logout", function(req,res){
  console.log("Logging the user out.");
  if (req.session) {
      req.session.destroy(function(error) {
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
    function(error, results) {
        // console.log("Results from DB", results, "Number of records returned: ", results.length);

        if (error) {
            console.log(error);
        }
        if(results.length > 0) {
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

}

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
