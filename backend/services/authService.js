const bcrypt = require("bcryptjs");
const db = require("../config/db");

const findUserByEmailOrPhone = async (identifier) => {
  const isEmail = identifier.includes("@");

  const query = isEmail
    ? "SELECT * FROM users WHERE email = ?"
    : "SELECT * FROM users WHERE phone = ?";

  const [rows] = await db.query(query, [identifier]);

  return rows[0];
};

const createUser = async ({
  name,
  phone,
  email,
  password,
  userType,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users
    (name, phone, email, password, user_type)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    name,
    phone,
    email,
    hashedPassword,
    userType,
  ]);

  return result;
};

module.exports = {
  findUserByEmailOrPhone,
  createUser,
};