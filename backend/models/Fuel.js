const db = require("../config/db");

const Fuel = {

  // =====================================================
  // GET LORRY ID BY REGISTRATION NUMBER
  // =====================================================

  getLorryIdByRegistration: async (
    registration_number
  ) => {

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
  // GET LORRY DETAILS
  // =====================================================

  getLorryById: async (lorryId) => {

    const query = `
      SELECT
        id,
        registration_number,
        owner_id,
        lorry_manager_id
      FROM lorries
      WHERE id = ?
    `;

    const [rows] = await db.query(
      query,
      [lorryId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },


  // =====================================================
  // CHECK USER ACCESS TO LORRY
  //
  // OWNER
  //     -> ANY LORRY
  //
  // MANAGER
  //     -> ANY LORRY
  //
  // LORRY MANAGER
  //     -> ASSIGNED LORRY ONLY
  // =====================================================

  checkLorryAccess: async (
    lorryId,
    userId,
    userType
  ) => {

    const lorry =
      await Fuel.getLorryById(
        lorryId
      );


    // ===================================================
    // LORRY NOT FOUND
    // ===================================================

    if (!lorry) {

      return {
        allowed: false,
        reason: "Lorry not found"
      };

    }


    // ===================================================
    // OWNER
    // ===================================================

    if (
      userType === "owner"
    ) {

      return {
        allowed: true,
        lorry
      };

    }


    // ===================================================
    // MANAGER
    // ===================================================

    if (
      userType === "manager"
    ) {

      return {
        allowed: true,
        lorry
      };

    }


    // ===================================================
    // LORRY MANAGER
    // ===================================================

    if (
      userType === "lorry_manager"
    ) {

      if (
        Number(lorry.lorry_manager_id) ===
        Number(userId)
      ) {

        return {
          allowed: true,
          lorry
        };

      }


      return {
        allowed: false,
        reason:
          "You are not assigned to this lorry"
      };

    }


    // ===================================================
    // INVALID ROLE
    // ===================================================

    return {
      allowed: false,
      reason:
        "You do not have permission to manage fuel"
    };

  },


  // =====================================================
  // GET FUEL RECORD BY ID
  //
  // Useful before clearing a fuel record.
  // =====================================================

  getFuelById: async (
    fuelId
  ) => {

    const query = `
      SELECT
        id,
        lorry_id,
        date_filled,
        bunk_name,
        litres_filled,
        price_per_litre,
        total_amount,
        amount_paid,
        remaining_amount,
        status,
        bill_image_url
      FROM fuel
      WHERE id = ?
    `;

    const [rows] = await db.query(
      query,
      [fuelId]
    );


    if (rows.length === 0) {
      return null;
    }


    return rows[0];

  },


  // =====================================================
  // ADD NEW FUEL ENTRY
  // =====================================================

  addFuelEntry: async (
    data
  ) => {

    const {
      lorry_id,
      date_filled,
      bunk_name,
      litres_filled,
      price_per_litre,
      amount_paid,
      bill_image_url = null
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
        status,
        bill_image_url
      )
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `;


    const [result] =
      await db.query(
        query,
        [
          lorry_id,
          date_filled,
          bunk_name,
          litres_filled,
          price_per_litre,
          amount_paid,
          bill_image_url
        ]
      );


    return result.insertId;

  },


  // =====================================================
  // FETCH FUEL ENTRIES BY LORRY
  // =====================================================

  fetchFuelEntriesByLorry: async (
    lorry_id,
    startDate,
    endDate
  ) => {

    let query = `
      SELECT
        id,

        DATE_FORMAT(
          date_filled,
          '%d/%m/%Y'
        ) AS date_filled,

        bunk_name,

        litres_filled,

        price_per_litre,

        amount_paid,

        total_amount,

        remaining_amount,

        status,

        bill_image_url

      FROM fuel

      WHERE lorry_id = ?
    `;


    const params = [
      lorry_id
    ];


    // =================================================
    // DATE FILTER
    // =================================================

    if (
      startDate &&
      endDate
    ) {

      query += `
        AND date_filled BETWEEN ? AND ?
      `;


      params.push(
        startDate,
        endDate
      );

    }


    query += `
      ORDER BY
        date_filled ASC,
        id ASC
    `;


    const [rows] =
      await db.query(
        query,
        params
      );


    return rows;

  },


  // =====================================================
  // CLEAR ONE PARTICULAR FUEL RECORD
  //
  // DOES NOT DELETE THE RECORD
  // =====================================================

  clearFuelRecord: async (
    fuelId
  ) => {

    const query = `
      UPDATE fuel
      SET status = 'cleared'
      WHERE id = ?
    `;


    const [result] =
      await db.query(
        query,
        [fuelId]
      );


    return result.affectedRows;

  },


  // =====================================================
  // GET LORRY ID FROM FUEL RECORD
  // =====================================================

  getLorryIdByFuelId: async (
    fuelId
  ) => {

    const query = `
      SELECT lorry_id
      FROM fuel
      WHERE id = ?
    `;


    const [rows] =
      await db.query(
        query,
        [fuelId]
      );


    if (rows.length === 0) {
      return null;
    }


    return rows[0].lorry_id;

  }

};


module.exports = Fuel;