const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes'); // Import authRoutes

const app = express();


// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Example route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Use authRoutes for authentication-related routes
app.use('/api/auth', authRoutes);

// Use lorry-related routes
app.use('/api/lorries', lorryRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
