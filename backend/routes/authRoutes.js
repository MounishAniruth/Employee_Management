const express = require("express");

const router = express.Router();


const {
  signup,
  login
} = require("../controllers/authController");


const {
  signupValidator,
  loginValidator
} = require("../validators/authValidator");


// ==========================================
// SIGNUP
// ==========================================

router.post(
  "/signup",
  signupValidator,
  signup
);


// ==========================================
// LOGIN
// ==========================================

router.post(
  "/login",
  loginValidator,
  login
);


module.exports = router;