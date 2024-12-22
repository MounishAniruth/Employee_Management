const express = require('express');
const db = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Signup function
router.post("/signup", async (req, res) => {
  const { name, phone, email, password, userType } = req.body;

  // Check if phone number already exists
  db.query('SELECT * FROM Users WHERE phone = ?', [phone], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error checking user' });
    if (results.length > 0) return res.status(400).json({ message: 'Phone number already in use' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    db.query('INSERT INTO Users (name, phone, email, password, user_type) VALUES (?, ?, ?, ?, ?)', 
    [name, phone, email, hashedPassword, userType], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error creating user' });
      res.status(201).json({ message: 'User created successfully' });
    });
  });
});

// Login function
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body; // Now "identifier" can be either phone or email

  // Check if the identifier is a phone or email
  const isPhone = /^[0-9]{10}$/.test(identifier); // Simple regex to check if it's a phone number
  let query = '';
  let queryParams = [identifier];

  if (isPhone) {
    query = 'SELECT * FROM Users WHERE phone = ?';
  } else {
    query = 'SELECT * FROM Users WHERE email = ?';
  }

  // Check if user exists
  db.query(query, queryParams, async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'Invalid phone/email or password' });

    const user = results[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid phone/email or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  });
});

module.exports = router;