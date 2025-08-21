const mysql = require('mysql2');
require('dotenv').config();

// Check if we are on Railway (which provides DATABASE_URL)
if (process.env.DATABASE_URL) {
  console.log("Using Railway DATABASE_URL...");
  var connection = mysql.createConnection(process.env.DATABASE_URL);
} else {
  console.log("Using local .env configuration...");
  // Fall back to local .env variables for development
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    // This is a critical error, crash the app if it can't connect to the DB
    process.exit(1);
    return;
  }
  console.log('Connected to MySQL database!');

  // Create the table if it doesn't exist (CRITICAL FOR RAILWAY)
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
      console.log('Users table is ready or already exists!');
    }
  });
});

module.exports = connection;