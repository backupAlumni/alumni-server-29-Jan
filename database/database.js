var mysql = require('mysql');

const client = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    port:"3306",
    database: 'Jobs',
  });

  client.on('connection', (connection) => {
    console.log('Connected to database');
  });
  
  module.exports = client;