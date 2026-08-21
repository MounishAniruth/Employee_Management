const db = require("../config/db");


// =====================================================
// CREATE COMPLETE POINT
// =====================================================

const createPoint = async (pointData) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      lorry_id,

      point_date,

      broker_name,
      broker_location,
      broker_phone,

      party_name,
      party_location,
      party_mobile,

      total_depth,

      starting_rpm,
      closing_rpm,

      given_amount = 0,

      depth_rates = [],
      casing_details = [],
    } = pointData;


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      lorry_id === undefined ||
      lorry_id === null
    ) {
      throw new Error("Lorry ID is required.");
    }

    if (!point_date) {
      throw new Error("Point date is required.");
    }

    if (!broker_name) {
      throw new Error("Broker name is required.");
    }

    if (!broker_location) {
      throw new Error("Broker location is required.");
    }

    if (!broker_phone) {
      throw new Error("Broker phone is required.");
    }

    if (!party_name) {
      throw new Error("Party name is required.");
    }

    if (!party_location) {
      throw new Error("Party location is required.");
    }

    if (!party_mobile) {
      throw new Error("Party mobile is required.");
    }

    if (
      total_depth === undefined ||
      total_depth === null
    ) {
      throw new Error("Total depth is required.");
    }

    if (
      starting_rpm === undefined ||
      starting_rpm === null
    ) {
      throw new Error("Starting RPM is required.");
    }

    if (
      closing_rpm === undefined ||
      closing_rpm === null
    ) {
      throw new Error("Closing RPM is required.");
    }

    if (!Array.isArray(depth_rates)) {
      throw new Error(
        "depth_rates must be an array."
      );
    }

    if (!Array.isArray(casing_details)) {
      throw new Error(
        "casing_details must be an array."
      );
    }


    // =================================================
    // CONVERT VALUES TO NUMBERS
    // =================================================

    const lorryId = Number(lorry_id);

    const depth = Number(total_depth);

    const startRpm = Number(starting_rpm);

    const closeRpm = Number(closing_rpm);

    const given = Number(given_amount) || 0;


    // =================================================
    // NUMERIC VALIDATION
    // =================================================

    if (
      !Number.isInteger(lorryId) ||
      lorryId <= 0
    ) {
      throw new Error("Invalid lorry ID.");
    }

    if (Number.isNaN(depth)) {
      throw new Error(
        "Invalid total depth."
      );
    }

    if (Number.isNaN(startRpm)) {
      throw new Error(
        "Invalid starting RPM."
      );
    }

    if (Number.isNaN(closeRpm)) {
      throw new Error(
        "Invalid closing RPM."
      );
    }

    if (Number.isNaN(given)) {
      throw new Error(
        "Invalid given amount."
      );
    }


    if (depth <= 0) {
      throw new Error(
        "Total depth must be greater than 0."
      );
    }

    if (
      startRpm < 0 ||
      closeRpm < 0
    ) {
      throw new Error(
        "RPM cannot be negative."
      );
    }

    if (closeRpm < startRpm) {
      throw new Error(
        "Closing RPM cannot be less than starting RPM."
      );
    }

    if (given < 0) {
      throw new Error(
        "Given amount cannot be negative."
      );
    }


    // =================================================
    // CHECK LORRY EXISTS
    // =================================================

    const [lorryRows] =
      await connection.query(
        `
          SELECT id
          FROM lorries
          WHERE id = ?
        `,
        [lorryId]
      );

    if (lorryRows.length === 0) {
      throw new Error(
        "Lorry not found."
      );
    }


    // =================================================
    // CALCULATE DRILLING AMOUNT
    // =================================================

    let drillingAmount = 0;

    for (const rate of depth_rates) {

      const fromDepth =
        Number(rate.from_depth);

      const toDepth =
        Number(rate.to_depth);

      const ratePerFt =
        Number(rate.rate_per_ft);


      if (
        Number.isNaN(fromDepth) ||
        Number.isNaN(toDepth) ||
        Number.isNaN(ratePerFt)
      ) {
        throw new Error(
          "Invalid depth rate values."
        );
      }


      if (fromDepth < 0) {
        throw new Error(
          "Depth cannot be negative."
        );
      }


      if (toDepth <= fromDepth) {
        throw new Error(
          "to_depth must be greater than from_depth."
        );
      }


      if (ratePerFt < 0) {
        throw new Error(
          "Rate per ft cannot be negative."
        );
      }


      // -------------------------------------------------
      // Calculate only the drilled portion
      // of this particular depth slab
      // -------------------------------------------------

      const drilledInSlab =
        Math.max(
          0,
          Math.min(
            depth,
            toDepth
          ) - fromDepth
        );


      drillingAmount +=
        drilledInSlab * ratePerFt;
    }


    // =================================================
    // CALCULATE CASING AMOUNT
    // =================================================

    let casingAmount = 0;

    for (const casing of casing_details) {

      const casingDepth =
        Number(
          casing.casing_depth
        );

      const ratePerFt =
        Number(
          casing.rate_per_ft
        );


      if (!casing.pipe_size) {
        throw new Error(
          "Casing pipe size is required."
        );
      }


      if (
        Number.isNaN(casingDepth) ||
        Number.isNaN(ratePerFt)
      ) {
        throw new Error(
          "Invalid casing values."
        );
      }


      if (casingDepth <= 0) {
        throw new Error(
          "Casing depth must be greater than 0."
        );
      }


      if (ratePerFt < 0) {
        throw new Error(
          "Casing rate cannot be negative."
        );
      }


      casingAmount +=
        casingDepth * ratePerFt;
    }


    // =================================================
    // ROUND AMOUNTS
    // =================================================

    drillingAmount =
      Number(
        drillingAmount.toFixed(2)
      );

    casingAmount =
      Number(
        casingAmount.toFixed(2)
      );


    // =================================================
    // CREATE MAIN POINT
    //
    // IMPORTANT:
    // running_rpm
    // avg_depth_per_rpm
    // total_amount
    // balance
    //
    // are generated by MySQL.
    //
    // DO NOT INSERT THEM.
    // =================================================

    const pointQuery = `
      INSERT INTO point_details (
        lorry_id,

        point_date,

        broker_name,
        broker_location,
        broker_phone,

        party_name,
        party_location,
        party_mobile,

        total_depth,

        starting_rpm,
        closing_rpm,

        drilling_amount,
        casing_amount,

        given_amount
      )

      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `;


    const [pointResult] =
      await connection.query(
        pointQuery,
        [
          lorryId,

          point_date,

          broker_name,
          broker_location,
          broker_phone,

          party_name,
          party_location,
          party_mobile,

          depth,

          startRpm,
          closeRpm,

          drillingAmount,
          casingAmount,

          given,
        ]
      );


    const pointId =
      pointResult.insertId;


    // =================================================
    // INSERT DEPTH RATES
    // =================================================

    if (depth_rates.length > 0) {

      const rateQuery = `
        INSERT INTO point_depth_rates (
          point_id,
          from_depth,
          to_depth,
          rate_per_ft
        )

        VALUES (?, ?, ?, ?)
      `;


      for (const rate of depth_rates) {

        await connection.query(
          rateQuery,
          [
            pointId,

            Number(
              rate.from_depth
            ),

            Number(
              rate.to_depth
            ),

            Number(
              rate.rate_per_ft
            ),
          ]
        );
      }
    }


    // =================================================
    // INSERT CASING DETAILS
    // =================================================

    if (casing_details.length > 0) {

      const casingQuery = `
        INSERT INTO point_casing_details (
          point_id,
          pipe_size,
          casing_depth,
          rate_per_ft
        )

        VALUES (?, ?, ?, ?)
      `;


      for (const casing of casing_details) {

        await connection.query(
          casingQuery,
          [
            pointId,

            casing.pipe_size,

            Number(
              casing.casing_depth
            ),

            Number(
              casing.rate_per_ft
            ),
          ]
        );
      }
    }


    // =================================================
    // COMMIT TRANSACTION
    // =================================================

    await connection.commit();

    return pointId;


  } catch (error) {

    // =================================================
    // ROLLBACK
    // =================================================

    await connection.rollback();

    throw error;


  } finally {

    // =================================================
    // RELEASE CONNECTION
    // =================================================

    connection.release();
  }
};



