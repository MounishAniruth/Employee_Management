const express = require("express");

const router = express.Router();

const db = require("../config/db");

const Employee = require("../models/Employee");
const Salary = require("../models/Salary");

const authMiddleware =
  require("../middleware/authMiddleware");

const multer = require("multer");
const { uploadToBunny, deleteFromBunny } = require("../utils/bunnyUpload");

// Set up multer memory storage for employee ID proofs
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// =====================================================
// GET EMPLOYEES BY ROLE AND LORRY
//
// GET
// /api/employee/employeesByRole/:lorryId/:role
//
// Roles:
// driver
// driller
// worker
// lorry_manager
// =====================================================

router.get(
  "/employeesByRole/:lorryId/:role",
  authMiddleware,
  async (req, res) => {

    try {

      const lorryId =
        Number(req.params.lorryId);

      const role =
        req.params.role;


      // ================================================
      // VALIDATE LORRY ID
      // ================================================

      if (!lorryId) {

        return res.status(400).json({
          message:
            "Invalid lorry ID"
        });

      }


      // ================================================
      // VALID ROLES
      // ================================================

      const allowedRoles = [
        "driver",
        "driller",
        "worker",
        "lorry_manager"
      ];


      if (!allowedRoles.includes(role)) {

        return res.status(400).json({
          message:
            "Invalid employee role"
        });

      }


      // ================================================
      // GET EMPLOYEES
      // ================================================

      const employees =
        await Employee.findByRoleAndLorry(
          lorryId,
          role
        );


      return res.status(200).json(
        employees
      );

    } catch (error) {

      console.error(
        "Error fetching employees:",
        error
      );

      return res.status(500).json({
        message:
          "Error fetching employees",

        error:
          error.message
      });

    }

  }
);


// =====================================================
// GET ALL EMPLOYEES FOR LORRY
//
// GET
// /api/employee/lorry/:lorryId
// =====================================================

router.get(
  "/lorry/:lorryId",
  authMiddleware,
  async (req, res) => {

    try {

      const lorryId =
        Number(req.params.lorryId);


      if (!lorryId) {

        return res.status(400).json({
          message:
            "Invalid lorry ID"
        });

      }


      const employees =
        await Employee.findByLorry(
          lorryId
        );


      return res.status(200).json(
        employees
      );

    } catch (error) {

      console.error(
        "Error fetching lorry employees:",
        error
      );

      return res.status(500).json({
        message:
          "Error fetching lorry employees",

        error:
          error.message
      });

    }

  }
);


// =====================================================
// GET EMPLOYEE BY PHONE
//
// GET
// /api/employee/details/:phone
// =====================================================

router.get(
  "/details/:phone",
  authMiddleware,
  async (req, res) => {

    try {

      const phone =
        req.params.phone;


      const employee =
        await Employee.findByPhone(
          phone
        );


      if (!employee) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      return res.status(200).json(
        employee
      );

    } catch (error) {

      console.error(
        "Error fetching employee:",
        error
      );

      return res.status(500).json({
        message:
          "Error fetching employee",

        error:
          error.message
      });

    }

  }
);


// =====================================================
// ADD EMPLOYEE
//
// POST
// /api/employee/add
// =====================================================

router.post(
  "/add",
  authMiddleware,
  upload.single("idProof"),
  async (req, res) => {

    try {

      const {
        lorry_id,
        user_id,
        name,
        phone,
        role,
        fixed_salary
      } = req.body;


      // ================================================
      // VALIDATION
      // ================================================

      if (
        !lorry_id ||
        !name ||
        !phone ||
        !role ||
        fixed_salary === undefined ||
        fixed_salary === null ||
        fixed_salary === ""
      ) {

        return res.status(400).json({
          message:
            "All employee fields are required"
        });

      }


      // ================================================
      // VALID ROLES
      // ================================================

      const allowedRoles = [
        "driver",
        "driller",
        "worker",
        "lorry_manager"
      ];


      if (!allowedRoles.includes(role)) {

        return res.status(400).json({
          message:
            "Invalid employee role"
        });

      }


      // ================================================
      // CHECK LORRY
      // ================================================

      await Employee.checkLorryExists(
        Number(lorry_id)
      );


      // ================================================
      // UPLOAD TO BUNNY STORAGE (ID PROOF)
      // ================================================

      let id_proof_url = null;

      if (req.file) {
        id_proof_url = await uploadToBunny(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          "id-proofs"
        );
      }


      // ================================================
      // ADD EMPLOYEE
      // ================================================

      const result =
        await Employee.addEmployee({

          lorry_id:
            Number(lorry_id),

          user_id:
            user_id
              ? Number(user_id)
              : null,

          name:
            name.trim(),

          phone:
            phone.trim(),

          role,

          fixed_salary:
            Number(fixed_salary),
            
          id_proof_url

        });


      return res.status(201).json({

        message:
          "Employee added successfully",

        employeeId:
          result.insertId

      });

    } catch (error) {

      console.error(
        "Error adding employee:",
        error
      );


      if (
        error.code === "ER_DUP_ENTRY"
      ) {

        return res.status(409).json({
          message:
            "Phone number or user is already assigned."
        });

      }


      return res.status(500).json({
        message:
          "Error adding employee",

        error:
          error.message
      });

    }

  }
);


