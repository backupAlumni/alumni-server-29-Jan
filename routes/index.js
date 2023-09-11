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


// Endpoint to initiate a password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a reset token and store it in the database
    const token = generateToken();
    await pool.query('INSERT INTO password_reset_tokens (email, token) VALUES ($1, $2)', [email, token]);

    // Create a password reset link
    const resetLink = `http://your-app.com/reset-password?token=${token}`;

    // Send a password reset email to the user
    sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: 'Failed to initiate password reset' });
  }
});



//  reset the password
// Endpoint to initiate a password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a reset token and store it in the database
    const token = generateToken();
    await pool.query('INSERT INTO password_reset_tokens (email, token) VALUES (?,?)', [email, token]);

    // Create a password reset link
    const resetLink = `http://your-app.com/reset-password?token=${token}`;

    // Send a password reset email to the user
    sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: 'Failed to initiate password reset' });
  }
});


// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Route to insert a new user profile
router.post('/api/userprofile', (req, res) => {
  //const receivedData = req.body;
  var contact_no = req.body.contact_no;
  var education = req.body.education;
  var achievement = req.body.achievement;
  var skills = req.body.skills;
  var experience = req.body.experience;
  var interest = req.body.interest;
  var bio = req.body.bio;
  // Handle the data on the server as needed
  //console.log('Received data:', receivedData);

  // Send a response back to the client
  //res.status(200).json({ message: 'Data received on the server', data: receivedData });

  // SQL query to insert into UserProfile table

  const insertProfileSQL = `
    INSERT INTO UserProfile (contact_no, education, achievement, skills, experience, enterest, bio) VALUES (?,?,?,?,?,?,?)`;
  //const {achievement, skills, experience, interest, bio } = receivedData;
  console.log(receivedData.education);

  client.query(insertProfileSQL, [contact_no, education, achievement, skills, experience, interest, bio], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred during profile insertion.');
    } else {
      console.log('Profile inserted successfully!');
    }
  });
});


//updating profile
router.put('/api/userprofile/:user_id', (req, res) => {
  const user_id = req.body.user_id;
  const updatedData = req.body;

  var contact_no = req.body.contact_no;
  var education = req.body.education;
  var achievement = req.body.achievement;
  var skills = req.body.skills;
  var experience = req.body.experience;
  var interest = req.body.interest;
  var bio = req.body.bio;

  // Handle the data on the server as needed
  console.log('Received data for updating profile:', updatedData);

  // Send a response back to the client
  res.status(200).json({ message: 'Data received on the server for updating profile', data: updatedData });

  // SQL query to update UserProfile table by user_id
  const updateProfileSQL = `UPDATE UserProfile SET contact_no = ?, education = ?, achievement = ?, skills = ?, experience = ?, enterest = ?, bio = ? WHERE user_id = ? `;

  //const { contact_no, education, achievement, skills, experience, interest, bio } = updatedData;

  client.query(
    updateProfileSQL,
    [contact_no, education, achievement, skills, experience, interest, bio, user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred during profile update.');
      } else {
        console.log('Profile updated successfully!');
      }
    }
  );
});



//Get a user profile by user_id
router.get('/api/userprofile', (req, res) => {
  //const user_id = req.params.user_id;

  var user_id = req.body.user_id;

  // SQL query to retrieve a user profile by user_id
  const getProfileSQL = `SELECT * FROM UserProfile WHERE user_id = ?`;

  client.query(getProfileSQL, [user_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching the user profile.');
    } else {
      if (result && result.length > 0) {
        console.log("something");
        const userProfile = result[0];
        res.status(200).json({ message: 'User profile retrieved successfully', data: userProfile });
      } else {
        res.status(404).send('User profile not found.');
      }
    }
  });
});

module.exports = router;

