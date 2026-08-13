const express = require("express");
const router = express.Router();

const Lorry = require("../models/Lorry");
const authMiddleware = require("../middleware/authMiddleware");

// =========================
// GET ALL LORRIES
// =========================
router.get("/", async (req, res) => {
  try {

    const lorries = await Lorry.findAll();

    res.status(200).json(lorries);

  } catch (error) {

    console.error("Error fetching lorries:", error);

    res.status(500).json({
      message: "Error fetching lorries",
      error: error.message
    });

  }
});


// =========================
// GET LORRY BY ID
// =========================
router.get("/:id", async (req, res) => {

  try {

    const lorryId = req.params.id;

    const lorry = await Lorry.findById(lorryId);

    if (!lorry) {
      return res.status(404).json({
        message: "Lorry not found"
      });
    }

    res.status(200).json(lorry);

  } catch (error) {

    console.error("Error fetching lorry:", error);

    res.status(500).json({
      message: "Error fetching lorry",
      error: error.message
    });

  }

});


// =========================
// ADD LORRY
// =========================
router.post("/add", authMiddleware, async (req, res) => {

  try {

    const {
      registration_number,
      model,
      year_built,
      owner_name
    } = req.body;

    // Only owners can add lorries
    if (req.user.user_type !== "owner") {
      return res.status(403).json({
        message: "Only owners can add a lorry."
      });
    }

    // Validate fields
    if (
      !registration_number ||
      !model ||
      !year_built ||
      !owner_name
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Get owner ID from JWT
    const ownerId = req.user.id;

    const result = await Lorry.addLorry(
      {
        registration_number,
        model,
        year_built,
        owner_name
      },
      ownerId
    );

    console.log(
      "Lorry created with ID:",
      result.insertId
    );

    res.status(201).json({
      message: "Lorry added successfully",
      lorryId: result.insertId
    });

  } catch (error) {

    console.error("Error adding lorry:", error);

    res.status(500).json({
      message: "Error adding lorry",
      error: error.message
    });

  }

});


// =========================
// DELETE LORRY
// =========================
router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    const lorryId = req.params.id;
    const userId = req.user.id;

    await Lorry.deleteLorry(
      lorryId,
      userId
    );

    res.status(200).json({
      message: "Lorry deleted successfully"
    });

  } catch (error) {

    console.error("Error deleting lorry:", error);

    if (
      error.message ===
      "You are not authorized to delete this lorry"
    ) {
      return res.status(403).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: "Error deleting lorry",
      error: error.message
    });

  }

});

module.exports = router;