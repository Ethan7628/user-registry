const mysql = require('mysql2');
require('dotenv').config(); // Add this line to load .env file

const connection = mysql.createConnection({
  host: process.env.DB_HOST,     // Uses the env variable
  user: process.env.DB_USER,     // Uses the env variable
  password: process.env.DB_PASSWORD, // Uses the env variable
  database: process.env.DB_NAME  // Uses the env variable
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = connection;