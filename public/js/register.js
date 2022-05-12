const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db=  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "serenity"
  });


const res = require("express/lib/response");
const { DEC8_BIN } = require("mysql/lib/protocol/constants/charsets");

exports.register = (req, res) => {
    console.log(req.body);

    const name = req.body.name;
    const email = req.body.email;
    const password = req.password;
    const passwordConfirm = req.passwordConfirm;

    db.query('SELECT email FROM accounts WHERE email = ?', [email], async (error, results) =>  {
        if(error) {
            console.log(error);
        }

        // if users that come up is greater than 1 that means email is already being used
        if (results.length > 0) {
            return res.render('register', {
                messsage: 'That email is already in use!'
            } )
        } else if(password !== passwordConfirm) {
            return res.render('register', {
                messsage: 'Passwords do not match!'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
     
        db.query('INSERT INTO accounts SET ?', {name: name, email: email, password: hashedPassword},  (error, results) => {
            if (error) {
                console.log(error);
            } else {
                return res.render('register', {
                    messsage: 'User registered!'
                });
            }
        })

    })

}