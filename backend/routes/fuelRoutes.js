const express = require("express");
const router = express.Router();
const Fuel = require("../models/Fuel");

// Add a new fuel entry
router.post("/add", (req, res) => {
  try {
     const { registration_number, date_filled, bunk_name, litres_filled, price_per_litre, amount_paid } = req.body;
     if (!registration_number || !date_filled || !bunk_name || !litres_filled || !price_per_litre || !amount_paid) {
         return res.status(400).json({ error: "Missing fields. Please provide all required data." });
     }

     Fuel.getLorryIdByRegistration(registration_number, (err, lorry_id) => {
         if (err) return res.status(500).json({ error: err });
         if (!lorry_id) return res.status(404).json({ error: "Lorry not found." });

         Fuel.addFuelEntry({ lorry_id, date_filled, bunk_name, litres_filled, price_per_litre, amount_paid }, (err, result) => {
             if (err) return res.status(500).json({ error: err });
             res.status(201).json({ message: "Fuel entry added successfully." });
         });
     });
  } catch (error) {
     res.status(500).json({ error: "Internal server error occurred." });
  }
});


// Fetch fuel entries by registration number
router.get("/byRegistration/:registration_number", (req, res) => {
  const { registration_number } = req.params;

  if (!registration_number) {
    return res.status(400).json({ error: "Registration number is required" });
  }

  // Step 1: Get the lorry ID from the registration number
  Fuel.getLorryIdByRegistration(registration_number, (err, lorry_id) => {
    if (err) return res.status(500).json({ error: err });

    // Handle case where no lorry was found
    if (!lorry_id) {
      return res.status(404).json({ error: "No lorry found with that registration number" });
    }

    // Step 2: Fetch fuel entries by lorry ID
    Fuel.fetchFuelEntriesByLorry(lorry_id, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json(results);
    });
  });
});

module.exports = router;
