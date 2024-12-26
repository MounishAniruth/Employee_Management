const db = require("../config/db");

const Lorry = {
  // Add a new lorry
  addLorry: (data, callback) => {
    // Query to find the owner_id by phone
    const findOwnerQuery = "SELECT id FROM users WHERE phone = ?";

    db.query(findOwnerQuery, [data.owner_phone], (err, ownerResult) => {
      if (err) {
        console.error("Error fetching owner by phone:", err);
        return callback(err, null);
      }

      if (ownerResult.length === 0) {
        return callback(new Error("Owner not found with the provided phone"), null);
      }

      const owner_id = ownerResult[0].id;

      // Query to insert the lorry details
      const query = "INSERT INTO lorries (owner_id, registration_number, model, year_built, owner_name) VALUES (?, ?, ?, ?, ?)";

      db.query(
        query,
        [
          owner_id,  // Using the owner_id obtained from the users table
          data.registration_number,
          data.model,
          data.year_built,
          data.owner_name,
        ],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return callback(err, null); // Return error with null result
          }
          callback(null, result); // Proceed with the callback
        }
      );
    });
  },

  // Get all lorries
  findAll: (callback) => {
    const query = `
      SELECT lorries.*, users.phone AS owner_phone
      FROM lorries
      LEFT JOIN users ON lorries.owner_id = users.id
    `;
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching lorries:", err); // Log any errors
        return callback(err, null);
      }
      callback(null, result); // Return the result
    });
  },

  // Delete a lorry by ID
  deleteLorry: (id, callback) => {
    const query = "DELETE FROM lorries WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting lorry:", err); // Log any errors
        return callback(err, null);
      }
      callback(null, result); // Proceed with the callback
    });
  },

  // Find a lorry by ID
  findById: (id, callback) => {
    const query = `
      SELECT lorries.*, users.phone AS owner_phone
      FROM lorries
      LEFT JOIN users ON lorries.owner_id = users.id
      WHERE lorries.id = ?
    `;
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error fetching lorry by ID:", err); // Log errors
        return callback(err, null);
      }
      if (result.length === 0) {
        return callback(null, null); // Return null if no lorry found
      }
      callback(null, result[0]); // Return the first result if found
    });
  },
};

module.exports = Lorry;
