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

  const selectUserSQL = "SELECT fullname FROM alumni_space_ui WHERE email = ? AND password = ?";

  client.query(selectUserSQL, [receivedData.email, receivedData.password],function(err, result){
    if (err) {
      console.error('Error during login:', err);
      //res.status(500).json({ message: 'An error occurred during login.' });
  } else {
    //check details
      if (result && result.length > 0) {
        var fullname = result[0].fullname;
        console.log(fullname + ' has Login successful!');
        res.status(200).json({ message: 'Login successful!',result });
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
role == "Alumni";

if (role == "Alumni") {
  // SQL
  registerQuery =
      "INSERT INTO Tut_Alumni (name, surname,) " +
      "VALUES (?,?)";

  userDetailsFields = [receivedData.fullname, receivedData.surname];
} else if (role == "Admin") {
  // SQL
  registerQuery =
      "INSERT INTO Administrator (name, surname) " +
      "VALUES (?,?)";

  userDetailsFields = [receivedData.fullname, receivedData.surname];
}


//DATABASE INTERACTION STARTS HERE
// Query insert into Alumni_Space_Account
client.query(insertDetailsSQL,[receivedData.email, receivedData.password,role ],function (err, result) {
  if (err) {
    console.error(err);
    res.send("An error occurred during registration.");
  } else {
    console.log('Account Registration successful!:');
    //inser into relevent table
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

