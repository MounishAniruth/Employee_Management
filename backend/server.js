const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const lorryRoutes = require('./routes/lorryRoutes');
const employeeRoutes = require('./routes/employeeRoutes'); 
const salaryRoutes = require('./routes/salaryRoutes');      

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define API routes with appropriate prefixes
app.use('/api/auth', authRoutes);           // Authentication routes
app.use('/api/lorry', lorryRoutes);         // Lorry routes
app.use('/api/employee', employeeRoutes);   // Employee management routes
app.use('/api/salary', salaryRoutes);       // Salary management routes

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
