const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Lorry = require("../models/Lorry");
const db = require("../config/db");

// Middleware to verify if the user is an authenticated owner
const verifyOwner = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided");
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Use your JWT secret here
    req.user = decoded; // Attach user data to request
    if (req.user.user_type !== "owner") {
      return res.status(403).send("Access Denied: Not an Owner");
    }
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
};

// Route to get all lorries
router.get("/lorry", (req, res) => {
  Lorry.findAll((err, lorries) => {
    if (err) {
      return res.status(500).send("Error fetching lorries");
    }
    return res.status(200).json(lorries); // Send lorries in JSON format
  });
});

// Route to get a lorry by registration number
router.get("/lorry/:registrationNumber", (req, res) => {
  const { registrationNumber } = req.params;

  Lorry.findByRegistrationNumber(registrationNumber, (err, lorry) => {
    if (err) {
      return res.status(500).send("Error fetching lorry details");
    }
    if (!lorry) {
      return res.status(404).send("Lorry not found");
    }
    return res.status(200).json(lorry);  // Send lorry details including the owner name
  });
});


// Route to add a new lorry
router.post("/lorry/add", (req, res) => {
  const { registration_number, owner_phone, model, year_built, owner_name } = req.body;

  if (!owner_name) {
    return res.status(400).send("Owner name is required");
  }

  console.log("Adding new lorry:", req.body); // Debug log
  const newLorry = { registration_number, owner_phone, model, year_built, owner_name };

  Lorry.addLorry(newLorry, (err, result) => {
    if (err) {
      console.error("Database Error:", err); // Debug log
      return res.status(500).send("Error adding lorry");
    }
    return res.status(201).send("Lorry added successfully");
  });
});


// Route to delete a lorry by registration number
router.delete("/lorry/:registration_number", (req, res) => {
  const { registration_number } = req.params;

  Lorry.deleteLorry(registration_number, (err, result) => {
    if (err) {
      return res.status(500).send("Error deleting lorry");
    }
    return res.status(200).send("Lorry deleted successfully");
  });
});

module.exports = router;
