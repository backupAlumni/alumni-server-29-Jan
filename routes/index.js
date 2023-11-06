//imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

//Express Router
const router = express.Router();

//connecting to database

var client = require('../database/database');
const { password } = require('pg/lib/defaults');

//Middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// Enable CORS for all routes
router.use(cors());

//Allowing User to upload files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      let uploadPath = 'uploads/';
      const fileType = req.body.fileType; // You need to send the file type from the client.

      switch (fileType) {
          case 'profile':
              uploadPath += 'profiles/';
              break;
          case 'event':
              uploadPath += 'events/';
              break;
          case 'academic':
              uploadPath += 'docs/academic/';
              break;
          case 'certificate':
              uploadPath += 'docs/certs/';
              break;
          default:
              uploadPath += 'others/';
              break;
      }

      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//Routes Management
router.post('/api/login', (req, res) => {
  const receivedData = req.body;
  console.log('Received data:', receivedData);

  const selectUserSQL = "SELECT account_id, role FROM Alumni_Space_Account WHERE email = ? AND password = ?";
  var sql;

  client.query(selectUserSQL, [receivedData.email, receivedData.password], function (err, result) {
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

        if (role == "Alumni") {
          sql = "SELECT name FROM Tut_Alumni where account_id = ?";
        } else {
          sql = "SELECT name FROM Administrator where account_id = ?";
        }
        //query to get user details
        client.query(sql, [account_id], function (err, result) {
          if (err) {
            throw err;
          } else {
            if (result && result.length > 0) {
              var name = result[0].name;
              console.log("name: " + name);
              //send to front-end
              res.status(200).json({ message: 'Login successful!', result, account_id });
            } else {
              console.log('Invalid email or password');
              res.status(401).json({ message: 'Invalid email or password' });
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
      "INSERT INTO Tut_Alumni(account_id,name, surname) " + " VALUES (?,?,?)";

    userDetailsFields = [null, receivedData.fullname, receivedData.surname];
  } else if (role == "Admin") {
    // SQL
    registerQuery =
      "INSERT INTO Administrator (name, surname) " + " VALUES (?,?)";

    userDetailsFields = [receivedData.fullname, receivedData.surname];
  }


  //DATABASE INTERACTION STARTS HERE
  // Query insert into Alumni_Space_Account
  client.query(insertDetailsSQL, [receivedData.email, receivedData.password, role], function (err, result) {
    if (err) {
      console.error(err);
      //return res.send("An error occurred during registration.");
    } else {
      console.log('Account for ' + receivedData.fullname + ' ' + receivedData.surname + ' has been Created');
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
          client.query("INSERT INTO UserProfile(account_id) " + " VALUES(?)", [accountId], function (err, result) {
            if (err) {
              throw err;
            } else {
              console.log("Profile for User " + receivedData.fullname + ' ' + receivedData.surname + ' has been Generated');
            }
          });
        }
      });
    }
  });

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


  client.query(updatePasswordSQL, [password, email], (err, result) => {
    if (err) {
      console.error(err);
      //res.status(500).send('An error occurred during password update.');
    } else {
      console.log('Password updated successfully!');
      res.status(200).json({ message: 'Login successful!' });
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

  var location = req.body.location;
  var qualification = req.body.qualification;
  var employment_status = req.body.employment_status;
  var skills = req.body.skills;
  var experience = req.body.experience;
  var interest = req.body.interest;
  var bio = req.body.bio;

  // Handle the data on the server as needed
  console.log('Received data for updating profile:', receivedData);

  // Send a response back to the client
  res.status(200).json({ message: 'Data received on the server for updating profile', data: receivedData });

  // SQL query to update UserProfile table by user_id
  const updateProfileSQL = `UPDATE UserProfile SET location = ?, qualification = ?, employment_status = ?, skills = ?, experience = ?, interest = ?, bio = ? WHERE account_id = ? `;

  //const { contact_no, education, achievement, skills, experience, interest, bio } = updatedData;

  client.query(
    updateProfileSQL,
    [location, qualification, employment_status, skills, experience, interest, bio, user_id],
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
router.put('/api/userprofile', (req, res) => {
  //const user_id = req.params.user_id;

  var user_id = req.body.user_id;

  // SQL query to retrieve a user profile by user_id
  const getProfileSQL = `SELECT * FROM UserProfile WHERE account_id = ?`;

  client.query(getProfileSQL, [user_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching the user profile.');
    } else {
      if (result && result.length > 0) {
        const userProfile = result[0];
        res.status(200).json({ message: 'User profile retrieved successfully', result });
      } else {
        res.status(404).send('User profile not found.');
      }
    }
  });
});


//selecting all userprofiles

router.get('/api/profile', (req, res) => {
  // SQL query to select all jobs
  const selectAllProfileSQL = 'SELECT * FROM tut_alumni';

  client.query(selectAllProfileSQL, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching UserProfiles.');
    } else {
      if (result && result.length > 0) {
        res.status(200).json({ userProfile : result });
      }
    }
  });
});





// Route to insert a new job
router.post('/api/newjob', (req, res) => {

  var job_title = req.body.job_title;
  var Organisation = req.body.Organisation;
  var workplace_type = req.body.workplace_type;
  var location = req.body.location;
  var job_type = req.body.job_type;
  var job_description = req.body.job_description;
  var date_posted = req.body.date_posted;
  var deadline = req.body.deadline;

  console.log(job_title);
  console.log(Organisation);
  console.log(workplace_type);
  console.log(location);
  console.log(job_type);
  console.log(job_description);
  console.log(date_posted);
  console.log(deadline);


  // Handle the data on the server as needed

  // SQL query to insert into Jobs table
  const insertJobSQL = `INSERT INTO joblisting (job_title, Organisation, workplace_type, location, job_type, job_description,date_posted,deadline) VALUES (?, ?, ?, ?, ?, ?,?,?)`;

  client.query(
    insertJobSQL,
    [job_title, Organisation, workplace_type, location, job_type, job_description,new Date(),deadline],
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
  const receivedData = req.body;

  var job_type = req.body.job_type;
  var job_title = req.body.job_title;
  var organisation = req.body.organisation;
  var job_description = req.body.job_description;
  var location = req.body.location;
  var deadline = req.body.deadline;
  var workplace_type = req.body.workplace_type;

  // Handle the data on the server as needed
  console.log('Received data for updating job:', receivedData);

  // Send a response back to the client
  res.status(200).json({ message: 'Data received on the server for updating job', data: receivedData });

  // SQL query to update Job table by job_id
  const updateJobSQL = `UPDATE joblisting SET job_title = ?, organisation = ?, location = ?, workplace_type = ? , job_type = ?, job_description, deadline = ?, WHERE job_id = ? `;


  client.query(
    updateJobSQL,
    [job_title, organisation, location, workplace_type,job_type,job_description, deadline, job_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred during job update.');
      } else {
        console.log('Job updated successfully!');
      }
    }
  );
});


//deleting a job
router.delete('/api/job/delete/:job_id', (req, res) => {
  const job_id = req.body.job_id;
  console.log(job_id);
  // SQL query to delete a job by its ID
  const deleteJobSQL = 'DELETE FROM joblisting WHERE job_id = ?';

  client.query(deleteJobSQL, [job_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred during job deletion.' });
    } else {
      if (result.affectedRows > 0) {
        console.log('Job deleted successfully!');
        return res.status(200).json({ message: 'Job deleted successfully.' });
      } else {
        
        return res.status(404).json({ message: 'Job not found.' });
      }
    }
  });
});

//getting job by its id

router.get('/api/job/:id', (req, res) => {
  const jobId = req.body.id;
  console.log(jobId);

  // SQL query to select a job by its ID
  const selectJobSQL = 'SELECT * FROM joblisting WHERE job_id = ?';

  client.query(selectJobSQL, [jobId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching the job id.');
    } else {
      if (result && result.length > 0) {
        //console.log("something");
        const user = result[0];
        res.status(200).json({ message: 'Job id retrieved successfully', data: user });
      } else {
        res.status(404).send('Job not found.');
      }
    }
  });
});

//selecting all jobs

router.get('/api/jobs', (req, res) => {
  // SQL query to select all jobs
  const selectAllJobsSQL = 'SELECT * FROM joblisting';

  client.query(selectAllJobsSQL, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching jobs.');
    } else {
      if (result && result.length > 0) {
        res.status(200).json({ jobs: result });
      }
    }
  });
});

//search jobs
router.post('/api/search/jobs', (req, res) => {
  const { job_type, location, date_posted } = req.body;

  // SQL query to search for jobs based on the provided parameters
  const searchJobsSQL = 'SELECT * FROM joblisting WHERE job_type = ? AND location = ? AND date_posted = ?';

  client.query(searchJobsSQL, [job_type, location, date_posted], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching the job id.');
    } else {
      if (result && result.length > 0) {
        //console.log("something");
        const user = result[0];
        console.log(result);
        res.status(200).json({ message: 'Job id retrieved successfully', result });
      } else {
        res.status(404).send('Job not found.');
      }
    }
  });
});

