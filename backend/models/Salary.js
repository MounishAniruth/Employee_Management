const db = require("../config/db");

const Salary = {
  // Add a salary record for an employee
  addSalary: (data, callback) => {
    if (!data.employee_id || !data.month || !data.year || !data.salary_per_day || !data.days_worked) {
      return callback(new Error("Missing required fields for adding salary"), null);
    }

    const query = `
      INSERT INTO employee_salaries (employee_id, month, year, salary_per_day, days_worked, expense)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [data.employee_id, data.month, data.year, data.salary_per_day, data.days_worked, data.expense || 0],
      (err, result) => {
        if (err) {
          console.error("Error adding salary:", err);
          return callback(err, null);
        }
        callback(null, result);
      }
    );
  },

  // Update a salary record
  updateSalary: (data, callback) => {
    if (!data.employee_id || !data.month || !data.year || data.days_worked === undefined || data.expense === undefined) {
      return callback(new Error("Missing required fields for updating salary"), null);
    }

    const query = `
      UPDATE employee_salaries 
      SET days_worked = ?, expense = ?
      WHERE employee_id = ? AND month = ? AND year = ?
    `;
    db.query(
      query,
      [data.days_worked, data.expense, data.employee_id, data.month, data.year],
      (err, result) => {
        if (err) {
          console.error("Error updating salary:", err);
          return callback(err, null);
        }
        callback(null, result);
      }
    );
  },

  // Fetch salary records by employee ID
  findByEmployee: (employee_id, callback) => {
    if (!employee_id) {
      return callback(new Error("Employee ID is required to fetch salary records"), null);
    }

    const query = `
      SELECT * FROM employee_salaries 
      WHERE employee_id = ? 
      ORDER BY year DESC, month DESC
    `;
    db.query(query, [employee_id], (err, results) => {
      if (err) {
        console.error("Error fetching salaries:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

const Expense = {
  // Add an expense record for an employee
  addExpense: (data, callback) => {
    if (!data.employee_id || !data.expense_date || !data.amount) {
      return callback(new Error("Missing required fields for adding expense"), null);
    }

    const query = `
      INSERT INTO employee_expenses (employee_id, expense_date, amount)
      VALUES (?, ?, ?)
    `;
    db.query(query, [data.employee_id, data.expense_date, data.amount], (err, result) => {
      if (err) {
        console.error("Error adding expense:", err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  // Fetch expenses by employee ID (Optional Extension)
  findByEmployee: (employee_id, callback) => {
    if (!employee_id) {
      return callback(new Error("Employee ID is required to fetch expense records"), null);
    }

    const query = `
      SELECT * FROM employee_expenses 
      WHERE employee_id = ? 
      ORDER BY expense_date DESC
    `;
    db.query(query, [employee_id], (err, results) => {
      if (err) {
        console.error("Error fetching expenses:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

// Export both models
module.exports = { Salary, Expense };
