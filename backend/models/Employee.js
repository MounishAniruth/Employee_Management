const db = require("../config/db");

const Employee = {
  // Check if the lorry exists
  checkLorryExists: (lorry_id, callback) => {
    const query = "SELECT * FROM lorries WHERE id = ?";
    db.query(query, [lorry_id], (err, results) => {
      if (err) {
        return callback("Database error while checking lorry existence.", null);
      }
      if (results.length === 0) {
        return callback("Lorry ID does not exist.", null);
      }
      callback(null, results);
    });
  },

  findByRoleAndLorry: (lorry_id, role, callback) => {
    const query = "SELECT name, phone, fixed_salary FROM employees WHERE lorry_id = ? AND role = ?";
    db.query(query, [lorry_id, role], (err, results) => {
      if (err) return callback("Error fetching employees by role and lorry.", null);
      callback(null, results);
    });
  },
  
  // Add a new employee
  addEmployee: (data, callback) => {
    Employee.checkLorryExists(data.lorry_id, (err) => {
      if (err) return callback(err, null);

      const query = "INSERT INTO employees (lorry_id, name, phone, role, fixed_salary) VALUES (?, ?, ?, ?, ?)";
      db.query(query, [data.lorry_id, data.name, data.phone, data.role, data.fixed_salary], (err, result) => {
        if (err) return callback("Error inserting employee into the database.", null);
        callback(null, result);
      });
    });
  },

  // Find employee by phone
  findByPhone: (phone, callback) => {
    const query = "SELECT * FROM employees WHERE phone = ?";
    db.query(query, [phone], (err, result) => {
      if (err) return callback("Error fetching employee by phone.", null);
      if (result.length === 0) return callback(null, null); // No employee found
      callback(null, result[0]); // Return the first employee (assuming phone is unique)
    });
  },

  // Delete employee by ID
  deleteById: (id, callback) => {
    const query = "DELETE FROM employees WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return callback("Error deleting employee by ID.", null);
      callback(null, result);
    });
  }
};

module.exports = Employee;