// =====================================================
// UPDATE / ADD EMPLOYEE SALARY / EXPENSE
//
// PUT
// /api/employee/updateExpense/:phone
//
// If a record already exists for the employee
// and start date:
//      -> UPDATE existing record
//
// If no record exists:
//      -> INSERT new record
//
// Body:
//
// {
//   "startDate": "2026-08-01",
//   "endDate": "2026-08-31",
//   "expensePaid": 5000,
//   "expensePaymentMethod": "Google Pay"
// }
// =====================================================

router.put(
  "/updateExpense/:phone",
  authMiddleware,
  async (req, res) => {

    try {

      const phone =
        req.params.phone;


      const {
        startDate,
        endDate,
        expensePaid,
        expensePaymentMethod
      } = req.body;


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
      // VALIDATE DATES
      // ================================================

      if (
        !startDate ||
        !endDate
      ) {

        return res.status(400).json({
          message:
            "Start date and end date are required"
        });

      }


      // ================================================
      // VALIDATE DATE ORDER
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
      // VALIDATE EXPENSE
      // ================================================

      if (
        expensePaid === undefined ||
        expensePaid === null ||
        expensePaid === ""
      ) {

        return res.status(400).json({
          message:
            "Expense amount is required"
        });

      }


      const expenseAmount =
        Number(expensePaid);


      if (
        Number.isNaN(expenseAmount) ||
        expenseAmount < 0
      ) {

        return res.status(400).json({
          message:
            "Expense amount must be a valid number"
        });

      }


      // ================================================
      // VALID PAYMENT METHODS
      //
      // Must exactly match MySQL ENUM
      // ================================================

      const allowedPaymentMethods = [
        "Phone Pay",
        "Google Pay",
        "Cash",
        "Bank",
        "Office Cash",
        "Site Cash"
      ];


      if (
        !allowedPaymentMethods.includes(
          expensePaymentMethod
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid expense payment method",

          allowedPaymentMethods

        });

      }


      // ================================================
      // FIND EMPLOYEE BY PHONE
      // ================================================

      const employee =
        await Employee.findByPhone(
          phone
        );


      if (!employee) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      const employeeId =
        employee.id;


      // ================================================
      // FIND EXISTING SALARY RECORD
      //
      // We use:
      //
      // employee_id
      // +
      // start_date
      //
      // This prevents duplicate monthly records.
      // ================================================

      const [
        existingRecords
      ] = await db.query(
        `
        SELECT
          id,
          employee_id,
          start_date,
          end_date,
          expense_paid,
          expense_payment_method

        FROM employee_salaries

        WHERE employee_id = ?

        AND start_date = ?

        ORDER BY id DESC

        LIMIT 1
        `,
        [
          employeeId,
          startDate
        ]
      );


      // ================================================
      // UPDATE EXISTING RECORD
      // ================================================

      if (
        existingRecords.length > 0
      ) {

        const salaryId =
          existingRecords[0].id;

        const [
          result
        ] = await db.query(
          `
          UPDATE employee_salaries

          SET
            end_date = ?,
            expense_paid = ?,
            expense_payment_method = ?

          WHERE id = ?
          `,
          [
            endDate,
            expenseAmount,
            expensePaymentMethod,
            salaryId
          ]
        );

        return res.status(200).json({

          message:
            "Salary / expense record updated successfully",

          salaryId:
            salaryId

        });

      }


      // ================================================
      // INSERT NEW RECORD
      // ================================================

      const [
        result
      ] = await db.query(
        `
        INSERT INTO employee_salaries
        (
          employee_id,
          start_date,
          end_date,
          expense_paid,
          expense_payment_method
        )

        VALUES (?, ?, ?, ?, ?)
        `,
        [
          employeeId,
          startDate,
          endDate,
          expenseAmount,
          expensePaymentMethod
        ]
      );


      return res.status(201).json({

        message:
          "Salary / expense record added successfully",

        salaryId:
          result.insertId

      });

    } catch (error) {

      console.error(
        "Error updating employee salary/expense:",
        error
      );


      // ================================================
      // INVALID PAYMENT METHOD
      // ================================================

      if (
        error.code ===
          "WARN_DATA_TRUNCATED" ||

        error.code ===
          "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD"
      ) {

        return res.status(400).json({

          message:
            "Invalid expense payment method",

          error:
            error.message

        });

      }


      // ================================================
      // FOREIGN KEY ERROR
      // ================================================

      if (
        error.code ===
        "ER_NO_REFERENCED_ROW_2"
      ) {

        return res.status(400).json({

          message:
            "Employee does not exist",

          error:
            error.message

        });

      }


      return res.status(500).json({

        message:
          "Failed to save salary / expense record",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// UPDATE EMPLOYEE
//
// PUT
// /api/employee/:id
//
// IMPORTANT:
// This comes AFTER /updateExpense/:phone
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  upload.single("idProof"),
  async (req, res) => {

    try {

      const employeeId =
        Number(req.params.id);


      // ================================================
      // VALIDATE ID
      // ================================================

      if (!employeeId) {

        return res.status(400).json({
          message:
            "Invalid employee ID"
        });

      }


      const {
        name,
        phone,
        role,
        fixed_salary
      } = req.body;


      // ================================================
      // VALIDATE FIELDS
      // ================================================

      if (
        !name ||
        !phone ||
        !role ||
        fixed_salary === undefined ||
        fixed_salary === null ||
        fixed_salary === ""
      ) {

        return res.status(400).json({
          message:
            "All employee fields are required"
        });

      }


      // ================================================
      // VALID ROLES
      // ================================================

      const allowedRoles = [
        "driver",
        "driller",
        "worker",
        "lorry_manager"
      ];


      if (!allowedRoles.includes(role)) {

        return res.status(400).json({
          message:
            "Invalid employee role"
        });

      }


      // ================================================
      // FIND EMPLOYEE
      // ================================================

      const employee =
        await Employee.findById(
          employeeId
        );


      if (!employee) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      // ================================================
      // UPLOAD TO BUNNY STORAGE (ID PROOF)
      // ================================================

      let id_proof_url = employee.id_proof_url; // Default to existing

      if (req.file) {
        
        // Upload new ID proof
        id_proof_url = await uploadToBunny(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          "id-proofs"
        );
        
        // Optionally delete old one? 
        // if (employee.id_proof_url) {
        //   await deleteFromBunny(employee.id_proof_url).catch(console.error);
        // }
      }


      // ================================================
      // UPDATE EMPLOYEE
      // ================================================

      const result =
        await Employee.updateEmployee(
          employeeId,
          {

            name:
              name.trim(),

            phone:
              phone.trim(),

            role,

            fixed_salary:
              Number(fixed_salary),
              
            id_proof_url

          }
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      return res.status(200).json({

        message:
          "Employee updated successfully"

      });

    } catch (error) {

      console.error(
        "Error updating employee:",
        error
      );


      // ================================================
      // DUPLICATE PHONE
      // ================================================

      if (
        error.code === "ER_DUP_ENTRY"
      ) {

        return res.status(409).json({

          message:
            "Phone number is already used by another employee."

        });

      }


      return res.status(500).json({

        message:
          "Error updating employee",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// DELETE EMPLOYEE BY PHONE
//
// DELETE
// /api/employee/delete/:phone
// =====================================================

router.delete(
  "/delete/:phone",
  authMiddleware,
  async (req, res) => {

    try {

      const phone =
        req.params.phone;


      // ================================================
      // FIND EMPLOYEE
      // ================================================

      const employee =
        await Employee.findByPhone(
          phone
        );


      if (!employee) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      // ================================================
      // DELETE EMPLOYEE
      // ================================================

      const result =
        await Employee.deleteById(
          employee.id
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      return res.status(200).json({

        message:
          "Employee deleted successfully"

      });

    } catch (error) {

      console.error(
        "Error deleting employee:",
        error
      );


      // ================================================
      // FOREIGN KEY ERROR
      // ================================================

      if (
        error.code ===
          "ER_ROW_IS_REFERENCED_2" ||

        error.code ===
          "ER_ROW_IS_REFERENCED"
      ) {

        return res.status(409).json({

          message:
            "This employee cannot be deleted because salary or other records are linked to this employee."

        });

      }


      return res.status(500).json({

        message:
          "Error deleting employee",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// DELETE EMPLOYEE BY ID
//
// DELETE
// /api/employee/:id
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const employeeId =
        Number(req.params.id);


      // ================================================
      // VALIDATE ID
      // ================================================

      if (!employeeId) {

        return res.status(400).json({
          message:
            "Invalid employee ID"
        });

      }


      // ================================================
      // FIND EMPLOYEE
      // ================================================

      const employee =
        await Employee.findById(
          employeeId
        );


      if (!employee) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      // ================================================
      // DELETE
      // ================================================

      const result =
        await Employee.deleteById(
          employeeId
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }


      return res.status(200).json({

        message:
          "Employee deleted successfully"

      });

    } catch (error) {

      console.error(
        "Error deleting employee:",
        error
      );


      // ================================================
      // FOREIGN KEY ERROR
      // ================================================

      if (
        error.code ===
          "ER_ROW_IS_REFERENCED_2" ||

        error.code ===
          "ER_ROW_IS_REFERENCED"
      ) {

        return res.status(409).json({

          message:
            "This employee cannot be deleted because salary or other records are linked to this employee."

        });

      }


      return res.status(500).json({

        message:
          "Error deleting employee",

        error:
          error.message

      });

    }

  }
);


module.exports = router;