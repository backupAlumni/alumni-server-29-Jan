//imports
const express = require('express');
const mysql = require('mysql'); 
const bodyParser = require('body-parser');
const cors = require('cors');

//Express Router
const router = express.Router();

//connecting to database
const client = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  port:"3306",
  database: 'test',
});

client.connect();

//Middleware
router.use(bodyParser.json());
router.use(cors()); 

//Routes Management
router.post('/api/login', (req, res) => {
  const receivedData = req.body;
  console.log('Received data:', receivedData);

  const selectUserSQL = "SELECT account_id, role FROM Alumni_Space_Account WHERE email = ? AND password = ?";
  var sql;

  client.query(selectUserSQL, [receivedData.email, receivedData.password],function(err, result){
    if (err) {
      console.error('Error during login:', err);
      //res.status(500).json({ message: 'An error occurred during login.' });
  } else {
    //check details
      if (result && result.length > 0) {
        //get account info
        var account_id = result[0].account_id;
        var role = result[0].role;

        console.log('Account ' + account_id + ' has been found successful!');
        
        if(role == "Alumni"){
            sql = "SELECT name FROM Tut_Alumni where account_id = ?";
        }else{
            sql = "";
        }
        //query to get user details
        client.query(sql,[account_id],function(err,result){
            if(err){
                throw err;
            }else{
                if(result && result.length > 0){
                    var name = result[0].name;
                    console.log("name: " + name);
                    //send to front-end
                    res.status(200).json({ message: 'Login successful!',result });
                }
            }
        });
      } else {
        console.log('Invalid email or password');
          res.status(401).json({ message: 'Invalid email or password' });
      }
  }
  });
});

router.post('/api/register', (req, res) => {
  const receivedData = req.body;
console.log('Received data:', receivedData);


// Send a response back to the client
res.status(200).json({ message: 'Data received on the server', data: receivedData });

//DATABASE SCRIPTS HERE
var registerQuery;
insertDetailsSQL = "INSERT INTO Alumni_Space_Account(email,password,role) " + " VALUES (?,?,?)";
role = "Alumni";

if (role == "Alumni") {
  // SQL
  registerQuery =
      "INSERT INTO Tut_Alumni(account_id,name, surname) " +" VALUES (?,?,?)";

  userDetailsFields = [null, receivedData.fullname, receivedData.surname];
} else if (role == "Admin") {
  // SQL
  registerQuery =
      "INSERT INTO Administrator (name, surname) " +" VALUES (?,?)";

  userDetailsFields = [receivedData.fullname, receivedData.surname];
}


//DATABASE INTERACTION STARTS HERE
// Query insert into Alumni_Space_Account
client.query(insertDetailsSQL,[receivedData.email, receivedData.password,role ],function (err, result) {
  if (err) {
    console.error(err);
    //return res.send("An error occurred during registration.");
  } else {
    console.log('Account Registration successful!:');
    //inser into relevent table

    //get acc id
    const accountId = result.insertId;
    userDetailsFields[0] = accountId;

    console.log(accountId)

    client.query(registerQuery, userDetailsFields, function (err, result) {
      if (err) {
          console.error(err);
          //return res.send("An error occurred during registration.");
      } else {
          //res.send("Registration successful!");
          console.log("Hi");
      }
  });
  }
});

});

module.exports = router;

