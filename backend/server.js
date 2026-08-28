const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
require("dotenv").config();


const authRoutes = require('./routes/authRoutes');
const lorryRoutes = require('./routes/lorryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const pointRoutes = require('./routes/pointRoutes');
const fuelRoutes = require("./routes/fuelRoutes");
dotenv.config();

const app = express();

// Middleware

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-netlify-site.netlify.app", // replace with your actual Netlify site URL
  "https://sri-murugan-transport.netlify.app", // fallback / common placeholder
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      // Allow listed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow Netlify preview deployments (origin contains .netlify.app and ends with -preview)
      if (origin.includes(".netlify.app") && origin.includes("-preview")) {
        return callback(null, true);
      }
      // Deny others
      console.warn("🚫 Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);
app.use(bodyParser.json());

// Define API routes with appropriate prefixes
app.use('/api/auth', authRoutes);
app.use('/api/lorry', lorryRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/salary', salaryRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/point", pointRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running smoothly!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
