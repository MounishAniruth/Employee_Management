const express = require("express");
const router = express.Router();

const db = require("../config/db");
const SalaryModel = require("../models/Salary");


// =====================================================
// ADD SALARY RECORD
// =====================================================

router.post("/add", async (req, res) => {

  const {
    employeeId,
    startDate,
    endDate,
    expensePaid,
    expensePaymentMethod
  } = req.body;

  try {

    console.log("Add salary request:", req.body);

    if (
      !employeeId ||
      !startDate ||
      !endDate ||
      expensePaid === undefined ||
      !expensePaymentMethod
    ) {
      return res.status(400).json({
        error: "All salary fields are required"
      });
    }

    const insertId = await SalaryModel.addSalaryRecord(
      employeeId,
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod
    );

    return res.status(201).json({
      message: "Salary record added successfully",
      salaryId: insertId
    });

  } catch (err) {

    console.error("Error adding salary:", err);

    return res.status(500).json({
      error: err.message || "Failed to add salary record"
    });
  }
});


// =====================================================
// GET SALARY RECORDS USING EMPLOYEE PHONE
// =====================================================

router.get("/:phone", async (req, res) => {

  try {

    const { phone } = req.params;

    console.log("Fetching salary records for phone:", phone);

    // Find employee
    const [employeeResult] = await db.query(
      "SELECT id FROM employees WHERE phone = ?",
      [phone]
    );

    if (employeeResult.length === 0) {

      return res.status(404).json({
        message: "Employee not found"
      });
    }

    const employeeId = employeeResult[0].id;

    console.log("Employee ID:", employeeId);

    // Get salary records
    const salaryRecords =
      await SalaryModel.getSalaryRecordsByEmployee(employeeId);

    console.log("Salary records:", salaryRecords);

    return res.status(200).json(salaryRecords);

  } catch (err) {

    console.error("Error fetching salary details:", err);

    return res.status(500).json({
      error: err.message || "Internal Server Error"
    });
  }
});


// =====================================================
// UPDATE SALARY RECORD
// =====================================================

router.put("/update/:salaryId", async (req, res) => {

  const { salaryId } = req.params;

  const {
    startDate,
    endDate,
    expensePaid,
    expensePaymentMethod
  } = req.body;

  try {

    console.log("Update salary request:", {
      salaryId,
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod
    });

    const rowsAffected =
      await SalaryModel.updateSalaryRecord(
        salaryId,
        startDate,
        endDate,
        expensePaid,
        expensePaymentMethod
      );

    if (rowsAffected === 0) {

      return res.status(404).json({
        error: "Salary record not found"
      });
    }

    return res.status(200).json({
      message: "Salary record updated successfully"
    });

  } catch (err) {

    console.error("Error updating salary:", err);

    return res.status(500).json({
      error: err.message || "Failed to update salary record"
    });
  }
});


// =====================================================
// DELETE SALARY RECORD
// =====================================================

router.delete("/delete/:salaryId", async (req, res) => {

  const { salaryId } = req.params;

  try {

    const rowsAffected =
      await SalaryModel.deleteSalaryRecord(salaryId);

    if (rowsAffected === 0) {

      return res.status(404).json({
        error: "Salary record not found"
      });
    }

    return res.status(200).json({
      message: "Salary record deleted successfully"
    });

  } catch (err) {

    console.error("Error deleting salary:", err);

    return res.status(500).json({
      error: err.message || "Failed to delete salary record"
    });
  }
});


module.exports = router;