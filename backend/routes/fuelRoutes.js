const express = require("express");
const router = express.Router();

const Fuel = require("../models/Fuel");

const authMiddleware =
  require("../middleware/authMiddleware");


// =====================================================
// ADD FUEL
//
// OWNER
//     -> Any lorry
//
// MANAGER
//     -> Any lorry
//
// LORRY MANAGER
//     -> Assigned lorry only
// =====================================================

router.post(
  "/add",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        registration_number,
        date_filled,
        bunk_name,
        litres_filled,
        price_per_litre,
        amount_paid
      } = req.body;


      // =================================================
      // VALIDATE INPUT
      // =================================================

      if (
        !registration_number ||
        !date_filled ||
        !bunk_name ||
        litres_filled === undefined ||
        litres_filled === null ||
        price_per_litre === undefined ||
        price_per_litre === null ||
        amount_paid === undefined ||
        amount_paid === null
      ) {

        return res.status(400).json({
          error:
            "Missing fields. Please provide all required data."
        });

      }


      // =================================================
      // GET LORRY ID
      // =================================================

      const lorry_id =
        await Fuel.getLorryIdByRegistration(
          registration_number
        );


      if (!lorry_id) {

        return res.status(404).json({
          error:
            "Lorry not found."
        });

      }


      // =================================================
      // CHECK USER ACCESS
      //
      // OWNER        -> ANY
      // MANAGER      -> ANY
      // LORRY MANAGER -> ASSIGNED ONLY
      // =================================================

      const access =
        await Fuel.checkLorryAccess(
          lorry_id,
          req.user.id,
          req.user.user_type
        );


      if (!access.allowed) {

        return res.status(403).json({
          error:
            access.reason ||
            "You are not authorized to manage fuel for this lorry."
        });

      }


      // =================================================
      // ADD FUEL
      // =================================================

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

  }
);


// =====================================================
// GET FUEL DETAILS
//
// OWNER
//     -> Any lorry
//
// MANAGER
//     -> Any lorry
//
// LORRY MANAGER
//     -> Assigned lorry only
// =====================================================

router.get(
  "/byRegistration/:registration_number",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        registration_number
      } = req.params;


      const {
        startDate,
        endDate
      } = req.query;


      // =================================================
      // VALIDATE REGISTRATION NUMBER
      // =================================================

      if (!registration_number) {

        return res.status(400).json({
          error:
            "Registration number is required."
        });

      }


      // =================================================
      // FIND LORRY
      // =================================================

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


      // =================================================
      // CHECK USER ACCESS
      // =================================================

      const access =
        await Fuel.checkLorryAccess(
          lorry_id,
          req.user.id,
          req.user.user_type
        );


      if (!access.allowed) {

        return res.status(403).json({
          error:
            access.reason ||
            "You are not authorized to view fuel details for this lorry."
        });

      }


      // =================================================
      // FETCH FUEL
      // =================================================

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
// CLEAR ONE FUEL RECORD
//
// OWNER
//     -> Any lorry
//
// MANAGER
//     -> Any lorry
//
// LORRY MANAGER
//     -> Assigned lorry only
// =====================================================

router.put(
  "/clear/:fuelId",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        fuelId
      } = req.params;


      // =================================================
      // VALIDATE FUEL ID
      // =================================================

      if (!fuelId) {

        return res.status(400).json({
          error:
            "Fuel ID is required."
        });

      }


      // =================================================
      // GET LORRY ID FROM FUEL RECORD
      // =================================================

      const lorry_id =
        await Fuel.getLorryIdByFuelId(
          fuelId
        );


      if (!lorry_id) {

        return res.status(404).json({
          error:
            "Fuel record not found."
        });

      }


      // =================================================
      // CHECK USER ACCESS
      //
      // OWNER        -> ANY
      // MANAGER      -> ANY
      // LORRY MANAGER -> ASSIGNED ONLY
      // =================================================

      const access =
        await Fuel.checkLorryAccess(
          lorry_id,
          req.user.id,
          req.user.user_type
        );


      if (!access.allowed) {

        return res.status(403).json({
          error:
            access.reason ||
            "You are not authorized to clear fuel for this lorry."
        });

      }


      // =================================================
      // CLEAR FUEL
      // =================================================

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