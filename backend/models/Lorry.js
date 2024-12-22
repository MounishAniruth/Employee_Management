const connection = require('../config/db');

// Create a table for lorries if it doesn't exist
const createLorryTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS lorries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      registration_number VARCHAR(50) NOT NULL,
      driver_name VARCHAR(100) NOT NULL,
      fuel_capacity INT NOT NULL,
      load_capacity INT NOT NULL
    );
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating lorry table:', err);
      return;
    }
    console.log('Lorry table checked/created');
  });
};

createLorryTable();

// Function to insert a new lorry into the database
const addLorry = (lorryData, callback) => {
  const query = 'INSERT INTO lorries (registration_number, driver_name, fuel_capacity, load_capacity) VALUES (?, ?, ?, ?)';
  connection.query(query, [lorryData.registration_number, lorryData.driver_name, lorryData.fuel_capacity, lorryData.load_capacity], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

// Function to get all lorries from the database
const getAllLorries = (callback) => {
  const query = 'SELECT * FROM lorries';
  connection.query(query, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

module.exports = { addLorry, getAllLorries };
