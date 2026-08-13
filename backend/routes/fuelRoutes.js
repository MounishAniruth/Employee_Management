const express = require("express");
const router = express.Router();

const Fuel = require("../models/Fuel");


// =====================================================
// ADD FUEL
// =====================================================

router.post("/add", async (req, res) => {

  try {

    const {
      registration_number,
      date_filled,
      bunk_name,
      litres_filled,
      price_per_litre,
      amount_paid
    } = req.body;


    if (
      !registration_number ||
      !date_filled ||
      !bunk_name ||
      !litres_filled ||
      !price_per_litre ||
      !amount_paid
    ) {

      return res.status(400).json({
        error:
          "Missing fields. Please provide all required data."
      });

    }


    // Get lorry ID

    const lorry_id =
      await Fuel.getLorryIdByRegistration(
        registration_number
      );


    if (!lorry_id) {

      return res.status(404).json({
        error: "Lorry not found."
      });

    }


    // Insert fuel

    const fuelId =
      await Fuel.addFuelEntry({
        lorry_id,
        date_filled,
        bunk_name,
        litres_filled,
        price_per_litre,
        amount_paid
      });


    return res.status(201).json({

      message:
        "Fuel entry added successfully.",

      fuelId

    });


  } catch (error) {

    console.error(
      "Error adding fuel:",
      error
    );

    return res.status(500).json({

      error:
        error.message ||
        "Internal server error."

    });

  }

});


// =====================================================
// GET FUEL DETAILS
// =====================================================

router.get(
  "/byRegistration/:registration_number",
  async (req, res) => {

    try {

      const {
        registration_number
      } = req.params;

      const {
        startDate,
        endDate
      } = req.query;


      if (!registration_number) {

        return res.status(400).json({
          error:
            "Registration number is required."
        });

      }


      // Find lorry

      const lorry_id =
        await Fuel.getLorryIdByRegistration(
          registration_number
        );


      if (!lorry_id) {

        return res.status(404).json({
          error:
            "No lorry found with that registration number."
        });

      }


      // Get all fuel records

      const results =
        await Fuel.fetchFuelEntriesByLorry(
          lorry_id,
          startDate,
          endDate
        );


      return res.status(200).json(
        results
      );


    } catch (error) {

      console.error(
        "Error fetching fuel:",
        error
      );

      return res.status(500).json({

        error:
          error.message ||
          "Failed to fetch fuel details."

      });

    }

  }
);


// =====================================================
// CLEAR ONE PARTICULAR FUEL RECORD
// =====================================================

router.put(
  "/clear/:fuelId",
  async (req, res) => {

    try {

      const {
        fuelId
      } = req.params;


      if (!fuelId) {

        return res.status(400).json({

          error:
            "Fuel ID is required."

        });

      }


      const affectedRows =
        await Fuel.clearFuelRecord(
          fuelId
        );


      if (affectedRows === 0) {

        return res.status(404).json({

          error:
            "Fuel record not found."

        });

      }


      return res.status(200).json({

        message:
          "Fuel record marked as cleared."

      });


    } catch (error) {

      console.error(
        "Error clearing fuel record:",
        error
      );


      return res.status(500).json({

        error:
          error.message ||
          "Failed to clear fuel record."

      });

    }

  }
);


module.exports = router;