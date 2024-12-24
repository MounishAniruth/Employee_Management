import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EmployeePage = () => {
  // Extract the registration number from the route params
  const { registrationNumber } = useParams();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!registrationNumber) {
      console.error('Registration Number is undefined.');
      setError('Registration Number is missing. Please check the URL.');
      return;
    }

    axios
      .get(`http://localhost:5001/api/employees/${registrationNumber}`)
      .then((response) => {
        setEmployees(response.data);
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
        setError('Failed to fetch employee data. Please try again later.');
      });
  }, [registrationNumber]);

  if (error) {
    // Display an error message if something goes wrong
    return <div className="error-message">{error}</div>;
  }

  if (!employees.length) {
    // Show a loading or empty state if there are no employees
    return (
      <div>
        <h1>Employees for Lorry {registrationNumber}</h1>
        <p>No employees found or data is loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Employees for Lorry {registrationNumber}</h1>
      <div className="employee-list">
        {employees.map((employee) => (
          <div className="employee-card" key={employee.id}>
            <h3>{employee.name || 'Unnamed Employee'}</h3>
            <p>Phone: {employee.user_phone}</p>
            <p>Fixed Salary: {employee.fixed_salary}</p>
            <p>Earned Money: {employee.earned_money}</p>
            <p>Remaining Amount: {employee.remaining_amount}</p>
            <p>Days Worked: {employee.days_worked}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeePage;
