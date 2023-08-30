const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express.Router();

app.use(bodyParser.json());
app.use(cors()); 

app.post('/api/login', (req, res) => {
  const receivedData = req.body;
  console.log('Received data:', receivedData);

  // Handle the data on the server as needed
  console.log('Email:', receivedData.email);
  console.log('Password:', receivedData.password);

  // Send a response back to the client
  res.status(200).json({ message: 'Data received on the server', data: receivedData });
});

app.post('/api/register', (req, res) => {
  const receivedData = req.body;
  console.log('Received data:', receivedData);

  // Handle the data on the server as needed
  console.log('Full Name:', receivedData.fullname);
  console.log('Sutdent Email:', receivedData.email);
  console.log('Password:', receivedData.password);

  // Send a response back to the client
  res.status(200).json({ message: 'Data received on the server', data: receivedData });
});

module.exports = app;

