// database.js
const mysql = require('mysql2');

console.log("=== DEBUG: Environment Check ===");
console.log("Is DATABASE_URL defined?", !!process.env.DATABASE_URL);
console.log("All environment variables:", Object.keys(process.env));

// Only load the .env file if we are in development (not on Railway)
if (!process.env.DATABASE_URL) {
  console.log("Running locally. Attempting to load .env file...");
  require('dotenv').config();
  console.log("Loaded .env. Now is DB_HOST defined?", !!process.env.DB_HOST);
} else {
  console.log("Running on Railway. Using DATABASE_URL.");
}

// Decide which configuration to use
let connectionConfig;
if (process.env.DATABASE_URL) {
  console.log("Using Railway DATABASE_URL...");
  connectionConfig = {
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
} else if (process.env.DB_HOST) {
  console.log("Using local .env configuration...");
  connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };
} else {
  console.error("FATAL: No database configuration found!");
  process.exit(1);
}

console.log("Attempting to connect with config:", {
  ...connectionConfig,
  password: connectionConfig.password ? '***HIDDEN***' : undefined
});

const connection = mysql.createConnection(connectionConfig);

// ... rest of your connection code remains the same ...
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database!');
  
  const createTableSQL = `CREATE TABLE IF NOT EXISTS users (...)`;
  connection.query(createTableSQL, (err) => {
    if (err) console.error('Error creating table:', err);
    else console.log('Users table is ready!');
  });
});

module.exports = connection;