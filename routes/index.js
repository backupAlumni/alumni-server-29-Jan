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
app.post('/forgot-password', async (req, res) => {
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
app.post('/forgot-password', async (req, res) => {
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


// Handle login POST request
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    client.release();

    if (result.rows.length === 1) {
      const user = result.rows[0];
      req.session.user = user;
      res.redirect('/home');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.redirect('/login');
  }
});

// Homepage (protected route, requires login)
app.get('/home', (req, res) => {
  if (req.session.user) {
    res.render('home.ejs', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});



module.exports = router;

