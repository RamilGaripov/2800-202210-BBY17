const express = require("express");
const session = require("express-session");
const {
  append,
  redirect
} = require("express/lib/response");
const app = express();
const fs = require("fs");
const {
  JSDOM
} = require("jsdom");
const bcrypt = require("bcrypt");
//mysql2 is ALSO REQUIRED. 
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2");
var connection = null;
const localConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "COMP2800"
}


const is_heroku = process.env.IS_HEROKU || false;


// mysql://be46a623c032da:271c02ac@us-cdbr-east-05.cleardb.net/heroku_0517524a798819b?reconnect=true
// server
const dbConfigHeroku = {
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'be46a623c032da',
  password: '271c02ac',
  database: 'heroku_0517524a798819b',
  multipleStatements: false 
}

const dbConfigHerokuCreate = {
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'be46a623c032da',
  password: '271c02ac',
  multipleStatements: true
}


// local 
const dbConfigLocal = {
  host: "localhost",
  user: "root",
  password: "",
  database: "heroku_0517524a798819b"
}

const dbConfigLocalCreate = {
  host: "localhost",
  user: "root",
  password: "",
  multipleStatements: true
};

app.use("/css", express.static("./public/css"));
app.use("/js", express.static("./public/js"));
app.use("/img", express.static("./public/img"));
app.use("/avatar", express.static("./public/avatar"));
app.use("/html", express.static("./app/html"));

//multer storage for uploading photos in profile page
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/avatar/");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname.split('/').pop().trim());
  },
});
const upload = multer({
  storage: storage
});

app.use(session({
  secret: "I can Put HERE Whatever I Want. Security Reasons.", //basically a random string of characters. You can input smth yourself, or generate an actual random string. Protects vs hackers trying to get into your session.
  name: "MyVeryPrivateSession_ID", //similar as line above 
  resave: false,
  saveUninitialized: true //allows us to stay logged in or something? Gotta double check.
}));

//route for uploading data data
app.post("/post-new-avatar", upload.single('avatar'), (req, res) => {
  if (req.file) {
    const avatarPath = req.file.path.substring(6);
    connection = mysql.createConnection(localConfig); 
    var insertData = "UPDATE BBY_17_accounts SET avatar=? WHERE id=?"
    connection.connect();
    connection.query(insertData, [avatarPath, req.session.user_id], function (err) {
      if (err) {
        res.send({status: "fail", msg: "Unable to upload your photo."});
      } else {
        req.session.avatar = avatarPath;
        res.send({status: "success", msg: "PHOTO UPDATED. REFRESH THE PAGE TO SEE IT."});
      }
    });
    connection.end();
    
  } else {
    console.log("No file uploaded.");
  }
});

//This function feeds the index.html on first load. 
app.get("/", function (req, res) {
  //if the user is logged in, it'll redirect them to their main page
  if (req.session.loggedIn) {
    if (req.session.admin)
      res.redirect("/dashboard");
    else
      res.redirect("/main");
  } else {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");
    res.set("Server", "RabbitServer"); //Random server name I came up with. When hosting a website on an actual server, you'd put their name here.
    res.set("Powered-By", "0.1xHorsePower"); //Same as line above.
    res.send(doc);

  }
});

