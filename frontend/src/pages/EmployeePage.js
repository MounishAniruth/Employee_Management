import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Card from "../components/Card";

const EmployeePage = () => {
  const { id } = useParams();
  const [employeeName, setEmployeeName] = useState("");
  const [employeePhone, setEmployeePhone] = useState("");
  const [employeeRole, setEmployeeRole] = useState("driver");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployeesByRole = useCallback(async (role) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/employee/employeesByRole/${id}/${role}`
      );
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, [id]);

  const handleEmployeeClick = async (phone) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/employee/${phone}`
      );
      setSelectedEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      alert("Error fetching employee details");
    }
  };

  const addEmployee = async () => {
    try {
      const newEmployee = {
        name: employeeName,
        phone: employeePhone,
        role: employeeRole,
        fixed_salary: employeeSalary,
        lorry_id: id,
      };
      await axios.post("http://localhost:5001/api/employee/add", newEmployee);
      alert("Employee added successfully");
      fetchEmployeesByRole(employeeRole);
      setFormVisible(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee");
    }
  };

  const handleDeleteEmployee = async (phone) => {
    try {
      await axios.delete(`http://localhost:5001/api/employee/${phone}`);
      alert("Employee deleted successfully");
      fetchEmployeesByRole(employeeRole);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee");
    }
  };

  useEffect(() => {
    fetchEmployeesByRole(employeeRole);
  }, [employeeRole, id, fetchEmployeesByRole]);

  const handleRoleChange = (role) => {
    setEmployeeRole(role);
    fetchEmployeesByRole(role);
  };

  return (
    <Container>
      <Header>
        <LorryTitle>Lorry {id}</LorryTitle>
      </Header>

      <Button onClick={() => setFormVisible(!isFormVisible)}>
        {isFormVisible ? "Cancel" : "Add Employee"}
      </Button>

      {isFormVisible && (
        <Form>
          <Input
            type="text"
            placeholder="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Phone Number"
            value={employeePhone}
            onChange={(e) => setEmployeePhone(e.target.value)}
          />
          <Select
            value={employeeRole}
            onChange={(e) => setEmployeeRole(e.target.value)}
          >
            <option value="driver">Driver</option>
            <option value="driller">Driller</option>
            <option value="manager">Manager</option>
            <option value="worker">Worker</option>
          </Select>
          <Input
            type="number"
            placeholder="Fixed Salary"
            value={employeeSalary}
            onChange={(e) => setEmployeeSalary(e.target.value)}
          />
          <Button onClick={addEmployee}>Add Employee</Button>
        </Form>
      )}

      <EmployeeRoles>
        <RoleTabs>
          <Tab onClick={() => handleRoleChange("driver")}>Drivers</Tab>
          <Tab onClick={() => handleRoleChange("driller")}>Drillers</Tab>
          <Tab onClick={() => handleRoleChange("manager")}>Managers</Tab>
          <Tab onClick={() => handleRoleChange("worker")}>Workers</Tab>
        </RoleTabs>

        <EmployeeList>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeItem
                key={employee.phone}
                onClick={() => handleEmployeeClick(employee.phone)}
              >
                {employee.name} ({employee.phone})
              </EmployeeItem>
            ))
          ) : (
            <EmployeeItem>No employees found for this role.</EmployeeItem>
          )}
        </EmployeeList>
      </EmployeeRoles>

      {selectedEmployee && (
        <EmployeeDetails>
          <h3>
            {selectedEmployee.name} ({selectedEmployee.phone})
          </h3>
          <CardGrid>
            <Card title="Fixed Salary" content={selectedEmployee.fixed_salary} />
            <Card title="Total Earned" content={selectedEmployee.total_earned} />
            <Card title="Expense" content={selectedEmployee.expenses} />
            <Card title="Remaining" content={selectedEmployee.remaining} />
            <Card title="Days Worked" content={selectedEmployee.days_worked} />
          </CardGrid>
          <Button
            onClick={() => handleDeleteEmployee(selectedEmployee.phone)}
          >
            Delete Employee
          </Button>
        </EmployeeDetails>
      )}
    </Container>
  );
};

export default EmployeePage;

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #f4f7fc;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LorryTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
  }
`;

const Form = styled.div`
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const EmployeeRoles = styled.div`
  margin-top: 30px;
`;

const RoleTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  background-color: #f0f0f0;
  border-radius: 5px;
  font-weight: bold;

  &:hover {
    background-color: #ddd;
  }
`;

const EmployeeList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const EmployeeItem = styled.li`
  font-size: 1rem;
  padding: 5px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f9;
  }
`;

const EmployeeDetails = styled.div`
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
`;
