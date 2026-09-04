const db = require("../config/db");

const Lorry = {

  // =====================================================
  // ADD LORRY
  // OWNER ONLY
  // =====================================================

  addLorry: async (data, userId) => {

    const query = `
      INSERT INTO lorries
      (
        owner_id,
        registration_number,
        model,
        year_built,
        owner_name
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      userId,
      data.registration_number,
      data.model,
      data.year_built,
      data.owner_name
    ]);

    return result;
  },


  // =====================================================
  // GET LORRIES
  //
  // OWNER        -> ALL
  // MANAGER      -> ALL
  // LORRY MANAGER -> ASSIGNED ONLY
  // =====================================================

  findAll: async (user) => {

    let query = `
      SELECT
        lorries.*,

        users.phone AS owner_phone,

        manager.name AS lorry_manager_name,

        manager.phone AS lorry_manager_phone

      FROM lorries

      LEFT JOIN users
        ON lorries.owner_id = users.id

      LEFT JOIN users AS manager
        ON lorries.lorry_manager_id = manager.id
    `;

    const params = [];

    if (user.user_type === "lorry_manager") {

      query += `
        WHERE lorries.lorry_manager_id = ?
      `;

      params.push(user.id);
    }

    query += `
      ORDER BY lorries.id DESC
    `;

    const [rows] =
      await db.query(query, params);

    return rows;
  },


  // =====================================================
  // GET ASSIGNED LORRY
  //
  // LORRY MANAGER ONLY
  // =====================================================

  findAssignedLorry: async (userId) => {

    const query = `
      SELECT
        lorries.*,

        users.phone AS owner_phone,

        manager.name AS lorry_manager_name,

        manager.phone AS lorry_manager_phone

      FROM lorries

      LEFT JOIN users
        ON lorries.owner_id = users.id

      LEFT JOIN users AS manager
        ON lorries.lorry_manager_id = manager.id

      WHERE lorries.lorry_manager_id = ?

      LIMIT 1
    `;

    const [rows] = await db.query(
      query,
      [userId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },


  // =====================================================
  // FIND LORRY FOR AUTHORIZED USER
  //
  // OWNER        -> ANY LORRY
  // MANAGER      -> ANY LORRY
  // LORRY MANAGER -> ASSIGNED LORRY ONLY
  // =====================================================

  findByIdForUser: async (
    lorryId,
    userId,
    userType
  ) => {

    let query;
    let params;


    // ================================================
    // OWNER
    // ================================================

    if (userType === "owner") {

      query = `
        SELECT
          lorries.*,

          users.phone AS owner_phone,

          manager.name AS lorry_manager_name,

          manager.phone AS lorry_manager_phone

        FROM lorries

        LEFT JOIN users
          ON lorries.owner_id = users.id

        LEFT JOIN users AS manager
          ON lorries.lorry_manager_id = manager.id

        WHERE lorries.id = ?
      `;

      params = [lorryId];
    }


    // ================================================
    // MANAGER
    // ================================================

    else if (userType === "manager") {

      query = `
        SELECT
          lorries.*,

          users.phone AS owner_phone,

          manager.name AS lorry_manager_name,

          manager.phone AS lorry_manager_phone

        FROM lorries

        LEFT JOIN users
          ON lorries.owner_id = users.id

        LEFT JOIN users AS manager
          ON lorries.lorry_manager_id = manager.id

        WHERE lorries.id = ?
      `;

      params = [lorryId];
    }


    // ================================================
    // LORRY MANAGER
    // ================================================

    else if (userType === "lorry_manager") {

      query = `
        SELECT
          lorries.*,

          users.phone AS owner_phone,

          manager.name AS lorry_manager_name,

          manager.phone AS lorry_manager_phone

        FROM lorries

        LEFT JOIN users
          ON lorries.owner_id = users.id

        LEFT JOIN users AS manager
          ON lorries.lorry_manager_id = manager.id

        WHERE lorries.id = ?

        AND lorries.lorry_manager_id = ?
      `;

      params = [
        lorryId,
        userId
      ];
    }


    // ================================================
    // INVALID USER TYPE
    // ================================================

    else {

      return null;
    }


    const [rows] =
      await db.query(query, params);


    if (rows.length === 0) {
      return null;
    }


    return rows[0];
  },


  // =====================================================
  // DELETE LORRY
  //
  // OWNER ONLY
  // =====================================================

  deleteLorry: async (id) => {

    const query = `
      DELETE FROM lorries
      WHERE id = ?
    `;

    const [result] =
      await db.query(
        query,
        [id]
      );


    if (result.affectedRows === 0) {

      throw new Error(
        "Lorry not found"
      );
    }


    return result;
  },


  // =====================================================
  // GET ALL LORRY MANAGERS
  // =====================================================

  getLorryManagers: async () => {

    const query = `
      SELECT
        id,
        name,
        phone

      FROM users

      WHERE user_type = 'lorry_manager'

      ORDER BY name ASC
    `;


    const [rows] =
      await db.query(query);

    return rows;
  },


  // =====================================================
  // ASSIGN / REASSIGN LORRY MANAGER
  //
  // OWNER ONLY
  //
  // One lorry manager -> maximum ONE lorry.
  //
  // ALSO:
  // Automatically creates or updates the corresponding
  // employee record.
  // =====================================================

  assignLorryManager: async (
    lorryId,
    managerId
  ) => {

    const connection =
      await db.getConnection();


    try {

      await connection.beginTransaction();


      // ================================================
      // CHECK MANAGER
      // ================================================

      const [managerRows] =
        await connection.query(
          `
          SELECT
            id,
            name,
            phone
          FROM users
          WHERE id = ?
          AND user_type = 'lorry_manager'
          `,
          [managerId]
        );


      if (managerRows.length === 0) {

        throw new Error(
          "Selected user is not a valid lorry manager"
        );
      }


      const manager =
        managerRows[0];


      // ================================================
      // CHECK LORRY
      // ================================================

      const [lorryRows] =
        await connection.query(
          `
          SELECT
            id
          FROM lorries
          WHERE id = ?
          `,
          [lorryId]
        );


      if (lorryRows.length === 0) {

        throw new Error(
          "Lorry not found"
        );
      }


      // ================================================
      // REMOVE MANAGER FROM OLD LORRY
      //
      // This guarantees:
      // One lorry manager = maximum one lorry
      // ================================================

      await connection.query(
        `
        UPDATE lorries
        SET lorry_manager_id = NULL
        WHERE lorry_manager_id = ?
        `,
        [managerId]
      );


      // ================================================
      // ASSIGN MANAGER TO NEW LORRY
      // ================================================

      await connection.query(
        `
        UPDATE lorries
        SET lorry_manager_id = ?
        WHERE id = ?
        `,
        [
          managerId,
          lorryId
        ]
      );


      // ================================================
      // CHECK EXISTING EMPLOYEE RECORD
      //
      // user_id connects:
      //
      // users.id
      //       ↓
      // employees.user_id
      // ================================================

      const [employeeRows] =
        await connection.query(
          `
          SELECT
            id,
            lorry_id
          FROM employees
          WHERE user_id = ?
          LIMIT 1
          `,
          [managerId]
        );


      // ================================================
      // EXISTING EMPLOYEE
      //
      // Move the employee to the newly assigned lorry.
      // Salary history remains because employee ID
      // remains the same.
      // ================================================

      if (employeeRows.length > 0) {

        const employeeId =
          employeeRows[0].id;


        await connection.query(
          `
          UPDATE employees
          SET
            lorry_id = ?,
            name = ?,
            phone = ?,
            role = 'lorry_manager'
          WHERE id = ?
          `,
          [
            lorryId,
            manager.name,
            manager.phone,
            employeeId
          ]
        );

      }


      // ================================================
      // NO EMPLOYEE RECORD
      //
      // Create employee automatically.
      //
      // fixed_salary = 0 initially.
      //
      // Owner/Manager can update the salary later.
      // ================================================

      else {

        await connection.query(
          `
          INSERT INTO employees
          (
            lorry_id,
            user_id,
            name,
            phone,
            role,
            fixed_salary
          )
          VALUES (?, ?, ?, ?, 'lorry_manager', 0.00)
          `,
          [
            lorryId,
            managerId,
            manager.name,
            manager.phone
          ]
        );

      }


      // ================================================
      // COMMIT
      // ================================================

      await connection.commit();

      return true;

    } catch (error) {

      await connection.rollback();

      throw error;

    } finally {

      connection.release();

    }

  },


  // =====================================================
  // REMOVE LORRY MANAGER
  //
  // OWNER ONLY
  //
  // IMPORTANT:
  // We remove the manager assignment from the lorry,
  // but DO NOT delete the employee record.
  //
  // This preserves salary/expense history.
  // =====================================================

  removeLorryManager: async (
    lorryId
  ) => {

    const connection =
      await db.getConnection();


    try {

      await connection.beginTransaction();


      // ================================================
      // GET CURRENT MANAGER
      // ================================================

      const [rows] =
        await connection.query(
          `
          SELECT
            lorry_manager_id
          FROM lorries
          WHERE id = ?
          `,
          [lorryId]
        );


      if (rows.length === 0) {

        throw new Error(
          "Lorry not found"
        );
      }


      const managerId =
        rows[0].lorry_manager_id;


      // ================================================
      // REMOVE MANAGER FROM LORRY
      // ================================================

      await connection.query(
        `
        UPDATE lorries
        SET lorry_manager_id = NULL
        WHERE id = ?
        `,
        [lorryId]
      );


      // ================================================
      // KEEP EMPLOYEE RECORD
      //
      // We intentionally do NOT delete the employee
      // because deleting it would also delete salary
      // records due to ON DELETE CASCADE.
      //
      // The employee record remains for salary history.
      // ================================================

      // Employee salary history preserved


      await connection.commit();

      return true;

    } catch (error) {

      await connection.rollback();

      throw error;

    } finally {

      connection.release();

    }

  },

  // =====================================================
  // ADD LORRY DOCUMENTS
  // =====================================================

  addDocumentUrls: async (lorryId, documentType, newUrls) => {
    let column;
    if (documentType === 'rc_book') column = 'rc_book_urls';
    else if (documentType === 'insurance') column = 'insurance_urls';
    else if (documentType === 'pollution') column = 'pollution_urls';
    else throw new Error("Invalid document type");

    const [rows] = await db.query(`SELECT ${column} FROM lorries WHERE id = ?`, [lorryId]);
    if (rows.length === 0) throw new Error("Lorry not found");

    let existingUrls = [];
    try {
      if (rows[0][column]) {
        existingUrls = typeof rows[0][column] === 'string' ? JSON.parse(rows[0][column]) : rows[0][column];
      }
    } catch (e) {}

    const updatedUrls = [...existingUrls, ...newUrls];

    await db.query(`UPDATE lorries SET ${column} = ? WHERE id = ?`, [JSON.stringify(updatedUrls), lorryId]);
    return updatedUrls;
  },


  // =====================================================
  // REMOVE LORRY DOCUMENT
  // =====================================================

  removeDocumentUrl: async (lorryId, documentType, urlToRemove) => {
    let column;
    if (documentType === 'rc_book') column = 'rc_book_urls';
    else if (documentType === 'insurance') column = 'insurance_urls';
    else if (documentType === 'pollution') column = 'pollution_urls';
    else throw new Error("Invalid document type");

    const [rows] = await db.query(`SELECT ${column} FROM lorries WHERE id = ?`, [lorryId]);
    if (rows.length === 0) throw new Error("Lorry not found");

    let existingUrls = [];
    try {
      if (rows[0][column]) {
        existingUrls = typeof rows[0][column] === 'string' ? JSON.parse(rows[0][column]) : rows[0][column];
      }
    } catch (e) {}

    const updatedUrls = existingUrls.filter(u => u !== urlToRemove);

    await db.query(`UPDATE lorries SET ${column} = ? WHERE id = ?`, [JSON.stringify(updatedUrls), lorryId]);
    return updatedUrls;
  }

};


module.exports = Lorry;