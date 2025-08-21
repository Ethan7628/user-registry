// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('./database'); // Import the connection
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // This allows us to parse JSON bodies
app.use(express.static('public')); // Serve static files from the public directory

// 1. CREATE USER ENDPOINT (POST /register)
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Please provide username, email, and password');
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user into the database
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [username, email, hashedPassword], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error creating user. Maybe email already exists?');
      }
      res.status(201).send(`User created with ID: ${results.insertId}`);
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during registration');
  }
});

// 2. GET ALL USERS ENDPOINT (GET /users) - To see your results!
app.get('/users', (req, res) => {
  const sql = 'SELECT id, username, email FROM users'; // Never select the password!
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching users');
    }
    res.json(results); // Send the results as JSON
  });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use cloud port or 3000 if local
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});