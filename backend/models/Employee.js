const db = require("../config/db");

const Employee = {

  // =====================================================
  // CHECK IF LORRY EXISTS
  // =====================================================

  checkLorryExists: async (lorryId) => {

    const query = `
      SELECT
        id,
        registration_number
      FROM lorries
      WHERE id = ?
    `;

    const [rows] =
      await db.query(
        query,
        [lorryId]
      );

    if (rows.length === 0) {

      throw new Error(
        "Lorry ID does not exist."
      );

    }

    return rows[0];
  },


  // =====================================================
  // GET EMPLOYEES BY ROLE AND LORRY
  // =====================================================

  findByRoleAndLorry: async (
    lorryId,
    role
  ) => {

    const query = `
      SELECT
        e.id,
        e.user_id,
        e.lorry_id,
        e.name,
        e.phone,
        e.role,
        e.fixed_salary,
        e.created_at,
        e.updated_at,

        l.registration_number

      FROM employees e

      INNER JOIN lorries l
        ON e.lorry_id = l.id

      WHERE e.lorry_id = ?
      AND e.role = ?

      ORDER BY e.name ASC
    `;

    const [rows] =
      await db.query(
        query,
        [
          lorryId,
          role
        ]
      );

    return rows;
  },


  // =====================================================
  // GET ALL EMPLOYEES FOR LORRY
  // =====================================================

  findByLorry: async (
    lorryId
  ) => {

    const query = `
      SELECT
        e.id,
        e.user_id,
        e.lorry_id,
        e.name,
        e.phone,
        e.role,
        e.fixed_salary,
        e.created_at,
        e.updated_at,

        l.registration_number

      FROM employees e

      INNER JOIN lorries l
        ON e.lorry_id = l.id

      WHERE e.lorry_id = ?

      ORDER BY
        e.role ASC,
        e.name ASC
    `;

    const [rows] =
      await db.query(
        query,
        [lorryId]
      );

    return rows;
  },


  // =====================================================
  // FIND EMPLOYEE BY ID
  // =====================================================

  findById: async (
    id
  ) => {

    const query = `
      SELECT
        e.id,
        e.user_id,
        e.lorry_id,
        e.name,
        e.phone,
        e.role,
        e.fixed_salary,
        e.created_at,
        e.updated_at,

        l.registration_number

      FROM employees e

      INNER JOIN lorries l
        ON e.lorry_id = l.id

      WHERE e.id = ?
    `;

    const [rows] =
      await db.query(
        query,
        [id]
      );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },


  // =====================================================
  // FIND EMPLOYEE BY PHONE
  //
  // Used by:
  // GET /api/employee/details/:phone
  //
  // AND:
  // DELETE /api/employee/delete/:phone
  // =====================================================

  findByPhone: async (
    phone
  ) => {

    const query = `
      SELECT
        e.id,
        e.user_id,
        e.lorry_id,
        e.name,
        e.phone,
        e.role,
        e.fixed_salary,
        e.created_at,
        e.updated_at,

        l.registration_number

      FROM employees e

      INNER JOIN lorries l
        ON e.lorry_id = l.id

      WHERE e.phone = ?
    `;

    const [rows] =
      await db.query(
        query,
        [phone]
      );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },


  // =====================================================
  // ADD EMPLOYEE
  // =====================================================

  addEmployee: async (
    data
  ) => {

    await Employee.checkLorryExists(
      data.lorry_id
    );

    const query = `
      INSERT INTO employees
      (
        lorry_id,
        user_id,
        name,
        phone,
        role,
        fixed_salary
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] =
      await db.query(
        query,
        [
          data.lorry_id,
          data.user_id || null,
          data.name,
          data.phone,
          data.role,
          data.fixed_salary
        ]
      );

    return result;
  },


  // =====================================================
  // UPDATE EMPLOYEE
  // =====================================================

  updateEmployee: async (
    id,
    data
  ) => {

    const query = `
      UPDATE employees

      SET
        name = ?,
        phone = ?,
        role = ?,
        fixed_salary = ?

      WHERE id = ?
    `;

    const [result] =
      await db.query(
        query,
        [
          data.name,
          data.phone,
          data.role,
          data.fixed_salary,
          id
        ]
      );

    return result;
  },


  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  deleteById: async (
    id
  ) => {

    const query = `
      DELETE FROM employees
      WHERE id = ?
    `;

    const [result] =
      await db.query(
        query,
        [id]
      );

    return result;
  }

};

module.exports = Employee;