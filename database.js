const mysql = require('mysql2');

// Only load .env file for local development, not on Railway
if (!process.env.DATABASE_URL) {
  require('dotenv').config();
}

// Decide which configuration to use: Railway or Local
let connection;
if (process.env.DATABASE_URL) {
  // Production: Use Railway's provided connection string
  connection = mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }  // Required for secure cloud connections
  });
} else {
  // Development: Use local .env variables
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}

// Attempt to connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL database!');

  // Create the users table if it doesn't exist
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
});

module.exports = connection;