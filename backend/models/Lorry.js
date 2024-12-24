const db = require("../config/db");

const Lorry = {
  // Add a new lorry
  addLorry: (data, callback) => {
    const query =
      "INSERT INTO lorries (registration_number, owner_phone, model, year_built, owner_name) VALUES (?, ?, ?, ?, ?)";
      console.log("Query Parameters:", {
        registration_number: data.registration_number,
        owner_phone: data.owner_phone,
        model: data.model,
        year_built: data.year_built,
        owner_name: data.owner_name, 
      });

    db.query(
      query,
      [
        data.registration_number,
        data.owner_phone,
        data.model,
        data.year_built,
        data.owner_name,
      ],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err); // Log any database errors
        }
        callback(err, result); // Proceed with the callback
      }
    );
  },

  // Get all lorries
  findAll: (callback) => {
    const query = "SELECT * FROM lorries";
    db.query(query, callback);
  },

  // Delete a lorry by registration number
  deleteLorry: (registrationNumber, callback) => {
    const query = "DELETE FROM lorries WHERE registration_number = ?";
    db.query(query, [registrationNumber], callback);
  },

  // Find a lorry by registration number
  findByRegistrationNumber: (registrationNumber, callback) => {
    const query = "SELECT * FROM lorries WHERE registration_number = ?";
    db.query(query, [registrationNumber], (err, result) => {
      callback(err, result[0]); // Return the first result if found
    });
  },
};

module.exports = Lorry;