//auto deleting job
router.post('/api/deletejobs', (req, res) => {

  const selectAllJobsSQL = 'SELECT * FROM joblisting';

  client.query(selectAllJobsSQL, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching jobs.');
    } else {
      if (result && result.length > 0) {
        const currentTime = new Date();
        console.log(currentTime);
        //loop all the jobs
        for (let i = 0; i < result.length; i++) {
          //check if job is expiring
          const jobDeadline = new Date(result[i].deadline);
          console.log(jobDeadline);

          if (currentTime >= jobDeadline) {
            
                const deleteJobSQL = 'DELETE FROM joblisting WHERE job_id = ?';
                client.query(deleteJobSQL, [result[i].job_id], (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'An error occurred during job deletion.' });
                  }
                  console.log('Job deleted successfully: ');
                });
              } else {
                console.log('Job ' + result[i].job_title + ' is not expiring today.');
              }
            }
        res.json({ message: 'Expired jobs will be deleted' });
      } else {
        res.json({ message: 'No expired jobs to delete' });
      }
    }
  });
});


//count all available events
router.get('/api/count_job', (req, res) => {
  // MySQL query to count alumni
  const query = 'SELECT COUNT(*) AS job_count FROM joblisting';

  client.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving Job count:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const jobCount = results[0].job_count;
    res.json({ job_count: jobCount });
  });
});




