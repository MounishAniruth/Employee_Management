const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const lorryRoutes = require('./routes/lorryRoutes'); // Import lorry routes
const db = require('./config/db'); // MySQL connection pool

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api', lorryRoutes); 

// Example route for testing server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
