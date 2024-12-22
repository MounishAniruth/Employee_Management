const db = require("../config/db");

const User = {
  create: (data, callback) => {
    const query = "INSERT INTO users (name, email, phone, password, user_type) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [data.name, data.email, data.phone, data.password, data.userType], callback);
  },
  findByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
  },
};

module.exports = User;
