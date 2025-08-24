// database.js
const mysql = require('mysql2');

// DEBUG: Check if the environment variable is loaded
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

// Get the database URL from Railway (this is the MOST IMPORTANT LINE)
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("FATAL: DATABASE_URL environment variable is not set on Railway");
  // Don't exit, but the app won't work without this
}

// Create a connection pool with the Railway database URL
const pool = mysql.createPool({
  uri: databaseUrl, // Use the URL from Railway
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Convert to promise-based pool
const promisePool = pool.promise();

// Test the connection
promisePool.getConnection()
  .then((connection) => {
    console.log('Successfully connected to MySQL database on Railway!');
    connection.release();

    // Create users table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    return promisePool.execute(createTableSQL);
  })
  .then(() => {
    console.log('Users table is ready!');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    console.error('This usually means:');
    console.error('1. DATABASE_URL is incorrect or missing');
    console.error('2. The database server is not running');
    console.error('3. Network issues between your app and database');
  });

module.exports = promisePool;