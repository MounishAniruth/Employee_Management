const db = require("../config/db");

const SalaryModel = {
  // Add a new salary record
  async addSalaryRecord(employeeId, startDate, endDate, expensePaid) {
    const query = `
      INSERT INTO employee_salaries (employee_id, start_date, end_date, expense_paid)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [employeeId, startDate, endDate, expensePaid]);
    return result.insertId;
  },

  // Fetch salary records for an employee with days worked calculated
  getSalaryRecordsByEmployee(employeeId, callback) {
    const query = `
      SELECT es.id, es.start_date, es.end_date, 
             DATEDIFF(es.end_date, es.start_date) AS days_worked, 
             es.expense_paid,
             e.name
      FROM employee_salaries es
      JOIN employees e ON es.employee_id = e.id
      WHERE es.employee_id = ?
    `;
  
    db.query(query, [employeeId], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  },

  async updateSalaryRecord(salaryId, startDate, endDate, expensePaid) {
    const query = `
      UPDATE employee_salaries
      SET start_date = ?, end_date = ?, expense_paid = ?
      WHERE id = ?
    `;
    const [result] = await db.query(query, [startDate, endDate, expensePaid, salaryId]);
    return result.affectedRows;
  },

  async deleteSalaryRecord(salaryId) {
    const query = `
      DELETE FROM employee_salaries
      WHERE id = ?
    `;
    const [result] = await db.query(query, [salaryId]);
    return result.affectedRows;
  },
};

module.exports = SalaryModel;
