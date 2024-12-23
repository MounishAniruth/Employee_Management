const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Lorry = require('../models/Lorry');
const db = require('../config/db');

// Middleware to verify if the user is an authenticated owner
const verifyOwner = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your JWT secret here
    req.user = decoded; // Attach user data to request
    if (req.user.user_type !== 'owner') {
      return res.status(403).send('Access Denied: Not an Owner');
    }
    next();
  } catch (err) {
    return res.status(400).send('Invalid Token');
  }
};

// Route to get all lorries
// Example of using Lorry.findAll in a route
router.get('/lorry', (req, res) => {
  Lorry.findAll((err, lorries) => {
    if (err) {
      return res.status(500).send('Error fetching lorries');
    }
    return res.status(200).json(lorries); // Send lorries in JSON format
  });
});

// Example of using Lorry.addLorry in a route
router.post('/lorry/add', (req, res) => {
  const { registration_number, owner_phone, model, year_built } = req.body;

  const newLorry = { registration_number, owner_phone, model, year_built };

  Lorry.addLorry(newLorry, (err, result) => {
    if (err) {
      return res.status(500).send('Error adding lorry');
    }
    return res.status(201).send('Lorry added successfully');
  });
});

// Example of using Lorry.deleteLorry in a route
router.delete('/lorry/:registration_number', (req, res) => {
  const { registration_number } = req.params;

  Lorry.deleteLorry(registration_number, (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting lorry');
    }
    return res.status(200).send('Lorry deleted successfully');
  });
});
module.exports = router;
