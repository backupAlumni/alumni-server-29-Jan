//imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//Express Router
const router = express.Router();

//connecting to database

var client = require('../database/database');
const { password } = require('pg/lib/defaults');

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
client.query(insertDetailsSQL,[receivedData.email,receivedData.password ,role ],function (err, result) {
  if (err) {
    console.error(err);
    //return res.send("An error occurred during registration.");
  } else {
    console.log('Account for '+ receivedData.fullname + ' '+ receivedData.surname + ' has been Created');
    //inser into relevent table

    //get acc id
    const accountId = result.insertId;
    userDetailsFields[0] = accountId;

    client.query(registerQuery, userDetailsFields, function (err, result) {
      if (err) {
          console.error(err);
          //return res.send("An error occurred during registration.");
      } else {
          //res.send("Registration successful!");
          console.log("Registration successful!");

          //create profile for user
          client.query("INSERT INTO UserProfile(account_id) " + " VALUES(?)",[accountId],function(err,result){
            if(err){
              throw err;
            }else{
              console.log("Profile for User " + receivedData.fullname + ' '+ receivedData.surname + ' has been Generated');
            }
          });
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
// update password 
router.put('/forgot-password', async (req, res) => {
  //const user_id = req.body.user_id;
  const receivedData = req.body;
  //const { email } = req.body.email;

  var email = req.body.email;
  var password = req.body.password;

  // Check if the email exists in the database
  console.log('Received data for updating password:', receivedData);

  const updatePasswordSQL = `UPDATE Alumni_Space_Account SET password = ? WHERE email = ?`;

 
  client.query(updatePasswordSQL,[password,email],(err, result) => {
      if (err) {
        console.error(err);
        //res.status(500).send('An error occurred during password update.');
      } else {
        console.log('Password updated successfully!');
      }
    }
  );
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
  const receivedData = req.body;

  var contact_no = req.body.contact_no;
  var education = req.body.education;
  var achievement = req.body.achievement;
  var skills = req.body.skills;
  var experience = req.body.experience;
  var interest = req.body.interest;
  var bio = req.body.bio;

  // Handle the data on the server as needed
  console.log('Received data for updating profile:', receivedData);

  // Send a response back to the client
  res.status(200).json({ message: 'Data received on the server for updating profile', data: receivedData });

  // SQL query to update UserProfile table by user_id
  const updateProfileSQL = `UPDATE UserProfile SET contact_no = ?, education = ?, achievement = ?, skills = ?, experience = ?, interest = ?, bio = ? WHERE user_id = ? `;

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


// Route to insert a new job
router.post('/api/newjob', (req, res) => {

    var job_title = req.body.job_title;
    var company = req.body.company;
    var location = req.body.location;
    var deadline = req.body.deadline;
    var account_id = req.body.account_id;
    var content_type = req.body.content_type;

    console.log(job_title);
    console.log(company);
    console.log(location);
    console.log(deadline);
    console.log(account_id);
    console.log(content_type);
   
  // Handle the data on the server as needed

  // SQL query to insert into Jobs table
  const insertJobSQL = `INSERT INTO user (job_title, company, location, deadline, account_id, content_type) VALUES (?, ?, ?, ?, ?, ?)`;

  client.query(
    insertJobSQL,
    [job_title, company, location, deadline, account_id, content_type],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred during job insertion.');
      } else {
        console.log('Job inserted successfully!');
        res.status(200).json({ message: 'Job inserted successfully!' });
      }
    }
  );
});


//updating jobs
router.put('/api/Jobs/:job_id', (req, res) => {
  const job_id = req.params.job_id;
  const { account_id, content_type, job_title, company, location, deadline, id} = req.body;

  // SQL query to update Jobs table by job_id*****96
  const updateJobSQL = `UPDATE User SET account_id = ?, content_type = ?, job_title = ?, company = ?, location = ?, deadline = ?  WHERE id = ?`;

  const values = [account_id, content_type, job_title, company, location, deadline, id];

  client.query(updateJobSQL, values, (err, result) => {
    if (err) {
      console.error('Error updating job:', err);
      res.status(500).send('An error occurred during job update.');
    } else {
      console.log('Job updated successfully!');
      res.status(200).json({ message: 'Job updated successfully' });
    }
  });
});

module.exports = router;

