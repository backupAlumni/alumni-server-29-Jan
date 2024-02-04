/*const mysql = require('mysql');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  port: '3306',
  database: 'test',
});

pool.on('connection', (connection) => {
  console.log('Connected to database');
});

module.exports = {
  getConnection: (callback) => {
    pool.getConnection((err, connection) => {
      callback(err, connection);
    });
  },
};*/


var mysql = require('mysql');

const client = mysql.createConnection({
    host: 'sql8.freemysqlhosting.net',
  user: 'sql8681551',
  port:"3306",
  password: 'lE5YDHivkL',
  database: 'sql8681551',

  });

  client.on('connection', (connection) => {
    console.log('Connected to database');
  });
  
  module.exports = client;