app.get("/main", function (req, res) {
  if (req.session.loggedIn) {

    let profile = fs.readFileSync("./app/html/main.html", "utf8");
    let profileDOM = new JSDOM(profile);

    console.log("Redirecting to the main page of " + req.session.first_name, req.session.last_name);
    profileDOM.window.document.getElementsByTagName("title")[0].textContent = req.session.first_name + "'s Profile";
    profileDOM.window.document.getElementById("profilepic").setAttribute("src", req.session.avatar);
    profileDOM.window.document.getElementById("username").textContent = req.session.first_name + " " + req.session.last_name;
    profileDOM.window.document.getElementById("email").textContent = req.session.email;
    profileDOM.window.document.getElementById("points").textContent = req.session.points;

    res.send(profileDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.get("/profile", function (req, res) {
  if (req.session.loggedIn) {
    let profile = fs.readFileSync("./app/html/profile.html", "utf8");
    let profileDOM = new JSDOM(profile);

    console.log("Redirecting to the profile editing page of " + req.session.first_name, req.session.last_name);

    profileDOM.window.document.getElementsByTagName("title")[0].textContent = req.session.first_name + "'s Profile";
    profileDOM.window.document.getElementById("greeting").textContent = req.session.first_name
    profileDOM.window.document.getElementById("firstname").setAttribute("value", req.session.first_name);
    profileDOM.window.document.getElementById("lastname").setAttribute("value", req.session.last_name);
    profileDOM.window.document.getElementById("email").setAttribute("value", req.session.email);
    profileDOM.window.document.getElementById("password").setAttribute("value", req.session.password);
    profileDOM.window.document.getElementById("profilepic").setAttribute("src", req.session.avatar);
  
    var dobJSON = req.session.dob.substring(0, 10);

    profileDOM.window.document.getElementById("dob").setAttribute("value", dobJSON);
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
  connection = mysql.createConnection(localConfig);
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
      console.log("This user is not an administrator. Going to edit page but removing admin checkbox.");
      res.redirect("/main");
      return;
    }
    let edit_profile = fs.readFileSync("./app/html/edit.html", "utf8");
    let edit_profileDOM = new JSDOM(edit_profile);
    connection = mysql.createConnection(localConfig);
    connection.connect();
    connection.query(
      "SELECT * FROM BBY_17_accounts WHERE id=?", req.session.id_to_edit,
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
          // edit_profileDOM.window.document.getElementById("password").setAttribute("value", results[0].password);

          var dobJSON = JSON.stringify(results[0].dob);
          var dobJSON = dobJSON.substring(1, 11);

          edit_profileDOM.window.document.getElementById("dob").setAttribute("value", dobJSON);
          edit_profileDOM.window.document.getElementById("points").setAttribute("value", results[0].points);
          res.send(edit_profileDOM.serialize());
        }
      }
    );
    connection.end();

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

//Allows the admins to reset the user's password to 123456
app.post("/reset-user-password", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  connection = mysql.createConnection(localConfig);
  connection.connect();
  const reset_pw = "123456";
  connection.query("UPDATE BBY_17_accounts SET password=? WHERE id=?", [reset_pw, req.body.id], function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.send({
        status: "success",
        msg: "User's password has been reset, and we will sent them an email about it."
      });
      //Here, we would want to send an email to the user telling them their temporary password is 123456 and they should change it ASAP.
    }
  });
  connection.end();
});

//updates the user information in the db
app.post("/update-user", function (req, res) {
  if (req.session.loggedIn) {
    connection = mysql.createConnection(localConfig);
    connection.connect();

    const user = req.body;
    if (req.session.admin) {
      var sql_query = "UPDATE BBY_17_accounts SET first_name=?, last_name=?, email=?, is_admin=?, dob=?, points=? WHERE id=?;";
      var sql_vars = [user.first_name, user.last_name, user.email, user.admin, user.dob, user.points, req.session.id_to_edit];

    } else {
      var sql_query = "UPDATE BBY_17_accounts SET first_name=?, last_name=?, email=?, password=?, dob=? WHERE id=?;";
      var sql_vars = [user.first_name, user.last_name, user.email, user.password, user.dob, req.session.user_id];
      req.session.first_name = user.first_name;
      req.session.last_name = user.last_name;
    }

    connection.query(sql_query, sql_vars, function (error, results) {

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
  }
});

//Deletes a user. Function accessible from the admin dashboard.
app.post("/delete-user", function (req, res) {
  console.log("Deleting the user with the id of:", req.body.id);
  connection = mysql.createConnection(localConfig);
  connection.connect();
  //ADD CODE HERE TO SEE IF THERE's ONLY ONE ADMIN LEFT. DO NOT ALLOW TO DELETE THEM!
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
app.post('/create-account', async function (req, res) {
  connection = mysql.createConnection(localConfig);
  connection.connect();

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
      res.send({
        status: "fail",
        msg: "A user with this email already exists."
      });
      return;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pwd, salt);
    console.log(hashedPassword);

    const isAdmin = 0;

    var sql = "INSERT INTO `BBY_17_accounts` (`email`, `first_name`, `last_name`, `password`, `is_admin`, `dob`) VALUES ('" + email + "', '" + fname + "', '" + lname + "', '" + pwd + "', '" + isAdmin + "', '" + dob + "')"
    connection = mysql.createConnection(localConfig);
    connection.connect();
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        // throw err;
      } else {
        console.log("1 record inserted");
        if (req.session.admin) {
          console.log("An existing admin is going to add a new user!");
          res.send({
            status: "success",
            privileges: req.session.admin
          });
          return;
        } else {
          console.log("A new user has been added.");
          res.send({
            status: "success",
            privileges: false
          });
        }
      }

    });

  });
  connection.end();

});

