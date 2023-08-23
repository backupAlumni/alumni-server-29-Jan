//imports
var express = require("express");
var router = express.Router();
var path = require("path"); // Add this line to handle paths correctly
var ejs = require("ejs"); 

//databse connection details
var client = require("../database/database");

//connect to database
client.connect();

//middleware
//Homepage
router.get("/", function (req, res) {
    res.sendFile("views/index.html", { root: __dirname + "/../" });
});

//Login page
router.get("/login", function (req, res) {
    res.sendFile("views/login.html", { root: __dirname + "/../" });
});

router.post("/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var dasboardPage;
    var userDetailSQL;
    var loginQuery = "SELECT role FROM Alumni_Space_Account WHERE username = $1 AND password = $2";

    client.query(loginQuery, [username, password], function (err, result) {
        if (err) {
            console.error(err);
            res.send("An error occurred.");
        } else {
            if (result.rows.length > 0) {
                //get role
                var role = result.rows[0].role;
                if (role == "Alumni") {
                    //sql get alumni details
                    userDetailSQL = "SELECT alumni_id,name,surname FROM Tut_Alumni WHERE username = $1";
                    dasboardPage = "../views/alumni/alumni_dashboard.ejs";
                } else {
                    //sql get admin details
                    userDetailSQL = "SELECT admin_id,name,surname FROM Administrator WHERE username = $1";
                    dasboardPage = "../views/admin/admin_dashboard.ejs";
                }

                //query get details
                client.query(userDetailSQL, [username], function (err, result) {
                    if (err) {
                        console.error(err);
                        res.send("An error occured.");
                    } else {
                        //Allow user to login
                        var name = result.rows[0].name;
                        var user_id;
                        if (role == "Alumni") {
                            user_id = result.rows[0].alumni_id;
                        } else {
                            user_id = result.rows[0].admin_id;
                        }
                        
                        console.log("Login successful! Welcome, " + role + "    "+  name + user_id +"!" );
                        
                        //user data to be passed
                        var data = {
                            role: role,
                            name: name,
                            id: user_id
                        };
            
                        // Render the dashboard EJS template with data
                        ejs.renderFile(path.join(__dirname, dasboardPage), data, function (err, html) {
                            if (err) {
                                console.error(err);
                                res.send("An error occurred.");
                            } else {
                                res.send(html); // Send the rendered HTML
                            }
                        });
                    }
                });

            } else {
                //check username
                var checkUsernameQuery = "SELECT username FROM Alumni_Space_Account WHERE username = $1";
                client.query(checkUsernameQuery, [username], function (err, result) {
                    if (err) {
                        console.error(err);
                        res.send("An error occurred.");
                    } else {
                        if (result.rows.length > 0) {
                            res.sendFile("views/forgot_password.html", { root: __dirname + "/../" }); //Display forgot password page
                        } else {
                            res.sendFile("views/account_not_found.html", { root: __dirname + "/../" }); // Display account not found page
                        }
                    }
                });
            }
        }
    });
});

//Register
router.get("/register", function (req, res) {
    res.sendFile("views/register.html", { root: __dirname + "/../" });
});

router.get("/registerAdmin", function (req, res) {
    res.sendFile("views/admin.html", { root: __dirname + "/../" });
});

router.post("/register", function (req, res) {
    // User details
    var name = req.body.name;
    var surname = req.body.surname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    // Variables
    var registerQuery;
    var userDetailsFields = [];
    var insertAccountSQL = "INSERT INTO Alumni_Space_Account (username, password, role,time_recorded, account_status) " +
        "VALUES ($1, $2, $3,NOW(), 'Active')";
    var accDetailsFields = [username, password, role,];


    if (role == "Alumni") {
        var date_of_birth = req.body.date_of_birth;
        // SQL
        registerQuery =
            "INSERT INTO Tut_Alumni (name, surname, date_of_birth, email, username, password) " +
            "VALUES ($1, $2, $3, $4, $5, $6)";

        userDetailsFields = [name, surname, date_of_birth, email, username, password];
    } else if (role == "Admin") {
        // SQL
        registerQuery =
            "INSERT INTO Administrator (name, surname, email, username, password) " +
            "VALUES ($1, $2, $3, $4, $5)";

        userDetailsFields = [name, surname, email, username, password];
    }

    // Query insert into Alumni_Space_Account
    client.query(insertAccountSQL, accDetailsFields, function (err, result) {
        if (err) {
            console.error(err);
            res.send("An error occurred during registration.");
        } else {
            // Query insert into relevant table (Tut_Alumni or Administrator)
            client.query(registerQuery, userDetailsFields, function (err, result) {
                if (err) {
                    console.error(err);
                    res.send("An error occurred during registration.");
                } else {
                    res.send("Registration successful!");
                }
            });
        }
    });
});

module.exports = router;
