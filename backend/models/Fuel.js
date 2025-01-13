const db = require("../config/db");

const Fuel = {
  // Fetch lorry ID by registration number
  getLorryIdByRegistration: (registration_number, callback) => {
    const query = "SELECT id FROM lorries WHERE registration_number = ?";
    db.query(query, [registration_number], (err, results) => {
      if (err) return callback("Error fetching lorry ID.", null);
      if (results.length === 0) return callback(null, null); // Return null if no lorry found
      callback(null, results[0].id);
    });
  },

  // Add a new fuel entry
  addFuelEntry: (data, callback) => {
    const { lorry_id, date_filled, bunk_name, litres_filled, price_per_litre, amount_paid } = data;

    const query = `
    INSERT INTO fuel 
    (lorry_id, date_filled, bunk_name, litres_filled, price_per_litre, amount_paid) 
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [lorry_id, date_filled, bunk_name, litres_filled, price_per_litre, amount_paid],
      (err, result) => {
        if (err) {
            console.error("DB Insertion Error: ", err.sqlMessage);
            return callback("Error inserting fuel entry into the database.", null);
        }
        callback(null, result);
      } 
    );
  },

  // Fetch fuel entries for a specific lorry
  fetchFuelEntriesByLorry: (lorry_id, callback) => {
    const query = `
      SELECT 
        date_filled, 
        bunk_name, 
        litres_filled, 
        price_per_litre, 
        amount_paid, 
        total_amount, 
        remaining_amount 
      FROM fuel 
      WHERE lorry_id = ? 
      ORDER BY date_filled DESC
    `;
    db.query(query, [lorry_id], (err, results) => {
      if (err) return callback("Error fetching fuel entries.", null);
      callback(null, results);
    });
  }  
};

module.exports = Fuel;