// =====================================================
// GET ALL POINTS FOR A LORRY
// =====================================================

const getAllPoints = async (
  lorryId
) => {

  const query = `
    SELECT
      *
    FROM point_details

    WHERE lorry_id = ?

    ORDER BY
      point_date DESC,
      id DESC
  `;


  const [rows] =
    await db.query(
      query,
      [lorryId]
    );


  return rows;
};



// =====================================================
// GET POINT BY ID
// =====================================================

const getPointById = async (
  pointId
) => {

  // =================================================
  // GET MAIN POINT
  // =================================================

  const pointQuery = `
    SELECT
      *
    FROM point_details

    WHERE id = ?
  `;


  // =================================================
  // GET DEPTH RATES
  // =================================================

  const ratesQuery = `
    SELECT
      id,
      point_id,
      from_depth,
      to_depth,
      rate_per_ft

    FROM point_depth_rates

    WHERE point_id = ?

    ORDER BY
      from_depth ASC
  `;


  // =================================================
  // GET CASING DETAILS
  // =================================================

  const casingQuery = `
    SELECT
      id,
      point_id,
      pipe_size,
      casing_depth,
      rate_per_ft,
      amount

    FROM point_casing_details

    WHERE point_id = ?

    ORDER BY
      id ASC
  `;


  // =================================================
  // GET MAIN POINT
  // =================================================

  const [[point]] =
    await db.query(
      pointQuery,
      [pointId]
    );


  // =================================================
  // POINT NOT FOUND
  // =================================================

  if (!point) {
    return null;
  }


  // =================================================
  // GET DEPTH RATES
  // =================================================

  const [rates] =
    await db.query(
      ratesQuery,
      [pointId]
    );


  // =================================================
  // GET CASING DETAILS
  // =================================================

  const [casing] =
    await db.query(
      casingQuery,
      [pointId]
    );


  // =================================================
  // RETURN COMPLETE POINT
  // =================================================

  return {
    ...point,

    depth_rates: rates,

    casing_details: casing,
  };
};



