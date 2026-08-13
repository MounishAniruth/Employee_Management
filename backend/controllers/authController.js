const express = require("express");

const router = express.Router();

const {
  signup,
  login,
} = require("../controllers/authController");

const {
  signupValidator,
  loginValidator,
} = require("../validators/authValidator");

router.post(
  "/signup",
  signupValidator,
  signup
);

router.post(
  "/login",
  loginValidator,
  login
);

module.exports = router;