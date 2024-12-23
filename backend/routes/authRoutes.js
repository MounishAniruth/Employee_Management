const express = require('express');
const db=require("../config/db");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup function
router.post("/signup",async (req, res) => {
  const { name, phone, email, password, userType } = req.body;


  // Check if the phone number already exists
const checkQuery = 'SELECT * FROM Users WHERE phone = ?';
  db.query(checkQuery, [phone], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error checking user' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO Users (name, phone, email, password, user_type) VALUES (?, ?, ?, ?, ?)';
    const values = [name, phone, email, hashedPassword, userType];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating user' });
      }
      res.status(201).json({ message: 'User created successfully' });
    });
  });
});


// Login function
/*router.post("/login",async (req, res) => {
  const { phone, password } = req.body;
  
  const query = 'SELECT * FROM Users WHERE phone = ?';
  db.query(query, [phone], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  });
});
*/

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body; // Use 'identifier' in the request body

  // Check if the provided input is an email or phone number
  const isEmail = identifier.includes("@");

  // Adjust the query based on the input type
  const query = isEmail
    ? "SELECT * FROM Users WHERE email = ?"
    : "SELECT * FROM Users WHERE phone = ?";

  db.query(query, [identifier], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Invalid email/phone or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/phone or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  });
});



module.exports = router;