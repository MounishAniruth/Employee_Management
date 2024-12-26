const db = require("../config/db");

const Employee = {
  // Check if the lorry exists in the lorries table
  checkLorryExists: (lorry_id, callback) => {
    const query = "SELECT * FROM lorries WHERE id = ?";
    db.query(query, [lorry_id], (err, results) => {
      if (err) {
        console.error("Error checking lorry:", err);
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback("Lorry ID does not exist.", null);  // Lorry does not exist
      }
      callback(null, results);  // Lorry exists
    });
  },

  // Add a new employee
  addEmployee: (data, callback) => {
    console.log("Adding employee with data:", data);  // Log incoming data

    // First, check if the lorry exists
    Employee.checkLorryExists(data.lorry_id, (err, result) => {
      if (err) {
        return callback(err, null);  // Return the error if lorry doesn't exist
      }

      // Proceed to insert the employee
      const query = "INSERT INTO employees (lorry_id, name, phone, role, fixed_salary) VALUES (?, ?, ?, ?, ?)";
      db.query(query, [data.lorry_id, data.name, data.phone, data.role, data.fixed_salary], (err, result) => {
        if (err) {
          console.error("Error adding employee:", err);  // Log error
          return callback(err, null);
        }
        console.log("Employee added successfully:", result);  // Log success
        callback(null, result);  // Return result on success
      });
    });
  },

  // Get all employees
  findAll: (callback) => {
    const query = "SELECT * FROM employees";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching employees:", err);
        return callback(err, null);
      }
      callback(null, results);  // Return all employees
    });
  },

  // Find an employee by phone number
  findByPhone: (phone, callback) => {
    const query = "SELECT * FROM employees WHERE phone = ?";
    db.query(query, [phone], (err, result) => {
      if (err) {
        console.error("Error fetching employee by phone:", err);
        return callback(err, null);
      }
      callback(null, result);  // Return employee data
    });
  },

  // Update monthly data in Salary table
  updateMonthlyData: (phone, month, year, daysWorked, expense, callback) => {
    const query = `
      UPDATE salary
      SET days_worked = ?, expense = ?
      WHERE employee_phone = ? AND month = ? AND year = ?
    `;
    db.query(query, [daysWorked, expense, phone, month, year], (err, result) => {
      if (err) {
        console.error("Error updating salary data:", err);
        return callback(err, null);
      }
      callback(null, result);  // Return result if update is successful
    });
  },

  // Retrieve the annual summary for an employee
  getAnnualSummary: (phone, year, callback) => {
    const query = `
      SELECT 
        e.name AS employee_name,
        e.phone AS employee_phone,
        SUM(s.days_worked) AS total_days_worked,
        SUM(s.expense) AS total_expense,
        SUM(s.earnings) AS total_earnings,
        SUM(s.remaining_amount) AS total_remaining_amount
      FROM salary s
      JOIN employees e ON s.employee_phone = e.phone
      WHERE s.employee_phone = ? AND s.year = ?
      GROUP BY e.name, e.phone
    `;
    db.query(query, [phone, year], (err, result) => {
      if (err) {
        console.error("Error fetching annual summary:", err);
        return callback(err, null);
      }
      callback(null, result);  // Return the summary data
    });
  }
};

module.exports = Employee;