//Add Event
router.post('/api/event', upload.single('file'), function (req, res) {
  var event_title = req.body.event_title;
  var event_description = req.body.event_description;
  var event_date = new Date();

  // SQL query to insert into Events table
  const insertJobSQL = `INSERT INTO Event (event_title,event_description,event_date) VALUES (?, ?, ?)`;

  client.query(
    insertJobSQL,
    [event_title, event_description, event_date],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred during job insertion.');
      } else {
        console.log('Event inserted successfully!');
        res.status(200).json({ message: 'Event inserted successfully!' });
      }
    }
  );
});

//Get
router.get('/api/event/:id', function (req, res) {
  var eventId = req.body.eventId;


  // SQL query to select a job by its ID
  const selectJobSQL = 'SELECT * FROM Event WHERE event_id = ?';

  client.query(selectJobSQL, [eventId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching the job id.');
    } else {
      if (result && result.length > 0) {
        //console.log("something");
        const user = result[0];
        res.status(200).json({ message: 'Event id retrieved successfully', data: user });
      } else {
        res.status(404).send('Event not found.');
      }
    }
  });
});

//Get all events
router.get('/api/events', (req, res) => {
  // SQL query to select all jobs
  const selectAllJobsSQL = 'SELECT * FROM Event';

  client.query(selectAllJobsSQL, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching Events.');
    } else {
      if (result && result.length > 0) {
        res.status(200).json({ events: result });
      }
    }
  });
});

//updating events
router.put('/api/event/:event_id', (req, res) => {
  const event_id  = req.body.event_id ;
  const receivedData = req.body;

 // var alumni_id = req.body.alumni_id;
  var event_title = req.body.event_title;
  var event_description = req.body.event_description;
  var event_date = req.body.event_date;
 

  // Handle the data on the server as needed
  console.log('Received data for updating event:', receivedData);

  // Send a response back to the client
  res.status(200).json({ message: 'Data received on the server for updating event', data: receivedData });

  // SQL query to update Job table by job_id
  const updateEventSQL = `UPDATE Event SET event_title = ?, event_description = ?, event_date = ? WHERE event_id = ?`;

  client.query(
    updateEventSQL,
    [event_title, event_description, event_date, event_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred during event update.');
      } else {
        console.log('Event updated successfully!');
      }
    }
  );
});

//deleting an event
router.delete('/api/event/delete/:event_id', (req, res) => {
  const event_id = req.body.event_id;
  console.log(event_id);
 
  const deleteEventSQL = 'DELETE FROM Event WHERE event_id = ?';

  client.query(deleteEventSQL, [event_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred during Event deletion.' });
    } else {
      if (result.affectedRows > 0) {
        console.log('Event deleted successfully!');
        return res.status(200).json({ message: 'Event deleted successfully.' });
      } else {
        
        return res.status(404).json({ message: 'Event not found.' });
      }
    }
  });
});

//count all available events
router.get('/api/count_event', (req, res) => {
  // MySQL query to count alumni
  const query = 'SELECT COUNT(*) AS event_count FROM Event';

  client.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving event count:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const eventCount = results[0].event_count;
    res.json({ event_count: eventCount });
  });
});




router.post('/api/upload', upload.single('file_name'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  const picturePath = req.file.path;

  // Get the file type from the request body
  const fileType = req.body.fileType;

  let uploadDirectory = 'uploads/others/'; // Default directory if fileType is not recognized

  switch (fileType) {
      case 'profile':
          uploadDirectory = 'uploads/profiles/';
          break;
      case 'post':
          uploadDirectory = 'uploads/posts/';
          break;
      case 'academic':
          uploadDirectory = 'uploads/docs/academic/';
          break;
      case 'certificate':
          uploadDirectory = 'uploads/docs/certs/';
          break;
      // Add more cases as needed for different file types
  }

  // Move the file to the appropriate directory
  fs.rename(picturePath, uploadDirectory + req.file.originalname, (err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error saving picture to the server' });
      }

      res.json({ success: true, message: 'Picture uploaded and saved successfully' });
  });
});

//Folder to serve(save) on
router.use('/uploads', express.static(__dirname + '/uploads'));

router.get('/getDocument/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = __dirname + '/uploads/' + fileName;

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // The file does not exist
      res.status(404).send('File not found');
    } else {
      // The file exists, so serve it
      res.sendFile(filePath);
    }
  });
});

//count all available alumni
router.get('/api/count_alumni', (req, res) => {
  // MySQL query to count alumni
  const query = 'SELECT COUNT(*) AS alumni_count FROM Tut_Alumni';

  client.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving alumni count:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const alumniCount = results[0].alumni_count;
    res.json({ alumni_count: alumniCount });
  });
});

module.exports = router;

