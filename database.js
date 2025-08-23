// database.js
const mysql = require('mysql2');

// Create a connection POOL (not a single connection)
const pool = mysql.createPool({
  uri: process.env.DABASE_URL, // Railway's connection string
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10, // Max number of connections in the pool
  queueLimit: 0,
  acquireTimeout: 60000, // 60 seconds timeout for getting a connection
  timeout: 60000, // 60 seconds timeout for queries
});

// Convert the pool to use promises (cleaner code with async/await)
const promisePool = pool.promise();

// Test the connection when the app starts
promisePool.getConnection()
  .then((connection) => {
    console.log('Connected to MySQL database!');
    connection.release(); // Release the connection back to the pool

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
  });

// Export the promise-based pool
module.exports = promisePool;