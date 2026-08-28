const mysql = require("mysql2/promise");
require("dotenv").config();

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "transport_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Enable SSL if specified in environment (common for cloud MySQL like Aiven, TiDB, AWS RDS)
if (process.env.DB_SSL === "true" || process.env.DB_SSL === "1") {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = mysql.createPool(poolConfig);

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