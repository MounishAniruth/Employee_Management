const express = require("express");

const router = express.Router();

const db = require("../config/db");

const SalaryModel =
  require("../models/Salary");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const { ROLES } =
  require("../utils/constants");


// =====================================================
// ADD SALARY / EXPENSE RECORD
//
// POST
// /api/salary/add
// =====================================================

router.post(
  "/add",
  async (req, res) => {

    const {
      employeeId,
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod
    } = req.body;

    try {

      console.log(
        "Add salary request:",
        req.body
      );


      // ================================================
      // VALIDATION
      // ================================================

      if (
        !employeeId ||
        !startDate ||
        !endDate ||
        expensePaid === undefined ||
        expensePaid === null ||
        !expensePaymentMethod
      ) {

        return res.status(400).json({
          message:
            "All salary fields are required"
        });

      }


      // ================================================
      // CHECK EMPLOYEE
      // ================================================

      const [
        employeeRows
      ] = await db.query(
        `
        SELECT
          id,
          lorry_id,
          user_id,
          name,
          phone,
          role,
          fixed_salary

        FROM employees

        WHERE id = ?
        `,
        [employeeId]
      );


      if (
        employeeRows.length === 0
      ) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      // ================================================
      // DATE VALIDATION
      // ================================================

      if (
        new Date(endDate) <
        new Date(startDate)
      ) {

        return res.status(400).json({
          message:
            "End date cannot be before start date"
        });

      }


      // ================================================
      // ADD RECORD
      // ================================================

      const insertId =
        await SalaryModel.addSalaryRecord(

          employeeId,

          startDate,

          endDate,

          Number(
            expensePaid
          ),

          expensePaymentMethod

        );


      return res.status(201).json({

        message:
          "Salary record added successfully",

        salaryId:
          insertId

      });

    } catch (error) {

      console.error(
        "Error adding salary:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to add salary record",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// GET SALARY RECORDS BY EMPLOYEE PHONE
//
// GET
// /api/salary/salaryDetails/:phone
//
// Example:
// /api/salary/salaryDetails/9876543210
//
// IMPORTANT:
// This matches EmployeePage.js
// =====================================================

router.get(
  "/salaryDetails/:phone",
  async (req, res) => {

    try {

      const {
        phone
      } = req.params;


      console.log(
        "Fetching salary records for phone:",
        phone
      );


      // ================================================
      // VALIDATE PHONE
      // ================================================

      if (
        !phone ||
        phone.trim() === ""
      ) {

        return res.status(400).json({
          message:
            "Employee phone number is required"
        });

      }


      // ================================================
      // FIND EMPLOYEE
      //
      // Also gets lorry registration number
      // ================================================

      const [
        employeeRows
      ] = await db.query(
        `
        SELECT

          e.id,

          e.lorry_id,

          e.user_id,

          e.name,

          e.phone,

          e.role,

          e.fixed_salary,

          l.registration_number

        FROM employees e

        INNER JOIN lorries l
          ON e.lorry_id = l.id

        WHERE e.phone = ?

        LIMIT 1
        `,
        [phone]
      );


      // ================================================
      // EMPLOYEE NOT FOUND
      // ================================================

      if (
        employeeRows.length === 0
      ) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      const employee =
        employeeRows[0];


      console.log(
        "Employee found:",
        employee
      );


      // ================================================
      // GET SALARY RECORDS
      // ================================================

      const salaryRecords =
        await SalaryModel
          .getSalaryRecordsByEmployee(
            employee.id
          );


      console.log(
        "Salary records:",
        salaryRecords
      );


      // ================================================
      // RETURN SALARY RECORDS
      //
      // EmployeePage expects an ARRAY
      //
      // response.data -> []
      // ================================================

      return res.status(200).json(
        salaryRecords
      );

    } catch (error) {

      console.error(
        "Error fetching salary details:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch salary details",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// GET ONE SALARY RECORD
//
// GET
// /api/salary/record/:salaryId
// =====================================================

router.get(
  "/record/:salaryId",
  async (req, res) => {

    try {

      const salaryId =
        Number(
          req.params.salaryId
        );


      if (!salaryId) {

        return res.status(400).json({
          message:
            "Invalid salary record ID"
        });

      }


      const record =
        await SalaryModel
          .getSalaryRecordById(
            salaryId
          );


      if (!record) {

        return res.status(404).json({
          message:
            "Salary record not found"
        });

      }


      return res.status(200).json(
        record
      );

    } catch (error) {

      console.error(
        "Error fetching salary record:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch salary record",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// UPDATE SALARY / EXPENSE RECORD
//
// PUT
// /api/salary/update/:salaryId
// =====================================================

router.put(
  "/update/:salaryId",
  async (req, res) => {

    const {
      salaryId
    } = req.params;


    const {
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod
    } = req.body;


    try {

      console.log(
        "Update salary request:",
        {
          salaryId,
          startDate,
          endDate,
          expensePaid,
          expensePaymentMethod
        }
      );


      // ================================================
      // VALIDATION
      // ================================================

      if (
        !startDate ||
        !endDate ||
        expensePaid === undefined ||
        expensePaid === null ||
        !expensePaymentMethod
      ) {

        return res.status(400).json({
          message:
            "All salary fields are required"
        });

      }


      if (
        new Date(endDate) <
        new Date(startDate)
      ) {

        return res.status(400).json({
          message:
            "End date cannot be before start date"
        });

      }


      const salaryIdNumber =
        Number(
          salaryId
        );


      if (!salaryIdNumber) {

        return res.status(400).json({
          message:
            "Invalid salary record ID"
        });

      }


      // ================================================
      // CHECK RECORD EXISTS
      // ================================================

      const existingRecord =
        await SalaryModel
          .getSalaryRecordById(
            salaryIdNumber
          );


      if (!existingRecord) {

        return res.status(404).json({
          message:
            "Salary record not found"
        });

      }


      // ================================================
      // UPDATE
      // ================================================

      const result =
        await SalaryModel
          .updateSalaryRecord(

            salaryIdNumber,

            startDate,

            endDate,

            Number(
              expensePaid
            ),

            expensePaymentMethod

          );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          message:
            "Salary record not found"
        });

      }


      return res.status(200).json({
        message:
          "Salary record updated successfully"
      });

    } catch (error) {

      console.error(
        "Error updating salary:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to update salary record",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// DELETE SALARY / EXPENSE RECORD
//
// DELETE
// /api/salary/delete/:salaryId
// =====================================================

router.delete(
  "/delete/:salaryId",
  async (req, res) => {

    try {

      const salaryId =
        Number(
          req.params.salaryId
        );


      if (!salaryId) {

        return res.status(400).json({
          message:
            "Invalid salary record ID"
        });

      }


      // ================================================
      // CHECK RECORD
      // ================================================

      const existingRecord =
        await SalaryModel
          .getSalaryRecordById(
            salaryId
          );


      if (!existingRecord) {

        return res.status(404).json({
          message:
            "Salary record not found"
        });

      }


      // ================================================
      // DELETE
      // ================================================

      const result =
        await SalaryModel
          .deleteSalaryRecord(
            salaryId
          );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          message:
            "Salary record not found"
        });

      }


      return res.status(200).json({
        message:
          "Salary record deleted successfully"
      });

    } catch (error) {

      console.error(
        "Error deleting salary:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to delete salary record",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// OWNER-ONLY: UPDATE FIXED SALARY
//
// PUT
// /api/salary/fixed/:employeeId
//
// OWNER ONLY
// =====================================================

router.put(
  "/fixed/:employeeId",

  authMiddleware,

  roleMiddleware(
    ROLES.OWNER
  ),

  async (req, res) => {

    try {

      const employeeId =
        Number(
          req.params.employeeId
        );

      const {
        newSalary,
        effectiveFrom
      } = req.body;


      // =================================================
      // VALIDATE EMPLOYEE ID
      // =================================================

      if (!employeeId) {

        return res.status(400).json({
          message:
            "Invalid employee ID"
        });

      }


      // =================================================
      // VALIDATE NEW SALARY
      // =================================================

      if (
        newSalary === undefined ||
        newSalary === null ||
        newSalary === ""
      ) {

        return res.status(400).json({
          message:
            "New salary is required"
        });

      }


      const salary =
        Number(newSalary);


      if (
        Number.isNaN(salary) ||
        salary < 0
      ) {

        return res.status(400).json({
          message:
            "Salary must be a valid number"
        });

      }


      // =================================================
      // VALIDATE EFFECTIVE DATE
      // =================================================

      if (!effectiveFrom) {

        return res.status(400).json({
          message:
            "Effective date is required"
        });

      }


      // =================================================
      // UPDATE FIXED SALARY
      // =================================================

      await SalaryModel.setFixedSalary(

        employeeId,

        salary,

        effectiveFrom,

        req.user.id

      );


      return res.status(200).json({

        message:
          "Fixed salary updated successfully",

        employeeId:
          employeeId,

        newSalary:
          salary,

        effectiveFrom:
          effectiveFrom

      });

    } catch (error) {

      console.error(
        "Error updating fixed salary:",
        error
      );


      return res.status(400).json({

        message:
          error.message ||
          "Failed to update fixed salary"

      });

    }

  }

);


// =====================================================
// GET FIXED SALARY HISTORY
//
// GET
// /api/salary/fixed/history/:employeeId
//
// AUTHENTICATED USERS
// =====================================================

router.get(
  "/fixed/history/:employeeId",

  authMiddleware,

  async (req, res) => {

    try {

      const employeeId =
        Number(
          req.params.employeeId
        );


      if (!employeeId) {

        return res.status(400).json({
          message:
            "Invalid employee ID"
        });

      }


      const history =
        await SalaryModel.getFixedSalaryHistory(
          employeeId
        );


      return res.status(200).json(
        history
      );

    } catch (error) {

      console.error(
        "Error fetching fixed salary history:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch fixed salary history",

        error:
          error.message

      });

    }

  }

);


module.exports = router;