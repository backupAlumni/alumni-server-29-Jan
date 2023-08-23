const { Client } = require("pg");

// Database connection details
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Alumni_Space_DB",
  password: "123",
  port: 5432,
});

// Connect to the database
client.connect();

module.exports = client;