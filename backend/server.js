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

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, localhost, any .netlify.app domain, or configured FRONTEND_URL
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".netlify.app") ||
        origin === process.env.FRONTEND_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// Explicitly handle preflight requests
app.options("*", cors());

app.use(bodyParser.json());

// Define API routes with appropriate prefixes
app.use('/api/auth', authRoutes);
app.use('/api/lorry', lorryRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/point', pointRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Sri Murugan Rig Service API is running successfully!',
    timestamp: new Date().toISOString()
  });
});

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
