const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// =========================
// SIGNUP
// =========================
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      userType
    } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !password || !userType) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if phone already exists
    const [phoneRows] = await db.query(
      "SELECT * FROM users WHERE phone = ?",
      [phone]
    );

    if (phoneRows.length > 0) {
      return res.status(400).json({
        message: "Phone number already in use"
      });
    }

    // Check if email already exists
    const [emailRows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (emailRows.length > 0) {
      return res.status(400).json({
        message: "Email already in use"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users
       (name, phone, email, password, user_type)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        phone,
        email,
        hashedPassword,
        userType
      ]
    );

    console.log("User created with ID:", result.insertId);

    return res.status(201).json({
      message: "User created successfully",
      userId: result.insertId
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
});


// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const {
      identifier,
      password
    } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/phone and password are required"
      });
    }

    // Determine whether identifier is email or phone
    const isEmail = identifier.includes("@");

    const query = isEmail
      ? "SELECT * FROM users WHERE email = ?"
      : "SELECT * FROM users WHERE phone = ?";

    const [rows] = await db.query(query, [identifier]);

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid email/phone or password"
      });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email/phone or password"
      });
    }

    // Generate JWT
    const token = jwt.sign(
  {
    id: user.id,
    user_type: user.user_type,
    name: user.name,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h",
  }
);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        user_type: user.user_type
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

module.exports = router;