const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Lorry = require("../models/Lorry");
const db = require("../config/db");


// Route to get all lorries
router.get("/", (req, res) => {
  const query = `
    SELECT lorries.*, users.phone AS owner_phone
    FROM lorries
    LEFT JOIN users ON lorries.owner_id = users.id
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching lorries:", err);
      return res.status(500).send("Error fetching lorries");
    }
    return res.status(200).json(result); // Send all lorries in JSON format
  });
});

// Route to get a lorry by registration number
router.get("/:id", (req, res) => {
  const lorryId = req.params.id;
  Lorry.findById(lorryId, (err, lorry) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching lorry" });
    }
    if (!lorry) {
      return res.status(404).json({ error: "Lorry not found" });
    }
    res.json(lorry);
  });
});

// Route to add a new lorry
router.post("/add", (req, res) => {
  const { registration_number, owner_phone, model, year_built, owner_name } = req.body;

  if (!owner_name || !registration_number || !owner_phone || !model || !year_built) {
    return res.status(400).send("All fields are required");
  }

  // Find the owner by phone
  const findOwnerQuery = "SELECT id FROM users WHERE phone = ?";
  db.query(findOwnerQuery, [owner_phone], (err, ownerResult) => {
    if (err) {
      console.error("Error fetching owner by phone:", err);
      return res.status(500).send("Error fetching owner");
    }

    if (ownerResult.length === 0) {
      return res.status(404).send("Owner not found with the provided phone");
    }

    const owner_id = ownerResult[0].id;

    // Insert the new lorry into the database
    const insertQuery = `
      INSERT INTO lorries (registration_number, owner_id, model, year_built, owner_name)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [registration_number, owner_id, model, year_built, owner_name], (err, result) => {
      if (err) {
        console.error("Error inserting lorry:", err);
        return res.status(500).send("Error adding lorry");
      }
      return res.status(201).send("Lorry added successfully");
    });
  });
});

// Route to delete a lorry by registration number
router.delete("/:registrationNumber", (req, res) => {
  const { registrationNumber } = req.params;

  const deleteQuery = "DELETE FROM lorries WHERE registration_number = ?";
  db.query(deleteQuery, [registrationNumber], (err, result) => {
    if (err) {
      console.error("Error deleting lorry:", err);
      return res.status(500).send("Error deleting lorry");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Lorry not found");
    }
    return res.status(200).send("Lorry deleted successfully");
  });
});

module.exports = router;
