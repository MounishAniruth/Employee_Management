import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const EmployeePage = () => {
  const { id }  = useParams();
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
  const [paymentMethod, setPaymentMethod] = useState(""); 

  // New state to handle toggling between table and card view
  const [showTableView, setShowTableView] = useState(false); 

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

  const handleEmployeeNameClick = async (phone) => {
    try {
      const employeeResponse = await axios.get(
        `http://localhost:5001/api/employee/details/${phone}`
      );
      
      const salaryResponse = await axios.get(
        `http://localhost:5001/api/salary/${phone}`
      );
  
      const employeeDetails = {
        ...employeeResponse.data,
        salaryRecords: salaryResponse.data,
      };
  
      // Calculate total metrics
      const totalMetrics = calculateTotalMetrics(employeeDetails);
      
      setSelectedEmployeeDetails({
        ...employeeDetails,
        metrics: totalMetrics,
      });
    } catch (err) {
      console.error("Error fetching employee details:", err);
      alert("Error fetching employee details");
    }
  };

  const calculateTotalMetrics = (employeeDetails) => {
    if (!employeeDetails.salaryRecords || employeeDetails.salaryRecords.length === 0) {
      return {
        totalExpense: 0,
        totalDays: 0,
        earnedMoney: 0,
        remainingAmount: 0,
      };
    }

    const totalExpense = employeeDetails.salaryRecords.reduce(
      (sum, record) => sum + parseFloat(record.expense_paid || 0),
      0
    );

    const totalDays = employeeDetails.salaryRecords.reduce((sum, record) => {
      const start = new Date(record.start_date);
      const end = new Date(record.end_date);
      return sum + (end - start) / (1000 * 60 * 60 * 24);
    }, 0);

    const earnedMoney = (employeeDetails.fixed_salary / 30) * totalDays;
    const remainingAmount = earnedMoney - totalExpense;

    return {
      totalExpense,
      totalDays,
      earnedMoney,
      remainingAmount,
    };
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
        expensePaid: expensePaid, 
        expensePaymentMethod: paymentMethod,  
      };
  
      console.log('Payload sent to backend:', updateData); // Debugging log
  
      await axios.put(
        `http://localhost:5001/api/employee/updateExpense/${updatePhone}`,
        updateData
      );
  
      alert("Employee expense updated successfully!");
      setUpdateFormVisible(false);
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

  // Toggle the view between table and card view
  const toggleTableView = () => {
    setShowTableView(!showTableView);
  };

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
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Phone Pay">Phone Pay</option>
            <option value="Google Pay">Google Pay</option>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
            <option value="Office Cash">Office Cash</option>
            <option value="Site Cash">Site Cash</option>
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
              <div
                onClick={() => handleEmployeeNameClick(employee.phone)}
                style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
              >
                {employee.name} ({employee.phone})
              </div>
              <div>
                <Button onClick={toggleTableView}>
                  {showTableView ? "Show Cards" : "Show Table"}
                </Button>
                <Button onClick={() => deleteEmployee(employee.phone)}>
                  Delete
                </Button>
                <Button onClick={() => setUpdateFormVisible(true)}>Update</Button>
              </div>
            </EmployeeItem>
          ))}
        </EmployeeList>
      )}

{selectedEmployeeDetails && showTableView && (
  <DetailsTable>
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Expense</th>
        <th>Payment Method</th>
        <th>Days Worked</th>
      </tr>
    </thead>
    <tbody>
      {selectedEmployeeDetails.salaryRecords.map((record) => (
        <tr key={record.start_date}>
          <td>{selectedEmployeeDetails.name}</td>
          <td>{selectedEmployeeDetails.phone}</td>
          <td>{record.start_date}</td>
          <td>{record.end_date}</td>
          <td>{record.expense_paid}</td>
          <td>{record.expense_payment_method}</td>
          <td>
            {calculateDaysWorked(record.start_date, record.end_date)}
          </td>
        </tr>
      ))}
    </tbody>
  </DetailsTable>
)}


      {selectedEmployeeDetails && !showTableView && (
        <CardContainer>
          <Card>Name: {selectedEmployeeDetails.name}</Card>
          <Card>Phone: {selectedEmployeeDetails.phone}</Card>
          <Card>Fixed Salary: ₹{selectedEmployeeDetails.fixed_salary}</Card>
          <Card>Earned Money: ₹{selectedEmployeeDetails.metrics.earnedMoney}</Card>
          <Card>Total Expense: ₹{selectedEmployeeDetails.metrics.totalExpense}</Card>
          <Card>Remaining Amount: ₹{selectedEmployeeDetails.metrics.remainingAmount}</Card>
          <Card>Total Days Worked: {selectedEmployeeDetails.metrics.totalDays}</Card>
        </CardContainer>
      )}

    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
  color: #333;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LorryTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #007bff;
`;

const Button = styled.button`
  padding: 12px 20px;
  margin: 10px;
  font-size: 0.9rem;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 12px;
  margin: 5px;
  font-size: 1rem;
  border: 1px solid #cccccc;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
`;

const Select = styled.select`
  padding: 12px;
  margin: 5px;
  font-size: 1rem;
  border: 1px solid #cccccc;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 100%;
  max-width: 500px;
`;

const UpdateForm = styled(Form)``;

const RoleTabs = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  background-color: ${(props) => (props.$active ? "#007bff" : "#e9ecef")};
  color: ${(props) => (props.$active ? "#ffffff" : "#333")};
  border: none;
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => (props.$active ? "#0056b3" : "#d6d6d6")};
  }
`;

const EmployeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const EmployeeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
  }

  th {
    background-color: #007bff;
    color: #ffffff;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
  `;

  const Card = styled.div`
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    background-color: white;
    font-size: 1rem;
    font-weight: bold;
  `;

export {
  Container,
  Header,
  LorryTitle,
  Button,
  Input,
  Select,
  Form,
  UpdateForm,
  RoleTabs,
  Tab,
  EmployeeList,
  EmployeeItem,
  DetailsTable,
  CardContainer,
};


export default EmployeePage;
