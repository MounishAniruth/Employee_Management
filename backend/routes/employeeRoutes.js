const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Route to get all employees for a specific lorry (by registration number)
router.get('/:registrationNumber', (req, res) => {
    const { registrationNumber } = req.params;
  
    if (!registrationNumber) {
      return res.status(400).json({ error: 'Registration number is required.' });
    }
  
    Employee.getEmployeesByLorry(registrationNumber, (error, results) => {
      if (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({ error: 'Error fetching employees.' });
      }
      return res.status(200).json(results);
    });
  });  
// Route to update an employee's salary
router.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { newSalary } = req.body;

  Employee.updateEmployeeSalary(id, newSalary, (err, result) => {
    if (err) {
      console.error('Error updating employee salary:', err);
      return res.status(500).json({ message: 'Error updating employee salary' });
    }
    res.status(200).json({ message: 'Employee salary updated successfully' });
  });
});

// Route to delete an employee
router.delete('/employees/:id', (req, res) => {
  const { id } = req.params;

  Employee.deleteEmployee(id, (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ message: 'Error deleting employee' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  });
});

module.exports = router;
