const express = require("express");
const router = express.Router();
const Salary = require("../models/Salary");
const Employee = require("../models/Employee");

// POST /add/:phone - Add a new salary record for the employee identified by phone
router.post("/add/:phone", async (req, res) => {
  const { phone } = req.params;
  const { startDate, endDate, expense } = req.body;

  if (!startDate || !endDate || !expense) {
    return res.status(400).json({ error: "Start Date, End Date, and Expense are required" });
  }

  try {
    // Check if employee exists using their phone number
    const employee = await new Promise((resolve, reject) => {
      Employee.findByPhone(phone, (err, employee) => {
        if (err || !employee) reject("Employee not found");
        resolve(employee);
      });
    });

    // Check if salary already exists for this period
    const result = await new Promise((resolve, reject) => {
      Salary.getSalaryByEmployeePhone(phone, (err, result) => {
        if (err) reject("Error checking salary records");
        resolve(result);
      });
    });

    // Check if salary exists within the date range
    const existingSalary = result.find(
      (salary) =>
        (startDate >= salary.start_date && startDate <= salary.end_date) ||
        (endDate >= salary.start_date && endDate <= salary.end_date)
    );
    if (existingSalary) {
      return res.status(400).json({ error: "Salary record already exists for this period" });
    }

    // Add salary record
    const addResult = await new Promise((resolve, reject) => {
      Salary.addSalary(phone, { startDate, endDate, expense }, (err, result) => {
        if (err) reject("Error adding salary record");
        resolve(result);
      });
    });

    res.status(201).json({ message: "Salary record added successfully", result: addResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// GET /:phone - Retrieve salary records for the employee identified by phone
router.get("/:phone", async (req, res) => {
  const { phone } = req.params;

  try {
    // Check if employee exists using their phone number
    const employee = await new Promise((resolve, reject) => {
      Employee.findByPhone(phone, (err, employee) => {
        if (err || !employee) reject("Employee not found");
        resolve(employee);
      });
    });

    // Retrieve salary records
    const result = await new Promise((resolve, reject) => {
      Salary.getSalaryByEmployeePhone(phone, (err, result) => {
        if (err) reject("Error fetching salary record");
        resolve(result);
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// PUT /update/:phone - Update salary details for an employee identified by phone
router.put("/update/:phone", async (req, res) => {
  const { phone } = req.params;
  const { startDate, endDate, expense } = req.body;

  if (!startDate || !endDate || !expense) {
    return res.status(400).json({ error: "Start Date, End Date, and Expense are required" });
  }

  try {
    // Check if employee exists using their phone number
    const employee = await new Promise((resolve, reject) => {
      Employee.findByPhone(phone, (err, employee) => {
        if (err || !employee) reject("Employee not found");
        resolve(employee);
      });
    });

    // Update salary details
    const result = await new Promise((resolve, reject) => {
      Salary.updateSalaryDetails(phone, { startDate, endDate, expense }, (err, result) => {
        if (err) reject("Error updating salary record");
        resolve(result);
      });
    });

    res.status(200).json({ message: "Salary record updated successfully", result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