// =====================================================
// DELETE POINT
// =====================================================

const deletePoint = async (
  pointId
) => {

  const query = `
    DELETE FROM point_details

    WHERE id = ?
  `;


  const [result] =
    await db.query(
      query,
      [pointId]
    );


  return result.affectedRows;
};



// =====================================================
// GET POINT SUMMARY FOR A LORRY
// =====================================================

const getPointSummary = async (
  lorryId,
  fromDate,
  toDate
) => {

  const query = `
    SELECT

      COUNT(*) AS total_points,

      COALESCE(
        SUM(total_depth),
        0
      ) AS total_depth,

      COALESCE(
        SUM(running_rpm),
        0
      ) AS total_running_rpm,


      CASE

        WHEN COALESCE(
          SUM(running_rpm),
          0
        ) = 0

        THEN 0

        ELSE

          COALESCE(
            SUM(total_depth),
            0
          )
          /
          SUM(running_rpm)

      END AS average_depth_per_rpm,


      COALESCE(
        SUM(drilling_amount),
        0
      ) AS total_drilling_amount,


      COALESCE(
        SUM(casing_amount),
        0
      ) AS total_casing_amount,


      COALESCE(
        SUM(total_amount),
        0
      ) AS total_amount,


      COALESCE(
        SUM(given_amount),
        0
      ) AS total_given_amount,


      COALESCE(
        SUM(balance),
        0
      ) AS total_balance


    FROM point_details


    WHERE
      lorry_id = ?

      AND point_date
      BETWEEN ? AND ?
  `;


  const [rows] =
    await db.query(
      query,
      [
        lorryId,
        fromDate,
        toDate,
      ]
    );


  return rows[0];
};



// =====================================================
// UPDATE COMPLETE POINT
// =====================================================

