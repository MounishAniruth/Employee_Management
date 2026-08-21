const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { ROLES } = require("../utils/constants");

const {
  createPoint,
  updatePoint,
  getAllPoints,
  getPointById,
  deletePoint,
  getPointSummary,
} = require("../models/Point");


// =====================================================
// AUTHORIZATION
// Owner + Manager + Lorry Manager
// =====================================================

const pointAccess = [
  authMiddleware,
  roleMiddleware(
    ROLES.OWNER,
    ROLES.MANAGER,
    ROLES.LORRY_MANAGER
  ),
];


// =====================================================
// ADD POINT
// POST /api/point/add
// =====================================================

router.post(
  "/add",
  ...pointAccess,
  async (req, res, next) => {

    try {

      const pointId =
        await createPoint(req.body);


      res.status(201).json({
        success: true,

        message:
          "Point created successfully.",

        pointId,
      });


    } catch (error) {

      console.error(
        "Error creating point:",
        error
      );

      next(error);
    }
  }
);


// =====================================================
// GET POINTS FOR A PARTICULAR LORRY
//
// GET /api/point/lorry/:lorryId
//
// Example:
// /api/point/lorry/44
// =====================================================

router.get(
  "/lorry/:lorryId",
  ...pointAccess,
  async (req, res, next) => {

    try {

      const lorryId =
        Number(req.params.lorryId);


      // -------------------------------------------------
      // Validate lorry ID
      // -------------------------------------------------

      if (
        !Number.isInteger(lorryId) ||
        lorryId <= 0
      ) {

        return res.status(400).json({
          success: false,

          message:
            "Invalid lorry ID.",
        });
      }


      // -------------------------------------------------
      // Get points
      // -------------------------------------------------

      const points =
        await getAllPoints(
          lorryId
        );


      // -------------------------------------------------
      // Response
      // -------------------------------------------------

      res.json({
        success: true,

        lorryId,

        points,
      });


    } catch (error) {

      console.error(
        "Error fetching lorry points:",
        error
      );

      next(error);
    }
  }
);


// =====================================================
// POINT SUMMARY
//
// GET /api/point/summary
//
// Required:
// lorryId
// fromDate
// toDate
//
// Example:
// /api/point/summary
//   ?lorryId=44
//   &fromDate=2026-08-01
//   &toDate=2026-08-31
//
// IMPORTANT:
// This route MUST come before /:id
// =====================================================

router.get(
  "/summary",
  ...pointAccess,
  async (req, res, next) => {

    try {

      const {
        lorryId,
        fromDate,
        toDate,
      } = req.query;


      // -------------------------------------------------
      // Validate lorry ID
      // -------------------------------------------------

      const parsedLorryId =
        Number(lorryId);


      if (
        !Number.isInteger(
          parsedLorryId
        ) ||
        parsedLorryId <= 0
      ) {

        return res.status(400).json({
          success: false,

          message:
            "Valid lorryId is required.",
        });
      }


      // -------------------------------------------------
      // Validate dates
      // -------------------------------------------------

      if (
        !fromDate ||
        !toDate
      ) {

        return res.status(400).json({
          success: false,

          message:
            "fromDate and toDate are required.",
        });
      }


      // -------------------------------------------------
      // Basic date validation
      // -------------------------------------------------

      const dateRegex =
        /^\d{4}-\d{2}-\d{2}$/;


      if (
        !dateRegex.test(fromDate) ||
        !dateRegex.test(toDate)
      ) {

        return res.status(400).json({
          success: false,

          message:
            "Dates must be in YYYY-MM-DD format.",
        });
      }


      // -------------------------------------------------
      // Make sure fromDate is not after toDate
      // -------------------------------------------------

      if (
        fromDate > toDate
      ) {

        return res.status(400).json({
          success: false,

          message:
            "fromDate cannot be after toDate.",
        });
      }


      // -------------------------------------------------
      // Get summary
      // -------------------------------------------------

      const summary =
        await getPointSummary(
          parsedLorryId,
          fromDate,
          toDate
        );


      // -------------------------------------------------
      // Response
      // -------------------------------------------------

      res.json({

        success: true,

        lorryId:
          parsedLorryId,

        fromDate,

        toDate,

        summary,
      });


    } catch (error) {

      console.error(
        "Error fetching point summary:",
        error
      );

      next(error);
    }
  }
);


