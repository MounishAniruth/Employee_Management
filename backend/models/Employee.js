const db = require('../config/db');

const Employee = {
  // Create a new employee record
  createEmployee: (lorryId, name, role, fixedSalary, salaryPerDay, callback) => {
    const query = 'INSERT INTO Employees (lorry_id, name, role, fixed_salary, salary_per_day) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [lorryId, name, role, fixedSalary, salaryPerDay], (err, results) => {
      if (err) {
        console.error('Error creating employee:', err);
        return callback(err);
      }
      callback(null, results);
    });
  },

  // Get all employees for a particular lorry by its registration number
  getEmployeesByLorry: (registrationNumber, callback) => {
    const query = `
      SELECT e.*, l.registration_number
      FROM Employees e
      JOIN Lorries l ON e.lorry_id = l.id
      WHERE l.registration_number = ?
    `;
    db.execute(query, [registrationNumber], (err, results) => {
      if (err) {
        console.error('Error fetching employees:', err);
        return callback(err);
      }
      callback(null, results);
    });
  },

  // Update employee salary or details
  updateEmployeeSalary: (employeeId, newSalary, callback) => {
    const query = 'UPDATE Employees SET fixed_salary = ? WHERE id = ?';
    db.execute(query, [newSalary, employeeId], (err, results) => {
      if (err) {
        console.error('Error updating employee salary:', err);
        return callback(err);
      }
      callback(null, results);
    });
  },

  // Delete an employee record
  deleteEmployee: (employeeId, callback) => {
    const query = 'DELETE FROM Employees WHERE id = ?';
    db.execute(query, [employeeId], (err, results) => {
      if (err) {
        console.error('Error deleting employee:', err);
        return callback(err);
      }
      callback(null, results);
    });
  },

  // Get a specific employee by their ID
  getEmployeeById: (employeeId, callback) => {
    const query = 'SELECT * FROM Employees WHERE id = ?';
    db.execute(query, [employeeId], (err, results) => {
      if (err) {
        console.error('Error fetching employee by ID:', err);
        return callback(err);
      }
      callback(null, results);
    });
  },
};

module.exports = Employee;