const updatePoint = async (
  pointId,
  pointData
) => {

  const connection =
    await db.getConnection();


  try {

    await connection.beginTransaction();


    const {

      // We accept lorry_id here,
      // but we don't change the point's
      // lorry during normal editing.

      lorry_id,

      point_date,

      broker_name,
      broker_location,
      broker_phone,

      party_name,
      party_location,
      party_mobile,

      total_depth,

      starting_rpm,
      closing_rpm,

      given_amount = 0,

      depth_rates = [],
      casing_details = [],

    } = pointData;


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!point_date) {
      throw new Error(
        "Point date is required."
      );
    }

    if (!broker_name) {
      throw new Error(
        "Broker name is required."
      );
    }

    if (!broker_location) {
      throw new Error(
        "Broker location is required."
      );
    }

    if (!broker_phone) {
      throw new Error(
        "Broker phone is required."
      );
    }

    if (!party_name) {
      throw new Error(
        "Party name is required."
      );
    }

    if (!party_location) {
      throw new Error(
        "Party location is required."
      );
    }

    if (!party_mobile) {
      throw new Error(
        "Party mobile is required."
      );
    }

    if (
      total_depth === undefined ||
      total_depth === null
    ) {
      throw new Error(
        "Total depth is required."
      );
    }

    if (
      starting_rpm === undefined ||
      starting_rpm === null
    ) {
      throw new Error(
        "Starting RPM is required."
      );
    }

    if (
      closing_rpm === undefined ||
      closing_rpm === null
    ) {
      throw new Error(
        "Closing RPM is required."
      );
    }

    if (!Array.isArray(depth_rates)) {
      throw new Error(
        "depth_rates must be an array."
      );
    }

    if (!Array.isArray(casing_details)) {
      throw new Error(
        "casing_details must be an array."
      );
    }


    // =================================================
    // CONVERT VALUES
    // =================================================

    const depth =
      Number(total_depth);

    const startRpm =
      Number(starting_rpm);

    const closeRpm =
      Number(closing_rpm);

    const given =
      Number(given_amount) || 0;


    // =================================================
    // NUMERIC VALIDATION
    // =================================================

    if (Number.isNaN(depth)) {
      throw new Error(
        "Invalid total depth."
      );
    }

    if (Number.isNaN(startRpm)) {
      throw new Error(
        "Invalid starting RPM."
      );
    }

    if (Number.isNaN(closeRpm)) {
      throw new Error(
        "Invalid closing RPM."
      );
    }

    if (Number.isNaN(given)) {
      throw new Error(
        "Invalid given amount."
      );
    }


    if (depth <= 0) {
      throw new Error(
        "Total depth must be greater than 0."
      );
    }

    if (
      startRpm < 0 ||
      closeRpm < 0
    ) {
      throw new Error(
        "RPM cannot be negative."
      );
    }

    if (closeRpm < startRpm) {
      throw new Error(
        "Closing RPM cannot be less than starting RPM."
      );
    }

    if (given < 0) {
      throw new Error(
        "Given amount cannot be negative."
      );
    }


    // =================================================
    // CHECK EXISTING POINT
    // =================================================

    const [existingPoint] =
      await connection.query(
        `
          SELECT
            id,
            lorry_id

          FROM point_details

          WHERE id = ?
        `,
        [pointId]
      );


    if (
      existingPoint.length === 0
    ) {
      throw new Error(
        "Point not found."
      );
    }


    const existingLorryId =
      existingPoint[0].lorry_id;


    // =================================================
    // IF LORRY ID WAS PROVIDED,
    // VERIFY IT MATCHES
    // =================================================

    if (
      lorry_id !== undefined &&
      lorry_id !== null
    ) {

      const requestedLorryId =
        Number(lorry_id);


      if (
        !Number.isInteger(
          requestedLorryId
        ) ||
        requestedLorryId <= 0
      ) {
        throw new Error(
          "Invalid lorry ID."
        );
      }


      if (
        requestedLorryId !==
        Number(existingLorryId)
      ) {
        throw new Error(
          "Point does not belong to this lorry."
        );
      }
    }


    // =================================================
    // CALCULATE DRILLING AMOUNT
    // =================================================

    let drillingAmount = 0;


    for (
      const rate of depth_rates
    ) {

      const fromDepth =
        Number(
          rate.from_depth
        );

      const toDepth =
        Number(
          rate.to_depth
        );

      const ratePerFt =
        Number(
          rate.rate_per_ft
        );


      if (
        Number.isNaN(fromDepth) ||
        Number.isNaN(toDepth) ||
        Number.isNaN(ratePerFt)
      ) {
        throw new Error(
          "Invalid depth rate values."
        );
      }


      if (fromDepth < 0) {
        throw new Error(
          "Depth cannot be negative."
        );
      }


      if (
        toDepth <= fromDepth
      ) {
        throw new Error(
          "to_depth must be greater than from_depth."
        );
      }


      if (ratePerFt < 0) {
        throw new Error(
          "Rate per ft cannot be negative."
        );
      }


      const drilledInSlab =
        Math.max(
          0,
          Math.min(
            depth,
            toDepth
          ) - fromDepth
        );


      drillingAmount +=
        drilledInSlab *
        ratePerFt;
    }


    // =================================================
    // CALCULATE CASING AMOUNT
    // =================================================

    let casingAmount = 0;


    for (
      const casing of casing_details
    ) {

      const casingDepth =
        Number(
          casing.casing_depth
        );

      const ratePerFt =
        Number(
          casing.rate_per_ft
        );


      if (!casing.pipe_size) {
        throw new Error(
          "Casing pipe size is required."
        );
      }


      if (
        Number.isNaN(
          casingDepth
        ) ||
        Number.isNaN(
          ratePerFt
        )
      ) {
        throw new Error(
          "Invalid casing values."
        );
      }


      if (casingDepth <= 0) {
        throw new Error(
          "Casing depth must be greater than 0."
        );
      }


      if (ratePerFt < 0) {
        throw new Error(
          "Casing rate cannot be negative."
        );
      }


      casingAmount +=
        casingDepth *
        ratePerFt;
    }


    // =================================================
    // ROUND AMOUNTS
    // =================================================

    drillingAmount =
      Number(
        drillingAmount.toFixed(2)
      );

    casingAmount =
      Number(
        casingAmount.toFixed(2)
      );


    // =================================================
    // UPDATE MAIN POINT
    //
    // lorry_id is intentionally NOT changed.
    // =================================================

    await connection.query(
      `
        UPDATE point_details

        SET

          point_date = ?,

          broker_name = ?,
          broker_location = ?,
          broker_phone = ?,

          party_name = ?,
          party_location = ?,
          party_mobile = ?,

          total_depth = ?,

          starting_rpm = ?,
          closing_rpm = ?,

          drilling_amount = ?,
          casing_amount = ?,

          given_amount = ?

        WHERE id = ?
      `,

      [
        point_date,

        broker_name,
        broker_location,
        broker_phone,

        party_name,
        party_location,
        party_mobile,

        depth,

        startRpm,
        closeRpm,

        drillingAmount,
        casingAmount,

        given,

        pointId,
      ]
    );


    // =================================================
    // DELETE OLD DEPTH RATES
    // =================================================

    await connection.query(
      `
        DELETE FROM point_depth_rates

        WHERE point_id = ?
      `,
      [pointId]
    );


    // =================================================
    // INSERT NEW DEPTH RATES
    // =================================================

    if (
      depth_rates.length > 0
    ) {

      const rateQuery = `
        INSERT INTO point_depth_rates (
          point_id,
          from_depth,
          to_depth,
          rate_per_ft
        )

        VALUES (?, ?, ?, ?)
      `;


      for (
        const rate of depth_rates
      ) {

        await connection.query(
          rateQuery,
          [
            pointId,

            Number(
              rate.from_depth
            ),

            Number(
              rate.to_depth
            ),

            Number(
              rate.rate_per_ft
            ),
          ]
        );
      }
    }


    // =================================================
    // DELETE OLD CASING
    // =================================================

    await connection.query(
      `
        DELETE FROM point_casing_details

        WHERE point_id = ?
      `,
      [pointId]
    );


    // =================================================
    // INSERT NEW CASING
    // =================================================

    if (
      casing_details.length > 0
    ) {

      const casingQuery = `
        INSERT INTO point_casing_details (
          point_id,
          pipe_size,
          casing_depth,
          rate_per_ft
        )

        VALUES (?, ?, ?, ?)
      `;


      for (
        const casing of casing_details
      ) {

        await connection.query(
          casingQuery,
          [
            pointId,

            casing.pipe_size,

            Number(
              casing.casing_depth
            ),

            Number(
              casing.rate_per_ft
            ),
          ]
        );
      }
    }


    // =================================================
    // COMMIT
    // =================================================

    await connection.commit();


  } catch (error) {

    // =================================================
    // ROLLBACK
    // =================================================

    await connection.rollback();

    throw error;


  } finally {

    connection.release();
  }
};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

  createPoint,

  updatePoint,

  getAllPoints,

  getPointById,

  deletePoint,

  getPointSummary,

};