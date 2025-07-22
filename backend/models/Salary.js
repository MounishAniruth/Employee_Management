const db = require("../config/db");

const SalaryModel = {
  // Add a new salary record
  async addSalaryRecord(employeeId, startDate, endDate, expensePaid, expensePaymentMethod) {
    const query = `
      INSERT INTO employee_salaries (employee_id, start_date, end_date, expense_paid, expense_payment_method)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      employeeId,
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod,
      salaryId,
    ]);
    return result.insertId;
  },

  // Fetch salary records for an employee with days worked calculated
  getSalaryRecordsByEmployee(employeeId, callback) {
    const query = `
      SELECT es.id, es.start_date, es.end_date, 
             DATEDIFF(es.end_date, es.start_date) + 1 AS days_worked, 
             es.expense_paid,
             es.expense_payment_method,
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

  // Update a salary record
  async updateSalaryRecord(salaryId, startDate, endDate, expensePaid, expensePaymentMethod) {
    console.log("Updating salary record with:", {
      salaryId,
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod
    });
  
    const query = `
      UPDATE employee_salaries
      SET start_date = ?, end_date = ?, expense_paid = ?, expense_payment_method = ?
      WHERE id = ?
    `;
  
    const [result] = await db.query(query, [
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod,
      salaryId,
    ]);
  
    console.log("Update Result:", result);
    return result.affectedRows;
  },
  

  // Delete a salary record
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
