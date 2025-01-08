import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const EmployeePage = () => {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState({
    name: "",
    phone: "",
    role: "driver",
    salary: "",
  });
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // New state variables for the update form
  const [updatePhone, setUpdatePhone] = useState(""); // For displaying the phone number in the update form
  const [updateStartDate, setUpdateStartDate] = useState("");
  const [updateEndDate, setUpdateEndDate] = useState("");
  const [expensePaid, setExpensePaid] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");

  const fetchEmployeesByRole = useCallback(
    async (role) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5001/api/employee/employeesByRole/${id}/${role}`
        );
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  const handleEmployeeClick = async (phone) => {
    try {
      const employeeResponse = await axios.get(
        `http://localhost:5001/api/employee/details/${phone}`
      );
      console.log("Employee details:", employeeResponse.data);

      const salaryResponse = await axios.get(
        `http://localhost:5001/api/salary/${phone}`
      );
      console.log("Salary records:", salaryResponse.data);

      // Combine employee details and salary records
      const employeeDetails = {
        ...employeeResponse.data,
        salaryRecords: salaryResponse.data,
      };

      setSelectedEmployeeDetails(employeeDetails);
    } catch (err) {
      console.error("Error fetching employee details:", err);
      alert("Error fetching employee details");
    }
  };

  const calculateDaysWorked = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    return timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
  };

  const handleUpdateEmployee = async () => {
    try {
      const updateData = {
        startDate: updateStartDate,
        endDate: updateEndDate,
        expense: expensePaid,
      };

      // Ensure the correct endpoint is being used
      await axios.put(
        `http://localhost:5001/api/employee/updateExpense/${updatePhone}`,
        updateData
      );

      alert("Employee expense updated successfully!");
      setUpdateFormVisible(false); // Hide the form after successful update
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
    }
  };

  const deleteEmployee = async (phone) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5001/api/employee/delete/${phone}`);
      alert("Employee deleted successfully!");
      fetchEmployeesByRole(employeeData.role); // Refresh the list
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee.");
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    if (!employeeData.name || !employeeData.phone || !employeeData.salary) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const newEmployee = {
        lorry_id: id,
        name: employeeData.name,
        phone: employeeData.phone,
        role: employeeData.role,
        fixed_salary: Number(employeeData.salary),
      };
      await axios.post(`http://localhost:5001/api/employee/add`, newEmployee);
      alert("Employee added successfully!");
      fetchEmployeesByRole(employeeData.role); // Refresh the list
      setFormVisible(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesByRole(employeeData.role);
  }, [employeeData.role, id, fetchEmployeesByRole]);

  return (
    <Container>
      <Header>
        <LorryTitle>Lorry {id}</LorryTitle>
      </Header>

      <Button onClick={() => setFormVisible(true)}>Add Employee</Button>

      {isFormVisible && (
        <Form>
          <Input
            type="text"
            placeholder="Employee Name"
            value={employeeData.name}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, name: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Phone Number"
            value={employeeData.phone}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, phone: e.target.value })
            }
          />
          <Select
            value={employeeData.role}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, role: e.target.value })
            }
          >
            <option value="driver">Driver</option>
            <option value="driller">Driller</option>
            <option value="manager">Manager</option>
            <option value="worker">Worker</option>
          </Select>
          <Input
            type="number"
            placeholder="Fixed Salary"
            value={employeeData.salary}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, salary: e.target.value })
            }
          />
          <Button onClick={addEmployee} disabled={loading}>
            {loading ? "Adding..." : "Add Employee"}
          </Button>
          <Button onClick={() => setFormVisible(false)}>Cancel</Button>
        </Form>
      )}

      {isUpdateFormVisible && (
        <UpdateForm>
          <Input
            type="text"
            placeholder="Phone Number"
            value={updatePhone}
            onChange={(e) => setUpdatePhone(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Start Date"
            value={updateStartDate}
            onChange={(e) => setUpdateStartDate(e.target.value)}
          />
          <Input
            type="date"
            placeholder="End Date"
            value={updateEndDate}
            onChange={(e) => setUpdateEndDate(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Expense Paid"
            value={expensePaid}
            onChange={(e) => setExpensePaid(e.target.value)}
          />
          <Select
            value={employeeRole}
            onChange={(e) => setEmployeeRole(e.target.value)}
          >
            <option value="driver">Driver</option>
            <option value="helper">Helper</option>
          </Select>
          <Button onClick={handleUpdateEmployee} disabled={loading}>
            {loading ? "Updating..." : "Update Employee"}
          </Button>
          <Button onClick={() => setUpdateFormVisible(false)}>Cancel</Button>
        </UpdateForm>
      )}

      <RoleTabs>
        {["driver", "driller", "manager", "worker"].map((role) => (
          <Tab
            key={role}
            onClick={() => setEmployeeData({ ...employeeData, role })}
            $active={employeeData.role === role}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Tab>
        ))}
      </RoleTabs>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <EmployeeList>
          {filteredEmployees.map((employee) => (
            <EmployeeItem key={employee.phone}>
              <div onClick={() => handleEmployeeClick(employee.phone)}>
                {employee.name} ({employee.phone})
              </div>
              <Button onClick={() => handleEmployeeClick(employee.phone)}>
                Details
              </Button>
              <Button onClick={() => deleteEmployee(employee.phone)}>
                Delete
              </Button>
              <Button onClick={() => setUpdateFormVisible(true)}>Update</Button>
            </EmployeeItem>
          ))}
        </EmployeeList>
      )}

{selectedEmployeeDetails && (
  <DetailsTable>
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Expense</th>
        <th>Days Worked</th> 
      </tr>
    </thead>
    <tbody>
      {selectedEmployeeDetails.salaryRecords &&
      selectedEmployeeDetails.salaryRecords.length > 0 ? (
        selectedEmployeeDetails.salaryRecords.map((record, index) => {
          const daysWorked = calculateDaysWorked(
            record.start_date,
            record.end_date
          );
          return (
            <tr key={index}>
              <td>{selectedEmployeeDetails.name}</td>
              <td>{selectedEmployeeDetails.phone}</td>
              <td>{record.start_date}</td>
              <td>{record.end_date}</td>
              <td>{record.expense_paid}</td>
              <td>{daysWorked} days</td> 
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="6">No salary records available</td>
        </tr>
      )}
    </tbody>
  </DetailsTable>
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
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const RoleTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? "#4caf50" : "#ccc")};
  color: white;
  border-radius: 5px;
`;

const EmployeeList = styled.div`
  margin-top: 20px;
`;

const EmployeeItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  button {
    margin-left: 10px;
  }
`;

const UpdateForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const DetailsTable = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f7fc;
  }
`;
