const db = require("../config/db");

const Fuel = {

  // =====================================================
  // GET LORRY ID BY REGISTRATION NUMBER
  // =====================================================

  getLorryIdByRegistration: async (registration_number) => {

    const query = `
      SELECT id
      FROM lorries
      WHERE registration_number = ?
    `;

    const [rows] = await db.query(
      query,
      [registration_number]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0].id;
  },


  // =====================================================
  // ADD NEW FUEL ENTRY
  // =====================================================

  addFuelEntry: async (data) => {

    const {
      lorry_id,
      date_filled,
      bunk_name,
      litres_filled,
      price_per_litre,
      amount_paid
    } = data;

    const query = `
      INSERT INTO fuel
      (
        lorry_id,
        date_filled,
        bunk_name,
        litres_filled,
        price_per_litre,
        amount_paid,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;

    const [result] = await db.query(
      query,
      [
        lorry_id,
        date_filled,
        bunk_name,
        litres_filled,
        price_per_litre,
        amount_paid
      ]
    );

    return result.insertId;
  },


  // =====================================================
  // FETCH FUEL ENTRIES
  // =====================================================

  fetchFuelEntriesByLorry: async (
    lorry_id,
    startDate,
    endDate
  ) => {

    let query = `
      SELECT
        id,
        DATE_FORMAT(date_filled, '%d/%m/%Y') AS date_filled,
        bunk_name,
        litres_filled,
        price_per_litre,
        amount_paid,
        total_amount,
        remaining_amount,
        status
      FROM fuel
      WHERE lorry_id = ?
    `;

    const params = [lorry_id];


    // Date filter

    if (startDate && endDate) {

      query += `
        AND date_filled BETWEEN ? AND ?
      `;

      params.push(
        startDate,
        endDate
      );
    }


    query += `
      ORDER BY date_filled ASC, id ASC
    `;


    const [rows] = await db.query(
      query,
      params
    );

    return rows;
  },


  // =====================================================
  // CLEAR ONE PARTICULAR FUEL RECORD
  // DOES NOT DELETE THE RECORD
  // =====================================================

  clearFuelRecord: async (fuelId) => {

    const query = `
      UPDATE fuel
      SET status = 'cleared'
      WHERE id = ?
    `;

    const [result] = await db.query(
      query,
      [fuelId]
    );

    return result.affectedRows;
  }

};


module.exports = Fuel;