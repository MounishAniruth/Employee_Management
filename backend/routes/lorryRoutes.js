const express = require("express");
const router = express.Router();

const Lorry = require("../models/Lorry");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { ROLES } = require("../utils/constants");


// =====================================================
// GET ALL LORRIES
//
// OWNER          -> ALL
// MANAGER        -> ALL
// LORRY MANAGER  -> ASSIGNED LORRY ONLY
// =====================================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const userType = req.user.user_type;


      // ================================================
      // VALID ROLE CHECK
      // ================================================

      if (
        userType !== ROLES.OWNER &&
        userType !== ROLES.MANAGER &&
        userType !== ROLES.LORRY_MANAGER
      ) {

        return res.status(403).json({
          message: "Invalid user role."
        });

      }


      // ================================================
      // GET LORRIES
      // ================================================

      const lorries =
        await Lorry.findAll(req.user);


      return res.status(200).json(
        lorries
      );

    } catch (error) {

      console.error(
        "Error fetching lorries:",
        error
      );

      return res.status(500).json({
        message:
          "Error fetching lorries",
        error:
          error.message
      });

    }

  }
);


// =====================================================
// GET ALL LORRY MANAGERS
//
// OWNER ONLY
// =====================================================

router.get(
  "/managers",
  authMiddleware,
  roleMiddleware(ROLES.OWNER),
  async (req, res) => {

    try {

      const managers =
        await Lorry.getLorryManagers();


      return res.status(200).json(
        managers
      );

    } catch (error) {

      console.error(
        "Error fetching lorry managers:",
        error
      );

      return res.status(500).json({
        message:
          "Error fetching lorry managers",
        error:
          error.message
      });

    }

  }
);


// =====================================================
// GET ASSIGNED LORRY
//
// LORRY MANAGER ONLY
//
// Returns the lorry assigned to the logged-in
// lorry manager.
// =====================================================

router.get(
  "/assigned",
  authMiddleware,
  roleMiddleware(ROLES.LORRY_MANAGER),
  async (req, res) => {

    try {

      const lorry =
        await Lorry.findAssignedLorry(
          req.user.id
        );


      // ================================================
      // NO LORRY ASSIGNED
      // ================================================

      if (!lorry) {

        return res.status(404).json({
          message:
            "No lorry is currently assigned to you."
        });

      }


      // ================================================
      // SUCCESS
      // ================================================

      return res.status(200).json(
        lorry
      );

    } catch (error) {

      console.error(
        "Error fetching assigned lorry:",
        error
      );

      return res.status(500).json({
        message:
          "Error fetching assigned lorry",
        error:
          error.message
      });

    }

  }
);


// =====================================================
// GET LORRY BY ID
//
// OWNER          -> ANY LORRY
// MANAGER        -> ANY LORRY
// LORRY MANAGER  -> ASSIGNED LORRY ONLY
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const lorryId =
        Number(req.params.id);


      if (!lorryId) {

        return res.status(400).json({
          message:
            "Invalid lorry ID"
        });

      }


      const lorry =
        await Lorry.findByIdForUser(
          lorryId,
          req.user.id,
          req.user.user_type
        );


      if (!lorry) {

        return res.status(403).json({
          message:
            "You are not authorized to access this lorry."
        });

      }


      return res.status(200).json(
        lorry
      );

    } catch (error) {

      console.error(
        "Error fetching lorry:",
        error
      );

      return res.status(500).json({
        message:
          "Error fetching lorry",
        error:
          error.message
      });

    }

  }
);


// =====================================================
// ADD LORRY
//
// OWNER ONLY
// =====================================================

router.post(
  "/add",
  authMiddleware,
  roleMiddleware(ROLES.OWNER),
  async (req, res) => {

    try {

      const {
        registration_number,
        model,
        year_built,
        owner_name
      } = req.body;


      // ================================================
      // VALIDATE
      // ================================================

      if (
        !registration_number ||
        !model ||
        !year_built ||
        !owner_name
      ) {

        return res.status(400).json({
          message:
            "All fields are required"
        });

      }


      // ================================================
      // OWNER FROM JWT
      // ================================================

      const ownerId =
        req.user.id;


      // ================================================
      // ADD
      // ================================================

      const result =
        await Lorry.addLorry(
          {
            registration_number,
            model,
            year_built,
            owner_name
          },
          ownerId
        );


      return res.status(201).json({
        message:
          "Lorry added successfully",

        lorryId:
          result.insertId
      });

    } catch (error) {

      console.error(
        "Error adding lorry:",
        error
      );

      return res.status(500).json({
        message:
          "Error adding lorry",
        error:
          error.message
      });

    }

  }
);


