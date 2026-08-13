const db = require("../config/db");

const SalaryModel = {

  // =====================================================
  // ADD SALARY RECORD
  // =====================================================

  async addSalaryRecord(
    employeeId,
    startDate,
    endDate,
    expensePaid,
    expensePaymentMethod
  ) {
    const query = `
      INSERT INTO employee_salaries
      (
        employee_id,
        start_date,
        end_date,
        expense_paid,
        expense_payment_method
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      employeeId,
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod
    ]);

    return result.insertId;
  },


  // =====================================================
  // GET SALARY RECORDS FOR EMPLOYEE
  // =====================================================

  async getSalaryRecordsByEmployee(employeeId) {

    const query = `
      SELECT
        es.id,
        es.start_date,
        es.end_date,
        DATEDIFF(es.end_date, es.start_date) + 1 AS days_worked,
        es.expense_paid,
        es.expense_payment_method,
        e.name
      FROM employee_salaries es
      JOIN employees e
        ON es.employee_id = e.id
      WHERE es.employee_id = ?
      ORDER BY es.start_date DESC
    `;

    const [rows] = await db.query(query, [employeeId]);

    return rows;
  },


  // =====================================================
  // UPDATE SALARY RECORD
  // =====================================================

  async updateSalaryRecord(
    salaryId,
    startDate,
    endDate,
    expensePaid,
    expensePaymentMethod
  ) {

    console.log("Updating salary record with:", {
      salaryId,
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod
    });

    const query = `
      UPDATE employee_salaries
      SET
        start_date = ?,
        end_date = ?,
        expense_paid = ?,
        expense_payment_method = ?
      WHERE id = ?
    `;

    const [result] = await db.query(query, [
      startDate,
      endDate,
      expensePaid,
      expensePaymentMethod,
      salaryId
    ]);

    console.log("Update Result:", result);

    return result.affectedRows;
  },


  // =====================================================
  // DELETE SALARY RECORD
  // =====================================================

  async deleteSalaryRecord(salaryId) {

    const query = `
      DELETE FROM employee_salaries
      WHERE id = ?
    `;

    const [result] = await db.query(query, [salaryId]);

    return result.affectedRows;
  }

};

module.exports = SalaryModel;