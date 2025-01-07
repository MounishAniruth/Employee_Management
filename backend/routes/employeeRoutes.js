
const express = require("express");
const db = require("../config/db");
const router = express.Router();
const Employee = require("../models/Employee");

// Add a new employee
// Add a new employee
router.post("/add", (req, res) => {
  const { name, phone, role, fixed_salary, lorry_id } = req.body;
  if (!name || !phone || !role || !fixed_salary || !lorry_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  Employee.addEmployee({ lorry_id, name, phone, role, fixed_salary }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Employee added successfully", result });
  });
});


// Get employees by role and lorry
router.get("/employeesByRole/:id/:role", async (req, res) => {
  const { id, role } = req.params;
  try {
    const results = await new Promise((resolve, reject) => {
      Employee.findByRoleAndLorry(id, role, (err, results) => {
        if (err) reject("Error fetching employees");
        resolve(results);
      });
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Update salary details
router.put("/updateExpense/:phone", async (req, res) => {
  const { phone } = req.params;
  const { startDate, endDate, expense } = req.body;

  try {
    // Step 1: Find the employee ID by phone
    db.query('SELECT id FROM employees WHERE phone = ?', [phone], (err, results) => {
      if (err) {
        console.error('Error fetching employee:', err);
        return res.status(500).json({ error: 'Error fetching employee' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const employeeId = results[0].id;

      // Step 2: Check if an entry already exists for this employee and date range
      db.query(
        'SELECT id FROM employee_salaries WHERE employee_id = ? AND start_date = ?',
        [employeeId, startDate],
        (err, results) => {
          if (err) {
            console.error('Error checking existing expense record:', err);
            return res.status(500).json({ error: 'Error checking existing expense' });
          }

          if (results.length > 0) {
            // Record exists, update it
            db.query(
              'UPDATE employee_salaries SET end_date = ?, expense_paid = ? WHERE id = ?',
              [endDate, expense, results[0].id],
              (err) => {
                if (err) {
                  console.error('Error updating expense:', err);
                  return res.status(500).json({ error: 'Error updating expense' });
                }
                res.status(200).json({ message: 'Expense updated successfully' });
              }
            );
          } else {
            // No existing record, insert a new one
            db.query(
              'INSERT INTO employee_salaries (employee_id, start_date, end_date, expense_paid) VALUES (?, ?, ?, ?)',
              [employeeId, startDate, endDate, expense],
              (err) => {
                if (err) {
                  console.error('Error inserting expense:', err);
                  return res.status(500).json({ error: 'Error inserting expense' });
                }
                res.status(200).json({ message: 'Expense added successfully' });
              }
            );
          }
        }
      );
    });
  } catch (err) {
    console.error('Error updating employee expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete employee by phone
router.delete('/employee/:phone', async (req, res) => {
  const { phone } = req.params;

  try {
    const employee = await new Promise((resolve, reject) => {
      Employee.findByPhone(phone, (err, employee) => {
        if (err || !employee) reject("Employee not found");
        resolve(employee);
      });
    });

    const [result] = await db.execute('DELETE FROM employees WHERE phone = ?', [phone]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get employee details by phone number
router.get("/api/employee/:phone", async (req, res) => {
  const { phone } = req.params;

  try {
    const employee = await new Promise((resolve, reject) => {
      Employee.findByPhone(phone, (err, employee) => {
        if (err) reject("Error fetching employee");
        if (!employee) reject("Employee not found");
        resolve(employee);
      });
    });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
