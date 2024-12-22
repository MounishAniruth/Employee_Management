const express = require('express');
const router = express.Router();
const Lorry = require('../models/Lorry');

// Route to fetch all lorries
router.get('/', (req, res) => {
  Lorry.getAllLorries((err, lorries) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching lorries', error: err });
    }
    res.status(200).json(lorries);
  });
});

// Route to add a new lorry
router.post('/', (req, res) => {
  const { registration_number, driver_name, fuel_capacity, load_capacity } = req.body;
  
  if (!registration_number || !driver_name || !fuel_capacity || !load_capacity) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newLorry = { registration_number, driver_name, fuel_capacity, load_capacity };

  Lorry.addLorry(newLorry, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding lorry', error: err });
    }
    res.status(201).json({ message: 'Lorry added successfully', result });
  });
});

module.exports = router;
