const express = require("express");
const session = require("express-session"); //why?
const { append } = require("express/lib/response");
const app = express();
const fs = require("fs");

app.use("/css", express.static("./public/css"));
app.use("/js", express.static("./public/js"));
app.use("/html", express.static("./app/html"));

//Still don't understand entirely what session is and why we need it, but I guess it's fine for now...
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
    if(req.session.loggedIn) {
        res.redirect("/profile");
    } else {
        let doc = fs.readFileSync("./app/html/index.html", "utf8");
        res.set("Server", "RabbitServer"); //Random server name I came up with. When hosting a website on an actual server, you'd put their name here.
        res.set("Powered-By", "0.1xHorsePower"); //Same as line above.
        res.send(doc);
    }
});

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

  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS Serenity;
    use Serenity;
    CREATE TABLE IF NOT EXISTS accounts (
    id INT Primary Key AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL, 
    password VARCHAR(30) NOT NULL,
    is_admin BOOL NULL, 
    dob DATE NOT NULL);`;

  await connection.query(createDBAndTables);

  // await allows for us to wait for this line to execute ... synchronously
  // also ... destructuring. There's that term again!
  const [rows, fields] = await connection.query("SELECT * FROM accounts");
  // no records? Let's add a couple - for testing purposes
  if (rows.length == 0) {
      let is_admin = true;
    // no records, so let's add a couple
    let userRecords =
      "INSERT INTO accounts (email, first_name, last_name, password, is_admin, dob) VALUES ?";
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
      ["gonnacry@bully.com", "Tobey", "Maguire", "123456", !is_admin, 19750627],
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

//   connection.connect();
//   connection.query(createDBAndTables, function (error, results, fields) {
//     if (error) {
//       console.log(error);
//     }
//     console.log(results);
//   });

//   connection.end();


  console.log("Listening on port " + port + "!");
}
// app.get("/get-customers", function (req, res) {
//   let connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "test",
//   });
//   connection.connect();
//   connection.query("SELECT * FROM customer", function (error, results, fields) {
//     if (error) {
//       console.log(error);
//     }
//     console.log("Rows returned are: ", results);
//     res.send({ status: "success", rows: results });
//   });
//   connection.end();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Notice that this is a 'POST'
// app.post("/add-customer", function (req, res) {
//   res.setHeader("Content-Type", "application/json");

//   console.log("Name", req.body.name);
//   console.log("Email", req.body.email);

//   let connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "test",
//   });
//   connection.connect();
//   // TO PREVENT SQL INJECTION, DO THIS:
//   // (FROM https://www.npmjs.com/package/mysql#escaping-query-values)
//   connection.query(
//     "INSERT INTO customer (name, email) values (?, ?)",
//     [req.body.name, req.body.email],
//     function (error, results, fields) {
//       if (error) {
//         console.log(error);
//       }
//       //console.log('Rows returned are: ', results);
//       res.send({ status: "success", msg: "Record added." });
//     }
//   );
//   connection.end();
// });

// POST: we are changing stuff on the server!!!
// app.post("/delete-all-customers", function (req, res) {
//   res.setHeader("Content-Type", "application/json");

//   let connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "test",
//   });
//   connection.connect();
//   // NOT WISE TO DO, BUT JUST SHOWING YOU CAN
//   connection.query("DELETE FROM customer", function (error, results, fields) {
//     if (error) {
//       console.log(error);
//     }
//     //console.log('Rows returned are: ', results);
//     res.send({ status: "success", msg: "Recorded all deleted." });
//   });
//   connection.end();
// });

// ANOTHER POST: we are changing stuff on the server!!!
// app.post("/update-customer", function (req, res) {
//   res.setHeader("Content-Type", "application/json");

//   let connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "test",
//   });
//   connection.connect();
//   console.log("update values", req.body.email, req.body.id);
//   connection.query(
//     "UPDATE customer SET email = ? WHERE ID = ?",
//     [req.body.email, req.body.id],
//     function (error, results, fields) {
//       if (error) {
//         console.log(error);
//       }
//       //console.log('Rows returned are: ', results);
//       res.send({ status: "success", msg: "Recorded updated." });
//     }
//   );
//   connection.end();
// });

// Sets the port and runs the server. Calls init().
let port = 8000;
app.listen(port, init);
