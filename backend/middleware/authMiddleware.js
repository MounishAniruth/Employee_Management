const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  console.log("========== AUTH MIDDLEWARE ==========");

  console.log(
    "Authorization header:",
    req.headers.authorization
  );

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {

    console.log("❌ NO TOKEN");

    return res.status(401).json({
      message: "Access denied. No token provided."
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("✅ JWT decoded:", decoded);

    req.user = {
      id: decoded.id,
      user_type: decoded.user_type,
      name: decoded.name,
    };

    console.log("✅ req.user:", req.user);

    next();

  } catch (err) {

    console.error("❌ JWT verification error:");
    console.error(err.message);

    return res.status(401).json({
      message: "Invalid token.",
      error: err.message
    });
  }
};

module.exports = authMiddleware;