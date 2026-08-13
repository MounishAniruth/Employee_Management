const express = require("express");
const db = require("../config/db");
const router = express.Router();

const Employee = require("../models/Employee");

// ======================================================
// ADD EMPLOYEE
// ======================================================

router.post("/add", async (req, res) => {
  try {
    const {
      name,
      phone,
      role,
      fixed_salary,
      lorry_id,
    } = req.body;

    console.log("Add Employee Request:", req.body);

    // Validate required fields
    if (
      !name ||
      !phone ||
      !role ||
      fixed_salary === undefined ||
      fixed_salary === null ||
      !lorry_id
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Check if phone already exists
    const [existingEmployee] = await db.query(
      "SELECT id FROM employees WHERE phone = ?",
      [phone]
    );

    if (existingEmployee.length > 0) {
      return res.status(400).json({
        error: "Employee with this phone number already exists",
      });
    }

    // Add employee
    const result = await Employee.addEmployee({
      lorry_id: Number(lorry_id),
      name,
      phone,
      role,
      fixed_salary: Number(fixed_salary),
    });

    console.log("Employee added:", result);

    return res.status(201).json({
      message: "Employee added successfully",
      employeeId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding employee:", error);

    return res.status(500).json({
      error: error.message || "Error adding employee",
    });
  }
});

// ======================================================
// GET EMPLOYEES BY ROLE AND LORRY
// ======================================================

router.get(
  "/employeesByRole/:id/:role",
  async (req, res) => {
    try {
      const { id, role } = req.params;

      console.log(
        "Fetching employees:",
        "lorry_id =",
        id,
        "role =",
        role
      );

      const employees =
        await Employee.findByRoleAndLorry(
          Number(id),
          role
        );

      return res.status(200).json(employees);
    } catch (error) {
      console.error(
        "Error fetching employees:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Error fetching employees",
      });
    }
  }
);

// ======================================================
// UPDATE EMPLOYEE EXPENSE
// ======================================================

router.put(
  "/updateExpense/:phone",
  async (req, res) => {
    try {
      const { phone } = req.params;

      const {
        startDate,
        endDate,
        expense,
        expensePaid,
        expensePaymentMethod,
      } = req.body;

      // Support both expense names
      const finalExpense =
        expense !== undefined
          ? expense
          : expensePaid;

      // Validate required data
      if (!startDate || !endDate) {
        return res.status(400).json({
          error:
            "Start date and end date are required",
        });
      }

      if (
        finalExpense === undefined ||
        finalExpense === null
      ) {
        return res.status(400).json({
          error: "Expense amount is required",
        });
      }

      // Find employee
      const [employees] = await db.query(
        "SELECT id FROM employees WHERE phone = ?",
        [phone]
      );

      if (employees.length === 0) {
        return res.status(404).json({
          error: "Employee not found",
        });
      }

      const employeeId = employees[0].id;

      // Check existing salary/expense record
      const [existingRecords] = await db.query(
        `
        SELECT id
        FROM employee_salaries
        WHERE employee_id = ?
        AND start_date = ?
        `,
        [employeeId, startDate]
      );

      // ==================================================
      // UPDATE EXISTING RECORD
      // ==================================================

      if (existingRecords.length > 0) {
        await db.query(
          `
          UPDATE employee_salaries
          SET
            end_date = ?,
            expense_paid = ?
          WHERE id = ?
          `,
          [
            endDate,
            Number(finalExpense),
            existingRecords[0].id,
          ]
        );

        return res.status(200).json({
          message:
            "Expense updated successfully",
        });
      }

      // ==================================================
      // INSERT NEW RECORD
      // ==================================================

      await db.query(
        `
        INSERT INTO employee_salaries
        (
          employee_id,
          start_date,
          end_date,
          expense_paid
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          employeeId,
          startDate,
          endDate,
          Number(finalExpense),
        ]
      );

      return res.status(201).json({
        message: "Expense added successfully",
      });
    } catch (error) {
      console.error(
        "Error updating employee expense:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Internal server error",
      });
    }
  }
);

// ======================================================
// DELETE EMPLOYEE
// ======================================================

router.delete(
  "/delete/:phone",
  async (req, res) => {
    try {
      const { phone } = req.params;

      const [result] = await db.query(
        "DELETE FROM employees WHERE phone = ?",
        [phone]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Employee not found",
        });
      }

      return res.status(200).json({
        message: "Employee deleted successfully",
      });
    } catch (error) {
      console.error(
        "Error deleting employee:",
        error
      );

      return res.status(500).json({
        error: "Error deleting employee",
      });
    }
  }
);

// ======================================================
// GET EMPLOYEE DETAILS BY PHONE
// ======================================================

router.get(
  "/details/:phone",
  async (req, res) => {
    try {
      const { phone } = req.params;

      const employee =
        await Employee.findByPhone(phone);

      if (!employee) {
        return res.status(404).json({
          error: "Employee not found",
        });
      }

      return res.status(200).json(employee);
    } catch (error) {
      console.error(
        "Error fetching employee:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Error fetching employee",
      });
    }
  }
);

module.exports = router;