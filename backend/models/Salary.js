const db = require("../config/db");

const SalaryModel = {

  // =====================================================
  // ADD SALARY / EXPENSE RECORD
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


    const [result] =
      await db.query(
        query,
        [
          employeeId,
          startDate,
          endDate,
          expensePaid,
          expensePaymentMethod
        ]
      );


    return result.insertId;
  },


  // =====================================================
  // GET SALARY / EXPENSE RECORDS
  // FOR ONE EMPLOYEE
  //
  // employeeId -> employees.id
  // =====================================================

  async getSalaryRecordsByEmployee(
    employeeId
  ) {

    const query = `
      SELECT

        es.id,

        es.employee_id,

        es.start_date,

        es.end_date,

        es.days_worked,

        es.expense_paid,

        es.expense_payment_method,

        e.name,

        e.phone,

        e.role,

        e.fixed_salary,

        e.lorry_id,

        l.registration_number

      FROM employee_salaries es

      INNER JOIN employees e
        ON es.employee_id = e.id

      INNER JOIN lorries l
        ON e.lorry_id = l.id

      WHERE es.employee_id = ?

      ORDER BY
        es.start_date DESC,
        es.id DESC
    `;


    const [rows] =
      await db.query(
        query,
        [employeeId]
      );


    return rows;
  },


  // =====================================================
  // GET ALL SALARY / EXPENSE RECORDS
  // USING EMPLOYEE PHONE
  //
  // This is useful if you want to call:
  //
  // GET /api/salary/9876543210
  // =====================================================

  async getSalaryRecordsByPhone(
    phone
  ) {

    const query = `
      SELECT

        es.id,

        es.employee_id,

        es.start_date,

        es.end_date,

        es.days_worked,

        es.expense_paid,

        es.expense_payment_method,

        e.name,

        e.phone,

        e.role,

        e.fixed_salary,

        e.lorry_id,

        l.registration_number

      FROM employee_salaries es

      INNER JOIN employees e
        ON es.employee_id = e.id

      INNER JOIN lorries l
        ON e.lorry_id = l.id

      WHERE e.phone = ?

      ORDER BY
        es.start_date DESC,
        es.id DESC
    `;


    const [rows] =
      await db.query(
        query,
        [phone]
      );


    return rows;
  },


  // =====================================================
  // GET ONE SALARY RECORD
  // =====================================================

  async getSalaryRecordById(
    salaryId
  ) {

    const query = `
      SELECT

        es.id,

        es.employee_id,

        es.start_date,

        es.end_date,

        es.days_worked,

        es.expense_paid,

        es.expense_payment_method,

        e.name,

        e.phone,

        e.role,

        e.fixed_salary,

        e.lorry_id,

        l.registration_number

      FROM employee_salaries es

      INNER JOIN employees e
        ON es.employee_id = e.id

      INNER JOIN lorries l
        ON e.lorry_id = l.id

      WHERE es.id = ?
    `;


    const [rows] =
      await db.query(
        query,
        [salaryId]
      );


    if (
      rows.length === 0
    ) {

      return null;

    }


    return rows[0];
  },


  // =====================================================
  // UPDATE SALARY / EXPENSE RECORD
  // =====================================================

  async updateSalaryRecord(
    salaryId,
    startDate,
    endDate,
    expensePaid,
    expensePaymentMethod
  ) {

    const query = `
      UPDATE employee_salaries

      SET

        start_date = ?,

        end_date = ?,

        expense_paid = ?,

        expense_payment_method = ?

      WHERE id = ?
    `;


    const [result] =
      await db.query(
        query,
        [
          startDate,
          endDate,
          expensePaid,
          expensePaymentMethod,
          salaryId
        ]
      );


    return result;
  },


  // =====================================================
  // DELETE SALARY / EXPENSE RECORD
  // =====================================================

  async deleteSalaryRecord(
    salaryId
  ) {

    const query = `
      DELETE FROM employee_salaries

      WHERE id = ?
    `;


    const [result] =
      await db.query(
        query,
        [salaryId]
      );


    return result;
  },


  // =====================================================
  // UPDATE FIXED SALARY
  //
  // Creates a new salary history record and closes
  // the previous salary history record.
  // =====================================================

  async setFixedSalary(
    employeeId,
    newSalary,
    effectiveFrom,
    createdBy
  ) {

    // ================================================
    // GET DATABASE CONNECTION
    // ================================================

    const connection =
      await db.getConnection();


    try {

      // ================================================
      // START TRANSACTION
      // ================================================

      await connection.beginTransaction();


      // ================================================
      // CHECK EMPLOYEE EXISTS
      // ================================================

      const [
        employeeRows
      ] = await connection.query(
        `
          SELECT
            id,
            fixed_salary

          FROM employees

          WHERE id = ?

          LIMIT 1
        `,
        [employeeId]
      );


      if (
        employeeRows.length === 0
      ) {

        throw new Error(
          "Employee not found"
        );

      }


      // ================================================
      // FIND CURRENT SALARY HISTORY
      //
      // Current record means:
      //
      // effective_from <= new effective date
      // AND effective_to IS NULL
      // ================================================

      const [
        currentRows
      ] = await connection.query(
        `
          SELECT
            id,
            employee_id,
            fixed_salary,
            effective_from,
            effective_to

          FROM employee_salary_history

          WHERE employee_id = ?

            AND effective_from <= ?

            AND effective_to IS NULL

          ORDER BY
            effective_from DESC,
            id DESC

          LIMIT 1
        `,
        [
          employeeId,
          effectiveFrom
        ]
      );


      // ================================================
      // CLOSE PREVIOUS SALARY HISTORY
      // ================================================

      if (
        currentRows.length > 0
      ) {

        const current =
          currentRows[0];


        // ----------------------------------------------
        // Convert effectiveFrom into Date
        // ----------------------------------------------

        const previousEnd =
          new Date(
            effectiveFrom
          );


        // ----------------------------------------------
        // Previous salary ends one day before
        // the new salary becomes effective.
        // ----------------------------------------------

        previousEnd.setDate(
          previousEnd.getDate() - 1
        );


        const previousEndString =
          previousEnd
            .toISOString()
            .split("T")[0];


        await connection.query(
          `
            UPDATE employee_salary_history

            SET effective_to = ?

            WHERE id = ?
          `,
          [
            previousEndString,
            current.id
          ]
        );

      }


      // ================================================
      // INSERT NEW SALARY HISTORY
      // ================================================

      await connection.query(
        `
          INSERT INTO employee_salary_history
          (
            employee_id,
            fixed_salary,
            effective_from,
            effective_to,
            created_by
          )
          VALUES (?, ?, ?, NULL, ?)
        `,
        [
          employeeId,
          Number(newSalary),
          effectiveFrom,
          createdBy
        ]
      );


      // ================================================
      // UPDATE CURRENT EMPLOYEE SALARY
      // ================================================

      await connection.query(
        `
          UPDATE employees

          SET fixed_salary = ?

          WHERE id = ?
        `,
        [
          Number(newSalary),
          employeeId
        ]
      );


      // ================================================
      // COMMIT TRANSACTION
      // ================================================

      await connection.commit();


      return true;


    } catch (error) {

      // ================================================
      // ROLLBACK IF ANYTHING FAILS
      // ================================================

      await connection.rollback();


      throw error;


    } finally {

      // ================================================
      // RELEASE CONNECTION
      // ================================================

      connection.release();

    }

  },


  // =====================================================
  // GET FIXED SALARY HISTORY
  // =====================================================

  async getFixedSalaryHistory(
    employeeId
  ) {

    const query = `
      SELECT

        h.id,

        h.employee_id,

        h.fixed_salary,

        h.effective_from,

        h.effective_to,

        h.created_by,

        h.created_at,

        u.name AS updated_by_name

      FROM employee_salary_history h

      LEFT JOIN users u
        ON h.created_by = u.id

      WHERE h.employee_id = ?

      ORDER BY
        h.effective_from DESC,
        h.id DESC
    `;


    const [rows] =
      await db.query(
        query,
        [employeeId]
      );


    return rows;

  }

};


module.exports = SalaryModel;