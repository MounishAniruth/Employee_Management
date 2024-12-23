const db = require("../config/db");

const Lorry = {
  // Add a new lorry
  addLorry: (data, callback) => {
    const query = "INSERT INTO lorries (registration_number, owner_phone, model, year_built) VALUES (?, ?, ?, ?)";
    db.query(query, [data.registration_number, data.owner_phone, data.model, data.year_built], callback);
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
};

module.exports = Lorry;
