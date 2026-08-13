const db = require("../config/db");

const Lorry = {

  // =========================
  // ADD LORRY
  // =========================
  addLorry: async (data, userId) => {
    const query = `
      INSERT INTO lorries
      (owner_id, registration_number, model, year_built, owner_name)
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


  // =========================
  // GET ALL LORRIES
  // =========================
  findAll: async () => {
    const query = `
      SELECT
        lorries.*,
        users.phone AS owner_phone
      FROM lorries
      LEFT JOIN users
        ON lorries.owner_id = users.id
      ORDER BY lorries.id DESC
    `;

    const [rows] = await db.query(query);

    return rows;
  },


  // =========================
  // DELETE LORRY
  // =========================
  deleteLorry: async (id, userId) => {

    const query = `
      DELETE FROM lorries
      WHERE id = ?
      AND owner_id = ?
    `;

    const [result] = await db.query(query, [
      id,
      userId
    ]);

    if (result.affectedRows === 0) {
      throw new Error(
        "You are not authorized to delete this lorry"
      );
    }

    return result;
  },


  // =========================
  // FIND LORRY BY ID
  // =========================
  findById: async (id) => {

    const query = `
      SELECT
        lorries.*,
        users.phone AS owner_phone
      FROM lorries
      LEFT JOIN users
        ON lorries.owner_id = users.id
      WHERE lorries.id = ?
    `;

    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

};

module.exports = Lorry;