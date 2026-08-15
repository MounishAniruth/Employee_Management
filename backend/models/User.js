const db = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {

  // ==========================================
  // FIND USER BY EMAIL OR PHONE
  // ==========================================

  findByEmailOrPhone: async (identifier) => {

    const isEmail = identifier.includes("@");

    const query = isEmail
      ? "SELECT * FROM users WHERE email = ?"
      : "SELECT * FROM users WHERE phone = ?";

    const [rows] = await db.query(
      query,
      [identifier]
    );

    return rows[0] || null;
  },


  // ==========================================
  // CHECK PHONE
  // ==========================================

  findByPhone: async (phone) => {

    const [rows] = await db.query(
      "SELECT * FROM users WHERE phone = ?",
      [phone]
    );

    return rows[0] || null;
  },


  // ==========================================
  // CHECK EMAIL
  // ==========================================

  findByEmail: async (email) => {

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    return rows[0] || null;
  },


  // ==========================================
  // CREATE USER
  // ==========================================

  create: async ({
    name,
    phone,
    email,
    password,
    userType
  }) => {

    const hashedPassword =
      await bcrypt.hash(password, 10);


    const query = `
      INSERT INTO users
      (
        name,
        phone,
        email,
        password,
        user_type
      )
      VALUES (?, ?, ?, ?, ?)
    `;


    const [result] = await db.query(
      query,
      [
        name,
        phone,
        email,
        hashedPassword,
        userType
      ]
    );


    return result;
  }

};


module.exports = User;