app.post("/start-game", function (req, res) {
  console.log("client sent us: ", req.body);
  connection = mysql.createConnection(localConfig);
  connection.connect();
  connection.query("INSERT INTO BBY_17_plays (id, title) VALUES ('" + req.session.user_id + "', '" + req.body.title + "')", function (err) {
    if (err) {
      console.log("ERROR: ", err);
    }
  });

  connection.query("SELECT Max(play_id) AS new_id FROM BBY_17_plays", function (err, results) {
    if (err) {
      console.log(err);
    } else {
      req.session.play_id = results[0].new_id;
      res.send({
        status: "success"
      });
    }
  });
  connection.end();
})


app.post("/finish-game", function (req, res) {
  console.log("User finished the game!");
  connection = mysql.createConnection(localConfig);
  connection.connect();
  connection.query("UPDATE BBY_17_plays SET completed=true, time_completed=CURRENT_TIMESTAMP WHERE play_id=?", [req.session.play_id], function (err) {
    if (err) {
      console.log("ERROR: ", err);
    }
  });
  connection.query("UPDATE BBY_17_accounts SET points=(points+ (SELECT points FROM BBY_17_activities WHERE title=?)) WHERE id = ?", [req.body.title, req.session.user_id], function (err) {
    if (err) {
      console.log("ERROR: ", err);
    }
  });
  connection.end();
})

app.get("/history", function (req, res) {
  if (req.session.loggedIn) {
    const history = fs.readFileSync("./app/html/history.html", "utf8");
    const historyDOM = new JSDOM(history);
    historyDOM.window.document.getElementsByTagName("title")[0].textContent = "Activity History";
    historyDOM.window.document.getElementById("username").textContent = req.session.first_name;
    res.send(historyDOM.serialize());
  } else {
    res.redirect("/");
  }
})

app.get("/get-previous-activities", function (req, res) {
  connection = mysql.createConnection(localConfig);
  connection.connect();
  connection.query("SELECT * FROM BBY_17_plays AS P JOIN BBY_17_activities AS A ON P.title = A.title WHERE id=? AND completed", [req.session.user_id], function (err, results) {
    if (err) {
      console.log(err);
    } else {
      if (results.length > 0) {
        console.log("We got", results.length, "record(s) for this user.");
        res.send({
          status: "success",
          rows: results
        });
      } else {
        res.send({
          status: "fail",
          msg: "You have not completed any activities before."
        });
      }

    }
  });
  connection.end();
})

app.post("/update-comment", function (req, res) {
  connection = mysql.createConnection(localConfig);
  connection.connect();
  connection.query("UPDATE BBY_17_plays SET comment=? WHERE play_id=?", [req.body.comment, req.body.play_id], function (err) {
    if (err) {
      res.send({
        status: "fail",
        msg: "Could not save your comment."
      });
    } else {
      console.log("Activity comment updated.");
      res.send({
        status: "success",
        msg: "Your comment has been saved."
      });
    }
  });
  connection.end();
})


