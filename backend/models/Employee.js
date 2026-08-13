const db = require("../config/db");

const Employee = {
  // =====================================================
  // CHECK IF LORRY EXISTS
  // =====================================================
  checkLorryExists: async (lorry_id) => {
    const query = "SELECT * FROM lorries WHERE id = ?";

    const [results] = await db.query(query, [lorry_id]);

    if (results.length === 0) {
      throw new Error("Lorry ID does not exist.");
    }

    return results;
  },

  // =====================================================
  // GET EMPLOYEES BY ROLE AND LORRY
  // =====================================================
  findByRoleAndLorry: async (lorry_id, role) => {
    const query = `
      SELECT id, name, phone, role, fixed_salary
      FROM employees
      WHERE lorry_id = ? AND role = ?
    `;

    const [results] = await db.query(query, [
      lorry_id,
      role,
    ]);

    return results;
  },

  // =====================================================
  // ADD NEW EMPLOYEE
  // =====================================================
  addEmployee: async (data) => {
    // First check whether the lorry exists
    await Employee.checkLorryExists(data.lorry_id);

    const query = `
      INSERT INTO employees
      (lorry_id, name, phone, role, fixed_salary)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      data.lorry_id,
      data.name,
      data.phone,
      data.role,
      data.fixed_salary,
    ]);

    return result;
  },

  // =====================================================
  // FIND EMPLOYEE BY PHONE
  // =====================================================
  findByPhone: async (phone) => {
    const query =
      "SELECT * FROM employees WHERE phone = ?";

    const [result] = await db.query(query, [phone]);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },

  // =====================================================
  // DELETE EMPLOYEE BY ID
  // =====================================================
  deleteById: async (id) => {
    const query =
      "DELETE FROM employees WHERE id = ?";

    const [result] = await db.query(query, [id]);

    return result;
  },
};

module.exports = Employee;