// =====================================================
// EDIT LORRY
//
// OWNER ONLY
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLES.OWNER),
  async (req, res) => {

    try {

      const lorryId =
        Number(req.params.id);


      if (!lorryId) {

        return res.status(400).json({
          message:
            "Invalid lorry ID"
        });

      }


      const {
        registration_number,
        model,
        year_built,
        owner_name
      } = req.body;


      if (
        !registration_number ||
        !model ||
        !year_built ||
        !owner_name
      ) {

        return res.status(400).json({
          message:
            "All fields are required"
        });

      }


      const result =
        await Lorry.updateLorry(
          lorryId,
          {
            registration_number,
            model,
            year_built,
            owner_name
          }
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          message:
            "Lorry not found"
        });

      }


      return res.status(200).json({
        message:
          "Lorry updated successfully"
      });

    } catch (error) {

      console.error(
        "Error updating lorry:",
        error
      );

      return res.status(500).json({
        message:
          "Error updating lorry",
        error:
          error.message
      });

    }

  }
);


// =====================================================
// DELETE LORRY
//
// OWNER ONLY
// ANY LORRY
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLES.OWNER),
  async (req, res) => {

    try {

      const lorryId =
        Number(req.params.id);


      if (!lorryId) {

        return res.status(400).json({
          message:
            "Invalid lorry ID"
        });

      }


      await Lorry.deleteLorry(
        lorryId
      );


      return res.status(200).json({
        message:
          "Lorry deleted successfully"
      });

    } catch (error) {

      console.error(
        "Error deleting lorry:",
        error
      );


      if (
        error.message ===
        "Lorry not found"
      ) {

        return res.status(404).json({
          message:
            error.message
        });

      }


      return res.status(500).json({
        message:
          "Error deleting lorry",
        error:
          error.message
      });

    }

  }
);


// =====================================================
// ASSIGN / REASSIGN LORRY MANAGER
//
// OWNER ONLY
// =====================================================

router.put(
  "/:id/manager",
  authMiddleware,
  roleMiddleware(ROLES.OWNER),
  async (req, res) => {

    try {

      const lorryId =
        Number(req.params.id);


      const {
        managerId
      } = req.body;


      if (!lorryId) {

        return res.status(400).json({
          message:
            "Lorry ID is required"
        });

      }


      if (!managerId) {

        return res.status(400).json({
          message:
            "Manager ID is required"
        });

      }


      await Lorry.assignLorryManager(
        lorryId,
        Number(managerId)
      );


      return res.status(200).json({
        message:
          "Lorry manager assigned successfully"
      });

    } catch (error) {

      console.error(
        "Error assigning lorry manager:",
        error
      );


      if (
        error.message ===
        "Lorry not found"
      ) {

        return res.status(404).json({
          message:
            error.message
        });

      }


      return res.status(400).json({
        message:
          error.message
      });

    }

  }
);


// =====================================================
// REMOVE LORRY MANAGER
//
// OWNER ONLY
// =====================================================

router.delete(
  "/:id/manager",
  authMiddleware,
  roleMiddleware(ROLES.OWNER),
  async (req, res) => {

    try {

      const lorryId =
        Number(req.params.id);


      if (!lorryId) {

        return res.status(400).json({
          message:
            "Invalid lorry ID"
        });

      }


      await Lorry.removeLorryManager(
        lorryId
      );


      return res.status(200).json({
        message:
          "Lorry manager removed successfully"
      });

    } catch (error) {

      console.error(
        "Error removing lorry manager:",
        error
      );

      return res.status(500).json({
        message:
          "Error removing lorry manager",
        error:
          error.message
      });

    }

  }
);


module.exports = router;