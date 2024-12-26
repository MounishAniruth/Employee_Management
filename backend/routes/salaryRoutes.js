const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Route to add a salary record
router.post("/add", (req, res) => {
  const { employee_id, month, year, salary_per_day, days_worked, expense } = req.body;

  if (!employee_id || !month || !year || !salary_per_day || !days_worked) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Calculate earned automatically, based on salary_per_day and days_worked
  const earned = salary_per_day * days_worked;

  const query = "INSERT INTO employee_salaries (employee_id, month, year, salary_per_day, days_worked, expense, earned) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(query, [employee_id, month, year, salary_per_day, days_worked, expense, earned], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error adding salary record" });
    }
    res.status(200).json({ message: "Salary record added successfully", salary: result });
  });
});

// Route to update a salary record
router.put("/update", (req, res) => {
  const { employee_id, month, year, days_worked, expense } = req.body;

  if (!employee_id || !month || !year || !days_worked) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Recalculate earned value based on days worked
  const queryFindSalary = "SELECT salary_per_day FROM employee_salaries WHERE employee_id = ? AND month = ? AND year = ?";
  
  db.query(queryFindSalary, [employee_id, month, year], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching salary record" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Salary record not found" });
    }
    const salary_per_day = result[0].salary_per_day;
    const earned = salary_per_day * days_worked;

    const queryUpdateSalary = "UPDATE employee_salaries SET days_worked = ?, expense = ?, earned = ? WHERE employee_id = ? AND month = ? AND year = ?";
    
    db.query(queryUpdateSalary, [days_worked, expense, earned, employee_id, month, year], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error updating salary record" });
      }
      res.status(200).json({ message: "Salary record updated successfully", salary: result });
    });
  });
});

// Route to fetch salary records by employee ID
router.get("/employee/:id/details", (req, res) => {
  const { id } = req.params;

  const querySalaries = "SELECT * FROM employee_salaries WHERE employee_id = ?";
  const queryExpenses = "SELECT * FROM employee_expenses WHERE employee_id = ?";

  db.query(querySalaries, [id], (err, salaries) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching salary records" });
    }

    db.query(queryExpenses, [id], (err, expenses) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching expense records" });
      }

      res.json({ salaries, expenses });
    });
  });
});


// Route to add an expense record for an employee
router.post("/expense/add", (req, res) => {
  const { employee_id, expense_date, amount } = req.body;

  if (!employee_id || !expense_date || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO employee_expenses (employee_id, expense_date, amount) VALUES (?, ?, ?)";

  db.query(query, [employee_id, expense_date, amount], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error adding expense record" });
    }
    res.status(200).json({ message: "Expense record added successfully", expense: result });
  });
});

// Route to fetch all expenses for an employee
router.get("/employee/:id/expenses", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM employee_expenses WHERE employee_id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching expense records" });
    }
    res.json(results);
  });
});

module.exports = router;
