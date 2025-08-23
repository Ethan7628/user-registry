// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./database'); // Import the promise pool
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 1. CREATE USER ENDPOINT (POST /register)
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: true, message: 'Please provide all fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Use the connection pool with async/await
    const [results] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({
      error: false,
      message: `User created with ID: ${results.insertId}`
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: true,
      message: 'Error creating user. Please try again.'
    });
  }
});

// 2. GET ALL USERS ENDPOINT (GET /users)
app.get('/users', async (req, res) => {
  try {
    // Use the connection pool
    const [results] = await pool.execute('SELECT id, username, email FROM users');
    
    res.json({
      error: false,
      users: results
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching users'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});