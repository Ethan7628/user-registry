// database.js
const mysql = require('mysql2');

// SIMPLE DEBUG: Check if the crucial Railway variable exists
console.log("DEBUG: Checking for DATABASE_URL...");
if (process.env.DATABASE_URL) {
  console.log("SUCCESS: Found DATABASE_URL from Railway");
} else {
  console.log("ERROR: DATABASE_URL is not defined. Check Railway Variables tab.");
  // Don't exit, just log the error for now to avoid the crash loop.
}

// Use Railway's DATABASE_URL if it exists, otherwise do nothing.
let connection = null;
if (process.env.DATABASE_URL) {
  try {
    connection = mysql.createConnection({
      uri: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database!');
    
    // Create table code here - USE THE COMPLETE SQL STATEMENT
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    connection.query(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table is ready!');
      }
    });
  }
});
    
  } catch (error) {
    console.error('Failed to create database connection:', error);
  }
} else {
  console.error("Cannot create database connection: DATABASE_URL is missing");
}

module.exports = connection;