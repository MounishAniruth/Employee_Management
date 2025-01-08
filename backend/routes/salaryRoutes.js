const express = require('express');
const router = express.Router();
const db = require("../config/db");
const SalaryModel = require('../models/Salary');

// Add a salary record
router.post('/add', async (req, res) => {
  const { employeeId, startDate, endDate, expensePaid } = req.body;
  try {
    const insertId = await SalaryModel.addSalaryRecord(employeeId, startDate, endDate, expensePaid);
    res.status(201).json({ message: 'Salary record added successfully', salaryId: insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add salary record' });
  }
});

// Get salary records for an employee
router.get('/:phone', (req, res) => {
  const { phone } = req.params;
  db.query('SELECT id FROM employees WHERE phone = ?', [phone], (err, employeeResult) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (employeeResult.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeId = employeeResult[0].id;
    SalaryModel.getSalaryRecordsByEmployee(employeeId, (err, salaryRecords) => {
      if (err) {
        console.error('Error fetching salary details:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.status(200).json(salaryRecords);
    });
  });
});

// Update a salary record
router.put('/update/:salaryId', async (req, res) => {
  const { salaryId } = req.params;
  const { startDate, endDate, expensePaid } = req.body;
  try {
    const rowsAffected = await SalaryModel.updateSalaryRecord(salaryId, startDate, endDate, expensePaid);
    if (rowsAffected) {
      res.status(200).json({ message: 'Salary record updated successfully' });
    } else {
      res.status(404).json({ error: 'Salary record not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update salary record' });
  }
});

router.get('/calculate/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const records = await SalaryModel.getSalaryRecordsByEmployeeWithCalculations(employeeId);
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch salary records with calculations' });
  }
});

// Delete a salary record
router.delete('/delete/:salaryId', async (req, res) => {
  const { salaryId } = req.params;
  try {
    const rowsAffected = await SalaryModel.deleteSalaryRecord(salaryId);
    if (rowsAffected) {
      res.status(200).json({ message: 'Salary record deleted successfully' });
    } else {
      res.status(404).json({ error: 'Salary record not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete salary record' });
  }
});

module.exports = router;
