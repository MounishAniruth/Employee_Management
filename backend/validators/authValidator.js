const { body } = require("express-validator");

const signupValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits"),

  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("userType")
    .notEmpty()
    .withMessage("User type is required"),
];

const loginValidator = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or phone is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  signupValidator,
  loginValidator,
};