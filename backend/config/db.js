const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the MySQL database");
    connection.release();
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;