// =====================================================
// UPDATE POINT
//
// PUT /api/point/:id
//
// IMPORTANT:
// This route MUST come before GET /:id
// =====================================================

router.put(
  "/:id",
  ...pointAccess,
  async (req, res, next) => {

    try {

      const pointId =
        Number(req.params.id);


      // -------------------------------------------------
      // Validate point ID
      // -------------------------------------------------

      if (
        !Number.isInteger(pointId) ||
        pointId <= 0
      ) {

        return res.status(400).json({
          success: false,

          message:
            "Invalid point ID.",
        });
      }


      // -------------------------------------------------
      // Update point
      // -------------------------------------------------

      await updatePoint(
        pointId,
        req.body
      );


      // -------------------------------------------------
      // Response
      // -------------------------------------------------

      res.json({

        success: true,

        message:
          "Point updated successfully.",
      });


    } catch (error) {

      console.error(
        "Error updating point:",
        error
      );


      // -------------------------------------------------
      // Point not found
      // -------------------------------------------------

      if (
        error.message ===
        "Point not found."
      ) {

        return res.status(404).json({

          success: false,

          message:
            error.message,
        });
      }


      // -------------------------------------------------
      // Point belongs to another lorry
      // -------------------------------------------------

      if (
        error.message ===
        "Point does not belong to this lorry."
      ) {

        return res.status(403).json({

          success: false,

          message:
            error.message,
        });
      }


      next(error);
    }
  }
);


// =====================================================
// GET POINT BY ID
//
// GET /api/point/:id
// =====================================================

router.get(
  "/:id",
  ...pointAccess,
  async (req, res, next) => {

    try {

      const pointId =
        Number(req.params.id);


      // -------------------------------------------------
      // Validate point ID
      // -------------------------------------------------

      if (
        !Number.isInteger(pointId) ||
        pointId <= 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid point ID.",
        });
      }


      // -------------------------------------------------
      // Get point
      // -------------------------------------------------

      const point =
        await getPointById(
          pointId
        );


      // -------------------------------------------------
      // Point not found
      // -------------------------------------------------

      if (!point) {

        return res.status(404).json({

          success: false,

          message:
            "Point not found.",
        });
      }


      // -------------------------------------------------
      // Response
      // -------------------------------------------------

      res.json({

        success: true,

        point,
      });


    } catch (error) {

      console.error(
        "Error fetching point:",
        error
      );

      next(error);
    }
  }
);


// =====================================================
// DELETE POINT
//
// DELETE /api/point/:id
// =====================================================

router.delete(
  "/:id",
  ...pointAccess,
  async (req, res, next) => {

    try {

      const pointId =
        Number(req.params.id);


      // -------------------------------------------------
      // Validate point ID
      // -------------------------------------------------

      if (
        !Number.isInteger(pointId) ||
        pointId <= 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid point ID.",
        });
      }


      // -------------------------------------------------
      // Delete point
      // -------------------------------------------------

      const affectedRows =
        await deletePoint(
          pointId
        );


      // -------------------------------------------------
      // Point not found
      // -------------------------------------------------

      if (
        affectedRows === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Point not found.",
        });
      }


      // -------------------------------------------------
      // Response
      // -------------------------------------------------

      res.json({

        success: true,

        message:
          "Point deleted successfully.",
      });


    } catch (error) {

      console.error(
        "Error deleting point:",
        error
      );

      next(error);
    }
  }
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;