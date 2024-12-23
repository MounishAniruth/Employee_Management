const express = require('express');
const router = express.Router();
const Lorry = require('../models/Lorry');
const db = require("../config/db");

// Add a new lorry
router.post('/add', async (req, res) => {
  const { registration_number, owner_phone, model, year_built } = req.body;

  // Check if the lorry with the same registration number already exists
  const checkQuery = 'SELECT * FROM lorries WHERE registration_number = ?';
  db.query(checkQuery, [registration_number], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error checking lorry' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Lorry with this registration number already exists' });
    }

    // Add the new lorry to the database
    const query = 'INSERT INTO lorries (registration_number, owner_phone, model, year_built) VALUES (?, ?, ?, ?)';
    const values = [registration_number, owner_phone, model, year_built];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error adding lorry' });
      }
      res.status(201).json({ message: 'Lorry added successfully', lorry: results });
    });
  });
});

// Get all lorries
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM lorries';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching lorries' });
    }
    res.status(200).json(results);
  });
});

// Delete a lorry by registration number
router.delete('/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  // Delete the lorry from the database
  const query = 'DELETE FROM lorries WHERE registration_number = ?';
  
  db.query(query, [registrationNumber], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting lorry' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lorry not found' });
    }
    res.status(200).json({ message: 'Lorry deleted successfully' });
  });
});

module.exports = router;
