const db = require("../config/db");

const Salary = {
  // Add a new salary record for an employee
  addSalary: (employeePhone, { startDate, endDate, expense }, callback) => {
    const daysWorked = Salary.calculateDaysWorked(startDate, endDate);

    // Query to insert a new salary record
    const query = `
      INSERT INTO employee_salaries (employee_id, start_date, end_date, expense_paid, days_worked)
      VALUES ((SELECT id FROM employees WHERE phone = ?), ?, ?, ?, ?)
    `;
    
    db.query(query, [employeePhone, startDate, endDate, expense, daysWorked], (err, result) => {
      if (err) return callback("Error adding salary record.", null);
      callback(null, result);
    });
  },

  // Get salary records for an employee by phone number
  getSalaryByEmployeePhone: (employeePhone, callback) => {
    const query = `
      SELECT es.id, es.start_date, es.end_date, es.expense_paid, es.days_worked
      FROM employee_salaries es
      JOIN employees e ON es.employee_id = e.id
      WHERE e.phone = ?
    `;
    
    db.query(query, [employeePhone], (err, result) => {
      if (err) return callback("Error fetching salary records.", null);
      callback(null, result);
    });
  },

  // Update existing salary record or insert a new one if not exists
  updateSalaryDetails: (employeePhone, { startDate, endDate, expense }, callback) => {
    const daysWorked = Salary.calculateDaysWorked(startDate, endDate);
    
    const query = `
      INSERT INTO employee_salaries (employee_id, start_date, end_date, expense_paid, days_worked)
      VALUES ((SELECT id FROM employees WHERE phone = ?), ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE expense_paid = ?, days_worked = ?
    `;
    
    db.query(query, [employeePhone, startDate, endDate, expense, daysWorked, expense, daysWorked], (err, result) => {
      if (err) return callback("Error updating salary details.", null);
      callback(null, result);
    });
  },

  // Helper function to calculate the days worked between two dates
  calculateDaysWorked: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  }
};

module.exports = Salary;
