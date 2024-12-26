const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Ensure this is imported

// Route to add an employee
router.post("/add", (req, res) => {
  const { lorry_id, name, phone, role, fixed_salary } = req.body;

  if (!lorry_id || !name || !phone || !role || !fixed_salary) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO employees (lorry_id, name, phone, role, fixed_salary) VALUES (?, ?, ?, ?, ?)";
  
  db.query(query, [lorry_id, name, phone, role, fixed_salary], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error adding employee" });
    }
    res.status(200).json({ message: "Employee added successfully", employee: result });
  });
});

// Route to get employees by lorry registration number
router.get("/employeesByRegistration/:id", (req, res) => {
  const { id } = req.params;

  // Find lorry_id based on registration number
  const queryLorryId = "SELECT id FROM lorries WHERE registration_number = ?";
  
  db.query(queryLorryId, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching lorry" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Lorry not found" });
    }

    const lorry_id = result[0].id;

    // Query to fetch employees by lorry_id
    const query = "SELECT * FROM employees WHERE lorry_id = ?";
    db.query(query, [lorry_id], (err, employees) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching employees" });
      }
      res.json(employees);
    });
  });
});

// Route to fetch employees by role for a particular lorry
router.get("/employeesByRole/:id/:role", (req, res) => {
  const { id, role } = req.params;
  const query = "SELECT name, phone, fixed_salary FROM employees WHERE lorry_id = ? AND role = ?";
  db.query(query, [id, role], (err, employees) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error fetching employees by role" });
    }
    res.json(employees);
  });
});

// Route to delete an employee by ID
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM employees WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ error: "Error deleting employee" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  });
});

module.exports = router;
