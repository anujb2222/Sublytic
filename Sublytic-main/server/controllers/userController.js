// server/controllers/userController.js
console.log('--- userController.js file is being loaded ---');

// --- 1. Module Imports ---
// If the server crashes before the next log, there's an issue with one of these imports.
const db = require('../models/userModel');
console.log('Database module loaded successfully.');

const bcrypt = require('bcryptjs');
console.log('bcryptjs module loaded successfully.');

const jwt = require('jsonwebtoken');
console.log('jsonwebtoken module loaded successfully.');

const JWT_SECRET = process.env.JWT_SECRET || 'subtracker_secret_key';

// --- 2. Register Function ---
const registerUser = (req, res) => {
  console.log('--- Register function started ---');
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
      .run(username, hashedPassword);

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('!!! A runtime error occurred in registerUser:', err);
    res.status(500).json({ error: 'Failed to register user', details: err.message });
  }
};

// --- 3. Login Function ---
const loginUser = (req, res) => {
  console.log('--- Login function started ---');
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    console.log('User fetched from database:', user); // Check if the user is found

    if (user && bcrypt.compareSync(password, user.password)) {
      console.log('Password is correct. Creating token...');
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, username: user.username });
    } else {
      console.log('Invalid credentials. Sending 401 error.');
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('!!! A runtime error occurred in loginUser:', err);
    res.status(500).json({ error: 'Failed to log in', details: err.message });
  }
};

// --- 4. Exports ---
// This makes the functions available to your routes file.
module.exports = {
  registerUser,
  loginUser,
};