//Logs the user in. Creates a session. Determines if the user is an administrator or not.
app.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  const email = req.body.email;
  const password = req.body.password;

  authenticate(email, password, function (userRecord) {
    if (!userRecord) {
      res.send({
        status: "fail",
        msg: "Wrong password or user does not exist."
      });
    } else {
      req.session.loggedIn = true;
      req.session.user_id = userRecord.id;
      req.session.email = userRecord.email;
      req.session.first_name = userRecord.first_name;
      req.session.last_name = userRecord.last_name;
      req.session.password = userRecord.password;
      req.session.admin = userRecord.is_admin;
      req.session.dob = userRecord.dob;
      req.session.points = userRecord.points;
      req.session.avatar = userRecord.avatar;

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
  connection = mysql.createConnection(localConfig);
  connection.connect();
  connection.query(
    //This query returns an array of results, in JSON format, where email and pwd match exactly some record in the accounts table in the database.
    //NOTE: since email MUST BE UNIQUE (from our CREATE TABLE query in the init function), the array will have a maximum of 1 user records returned.
    "SELECT * FROM BBY_17_accounts WHERE email = ? AND password = ?", [email, pwd],
    function (error, results) {
      if (error) {
        // in production, you'd really want to send an email to admin but for now, just console
        console.log(error);
      }
      if (results.length > 0) {
        // email and password found
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

//initializes the database and pre-populates it with some data. This function is called at the bottom of this file.
async function init() {
  const mysqlpromise = require("mysql2/promise");
  // Let's build the DB if it doesn't exist

  // const connectionInit = await mysqlpromise.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   password: "",
  //   multipleStatements: true,
  // });

  
    if (is_heroku) {
      var connectionInit = await mysqlpromise.createConnection(dbConfigHerokuCreate);
    } else {
    
     var connectionInit = await mysqlpromise.createConnection(dbConfigLocalCreate);
    }


  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS heroku_0517524a798819b;
    use heroku_0517524a798819b;
    CREATE TABLE IF NOT EXISTS BBY_17_accounts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(30) NOT NULL,
      last_name VARCHAR(30) NOT NULL, 
      password VARCHAR(30) NOT NULL,
      is_admin BOOL NULL, 
      dob DATE NOT NULL,
      points INT DEFAULT 0,
      avatar VARCHAR(50) DEFAULT "/avatar/profilepic.png");
    
    CREATE TABLE IF NOT EXISTS BBY_17_activities (
      title VARCHAR(25) PRIMARY KEY,
      points INT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS BBY_17_plays (
      play_id INT PRIMARY KEY AUTO_INCREMENT,
      id INT NOT NULL REFERENCES BBY_17_accounts(id),
      title VARCHAR(25) NOT NULL REFERENCES BBY_17_activities(title),
      completed BOOL DEFAULT false,
      time_started DATETIME DEFAULT CURRENT_TIMESTAMP,
      time_completed DATETIME NULL,
      comment VARCHAR(255) NULL
    );
    `;

  await connectionInit.query(createDBAndTables);

  const [rows, acc_fields] = await connectionInit.query("SELECT * FROM BBY_17_accounts");
  // console.log("THE FIELDS", rows);
  // adds records if there are currently none
  if (rows.length == 0) {
    let is_admin = true;
    let userRecords =
      "INSERT INTO BBY_17_accounts (email, first_name, last_name, password, is_admin, dob) VALUES ?";
    let recordUserValues = [
      ["admin@test.ca", "Ramil", "Garipov", "123456", is_admin, 19930401],
      ["royxavier@yahoo.com", "Roy Xavier", "Pimentel", "123456", is_admin, 19880330],
      ["joshuachenyyc@gmail.com", "Joshua", "Chen", "123456", is_admin, 20030101],
      ["rkong360@hotmail.com", "Randall", "Kong", "123456", is_admin, 20030423],
      ["user@test.ca", "Tobey", "Maguire", "123456", !is_admin, 19750627],
      [
        "callmeauntmay@bully.com",
        "May",
        "Parker-Jameson",
        "123456",
        !is_admin,
        19641204
      ],
    ];
    await connectionInit.query(userRecords, [recordUserValues]);
  }

  const [activities_rows, activ_fields] = await connectionInit.query("SELECT * FROM BBY_17_activities");
  // console.log("THE FIELDS", rows);
  // adds records if there are currently none
  if (activities_rows.length == 0) {
    let activitiesSQL =
      "INSERT INTO BBY_17_activities VALUES ?";
    let activitiesValues = [
      ["Sudoku", 50],
      ["Match", 25],
      ["Wordle", 10],
      ["Puzzle", 25]
    ];
    await connectionInit.query(activitiesSQL, [activitiesValues]);
  }

  console.log("Listening on port " + port + "!");
  // connection = mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   password: "",
  //   database: "COMP2800"
  // });


    if (is_heroku) {
      connection = mysql.createConnection(dbConfigHeroku);
    } else {
      connection = mysql.createConnection(dbConfigLocal);
    }
     
}

// Sets the port and runs the server. Calls init().
let port = process.env.PORT || 8000;

app.listen(20572, function() {
  init();
});



// if (is_heroku) { 
//   app.listen(port, function () {
//     init();
//   })
// } else {
//   app.listen(port, init);
// }







// let http = require('http');
// let url = require('url');
// const res = require("express/lib/response");
// const { send } = require("process");

// http.createServer((req, res) => {
//   let q = url.parse(req.url, true);
//   console.log(q.query);

//   res.writeHead(200, {
//     "Content-Type": "text/html",
//     "Access-Control-Alloy-Origin": "*"
//   });

//   res.end(`Hello ${q.query['name1']}`);
// }).listen(process.env.PORT || 5000);



