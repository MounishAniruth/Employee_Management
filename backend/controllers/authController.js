const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken =
  require("../utils/generateToken");


// ==========================================
// SIGNUP
// ==========================================

const signup = async (req, res) => {

  try {

    const {
      name,
      phone,
      email,
      password,
      userType
    } = req.body;


    // --------------------------------------
    // CHECK PHONE
    // --------------------------------------

    const existingPhone =
      await User.findByPhone(phone);


    if (existingPhone) {

      return res.status(400).json({

        message:
          "Phone number already in use"

      });

    }


    // --------------------------------------
    // CHECK EMAIL
    // --------------------------------------

    const existingEmail =
      await User.findByEmail(email);


    if (existingEmail) {

      return res.status(400).json({

        message:
          "Email already in use"

      });

    }


    // --------------------------------------
    // CREATE USER
    // --------------------------------------

    const result =
      await User.create({

        name,
        phone,
        email,
        password,
        userType

      });


    console.log(
      "User created with ID:",
      result.insertId
    );


    return res.status(201).json({

      message:
        "User created successfully",

      userId:
        result.insertId

    });


  } catch (error) {

    console.error(
      "Signup error:",
      error
    );


    return res.status(500).json({

      message:
        "Error creating user",

      error:
        error.message

    });

  }

};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {

  try {

    const {
      identifier,
      password
    } = req.body;


    // --------------------------------------
    // FIND USER
    // --------------------------------------

    const user =
      await User.findByEmailOrPhone(
        identifier
      );


    if (!user) {

      return res.status(400).json({

        message:
          "Invalid email/phone or password"

      });

    }


    // --------------------------------------
    // CHECK PASSWORD
    // --------------------------------------

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!isMatch) {

      return res.status(400).json({

        message:
          "Invalid email/phone or password"

      });

    }


    // --------------------------------------
    // GENERATE JWT
    // --------------------------------------

    const token =
      generateToken(user);


    // --------------------------------------
    // SEND RESPONSE
    // --------------------------------------

    return res.status(200).json({

      message:
        "Login successful",

      token,

      user: {

        id:
          user.id,

        name:
          user.name,

        phone:
          user.phone,

        email:
          user.email,

        user_type:
          user.user_type

      }

    });


  } catch (error) {

    console.error(
      "Login error:",
      error
    );


    return res.status(500).json({

      message:
        "Login failed",

      error:
        error.message

    });

  }

};


module.exports = {
  signup,
  login
};