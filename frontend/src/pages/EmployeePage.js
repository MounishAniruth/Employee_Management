import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../utils/api";

const EmployeePage = () => {
  const { id } = useParams();

  // =====================================================
  // EMPLOYEE FORM DATA
  // =====================================================

  const [employeeData, setEmployeeData] = useState({
    name: "",
    phone: "",
    role: "driver",
    salary: "",
  });

  // =====================================================
  // EMPLOYEE LIST
  // =====================================================

  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // =====================================================
  // FORM VISIBILITY
  // =====================================================

  const [isFormVisible, setFormVisible] = useState(false);
  const [isUpdateFormVisible, setUpdateFormVisible] =
    useState(false);

  // =====================================================
  // SELECTED EMPLOYEE DETAILS
  // =====================================================

  const [selectedEmployeeDetails, setSelectedEmployeeDetails] =
    useState(null);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // UPDATE EXPENSE FORM
  // =====================================================

  const [updatePhone, setUpdatePhone] = useState("");
  const [updateStartDate, setUpdateStartDate] = useState("");
  const [updateEndDate, setUpdateEndDate] = useState("");
  const [expensePaid, setExpensePaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // =====================================================
  // TABLE / CARD VIEW
  // =====================================================

  const [showTableView, setShowTableView] =
    useState(false);

  // =====================================================
  // FETCH EMPLOYEES BY ROLE
  // =====================================================

  const fetchEmployeesByRole = useCallback(
    async (role) => {
      setLoading(true);

      try {
        console.log(
          "Fetching employees:",
          `lorry_id = ${id}`,
          `role = ${role}`
        );

        const response = await api.get(
          `/employee/employeesByRole/${id}/${role}`
        );

        console.log(
          "Employees received:",
          response.data
        );

        setFilteredEmployees(response.data);
      } catch (error) {
        console.error(
          "Error fetching employees:",
          error
        );

        if (error.response?.status === 401) {
          alert(
            "Session expired. Please login again."
          );

          localStorage.removeItem("authToken");
          localStorage.removeItem("user");

          window.location.href = "/login";
          return;
        }

        alert(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to fetch employees"
        );
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  // =====================================================
  // CALCULATE EMPLOYEE METRICS
  // =====================================================

  const calculateTotalMetrics = (employeeDetails) => {
    if (
      !employeeDetails ||
      !employeeDetails.salaryRecords ||
      employeeDetails.salaryRecords.length === 0
    ) {
      return {
        totalExpense: 0,
        totalDays: 0,
        earnedMoney: 0,
        remainingAmount: 0,
      };
    }

    // Calculate total expenses
    const totalExpense =
      employeeDetails.salaryRecords.reduce(
        (sum, record) =>
          sum +
          parseFloat(record.expense_paid || 0),
        0
      );

    // Calculate total days worked
    const totalDays =
      employeeDetails.salaryRecords.reduce(
        (sum, record) => {
          if (
            !record.start_date ||
            !record.end_date
          ) {
            return sum;
          }

          const start = new Date(
            record.start_date
          );

          const end = new Date(
            record.end_date
          );

          const difference =
            (end - start) /
            (1000 * 60 * 60 * 24);

          return sum + difference;
        },
        0
      );

    // Calculate earned money
    const fixedSalary = Number(
      employeeDetails.fixed_salary || 0
    );

    const earnedMoney =
      (fixedSalary / 30) * totalDays;

    // Calculate remaining amount
    const remainingAmount =
      earnedMoney - totalExpense;

    return {
      totalExpense,
      totalDays,
      earnedMoney,
      remainingAmount,
    };
  };

  // =====================================================
  // FETCH EMPLOYEE DETAILS
  // =====================================================

  const handleEmployeeNameClick = async (phone) => {
    try {
      console.log(
        "Fetching employee details for:",
        phone
      );

      // Fetch employee details
      const employeeResponse = await api.get(
        `/employee/details/${phone}`
      );

      console.log(
        "Employee details:",
        employeeResponse.data
      );

      // Fetch salary records
      const salaryResponse = await api.get(
        `/salary/${phone}`
      );

      console.log(
        "Salary records:",
        salaryResponse.data
      );

      // Make sure salary records are always an array
      const salaryRecords = Array.isArray(
        salaryResponse.data
      )
        ? salaryResponse.data
        : [];

      // Create employee details object
      const employeeDetails = {
        ...employeeResponse.data,
        salaryRecords,
      };

      // Calculate metrics
      const metrics =
        calculateTotalMetrics(
          employeeDetails
        );

      console.log(
        "Calculated metrics:",
        metrics
      );

      // Save complete employee details
      setSelectedEmployeeDetails({
        ...employeeDetails,
        metrics,
      });

    } catch (error) {
      console.error(
        "Error fetching employee details:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to fetch employee details"
      );
    }
  };

  // =====================================================
  // CALCULATE DAYS WORKED
  // =====================================================

  const calculateDaysWorked = (
    startDate,
    endDate
  ) => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const timeDifference =
      end - start;

    return (
      timeDifference /
      (1000 * 3600 * 24)
    );
  };

  // =====================================================
  // UPDATE EMPLOYEE EXPENSE
  // =====================================================

  const handleUpdateEmployee = async () => {
    if (!updatePhone) {
      alert("Please enter employee phone number.");
      return;
    }

    if (!updateStartDate || !updateEndDate) {
      alert(
        "Please select start date and end date."
      );
      return;
    }

    if (
      expensePaid === "" ||
      expensePaid === null
    ) {
      alert("Please enter expense paid.");
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        startDate: updateStartDate,
        endDate: updateEndDate,
        expensePaid: Number(expensePaid),
        expensePaymentMethod: paymentMethod,
      };

      console.log(
        "Payload sent to backend:",
        updateData
      );

      await api.put(
        `/employee/updateExpense/${updatePhone}`,
        updateData
      );

      alert(
        "Employee expense updated successfully!"
      );

      // Close update form
      setUpdateFormVisible(false);

      // Clear update form
      setUpdatePhone("");
      setUpdateStartDate("");
      setUpdateEndDate("");
      setExpensePaid("");
      setPaymentMethod("");

      // Refresh selected employee details
      await handleEmployeeNameClick(
        updatePhone
      );

    } catch (error) {
      console.error(
        "Error updating employee:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update employee."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const deleteEmployee = async (phone) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete employee ${phone}?`
    );

    if (!confirmDelete) {
      return;
    }

    setLoading(true);

    try {
      await api.delete(
        `/employee/delete/${phone}`
      );

      alert(
        "Employee deleted successfully!"
      );

      // Refresh employee list
      await fetchEmployeesByRole(
        employeeData.role
      );

      // Clear selected employee
      setSelectedEmployeeDetails(null);

    } catch (error) {
      console.error(
        "Error deleting employee:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete employee."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ADD EMPLOYEE
  // =====================================================

  const addEmployee = async () => {
    if (
      !employeeData.name ||
      !employeeData.phone ||
      !employeeData.salary
    ) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const newEmployee = {
        lorry_id: Number(id),
        name: employeeData.name,
        phone: employeeData.phone,
        role: employeeData.role,
        fixed_salary: Number(
          employeeData.salary
        ),
      };

      console.log(
        "Adding employee:",
        newEmployee
      );

      await api.post(
        "/employee/add",
        newEmployee
      );

      alert(
        "Employee added successfully!"
      );

      // Refresh list
      await fetchEmployeesByRole(
        employeeData.role
      );

      // Clear form
      setEmployeeData({
        name: "",
        phone: "",
        role: employeeData.role,
        salary: "",
      });

      // Hide form
      setFormVisible(false);

    } catch (error) {
      console.error(
        "Error adding employee:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to add employee."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
  // Clear previously selected employee
  setSelectedEmployeeDetails(null);

  // Return to normal card state
  setShowTableView(false);

  // Close update form
  setUpdateFormVisible(false);

  // Fetch employees for the selected role
  fetchEmployeesByRole(employeeData.role);
}, [
  employeeData.role,
  id,
  fetchEmployeesByRole,
]);

  // =====================================================
  // TOGGLE TABLE / CARD VIEW
  // =====================================================

  const toggleTableView = async (phone) => {
    if (!showTableView) {
      await handleEmployeeNameClick(phone);
    }

    setShowTableView(
      (prev) => !prev
    );
  };

  // =====================================================
  // OPEN UPDATE FORM
  // =====================================================

  const openUpdateForm = (phone) => {
    setUpdatePhone(phone);
    setUpdateFormVisible(true);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Container>

      {/* =================================================
          HEADER
      ================================================= */}

      <Header>
        <LorryTitle>
          Lorry {id}
        </LorryTitle>
      </Header>

      {/* =================================================
          ADD EMPLOYEE BUTTON
      ================================================= */}

      <Button
        onClick={() =>
          setFormVisible(true)
        }
      >
        Add Employee
      </Button>

      {/* =================================================
          ADD EMPLOYEE FORM
      ================================================= */}

      {isFormVisible && (
        <Form>

          <Input
            type="text"
            placeholder="Employee Name"
            value={employeeData.name}
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                name: e.target.value,
              })
            }
          />

          <Input
            type="text"
            placeholder="Phone Number"
            value={employeeData.phone}
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                phone: e.target.value,
              })
            }
          />

          <Select
            value={employeeData.role}
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                role: e.target.value,
              })
            }
          >
            <option value="driver">
              Driver
            </option>

            <option value="driller">
              Driller
            </option>

            <option value="manager">
              Manager
            </option>

            <option value="worker">
              Worker
            </option>
          </Select>

          <Input
            type="number"
            placeholder="Fixed Salary"
            value={employeeData.salary}
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                salary: e.target.value,
              })
            }
          />

          <Button
            onClick={addEmployee}
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Employee"}
          </Button>

          <Button
            onClick={() =>
              setFormVisible(false)
            }
          >
            Cancel
          </Button>

        </Form>
      )}

      {/* =================================================
          UPDATE EXPENSE FORM
      ================================================= */}

      {isUpdateFormVisible && (
        <UpdateForm>

          <Input
            type="text"
            placeholder="Phone Number"
            value={updatePhone}
            onChange={(e) =>
              setUpdatePhone(
                e.target.value
              )
            }
          />

          <Input
            type="date"
            value={updateStartDate}
            onChange={(e) =>
              setUpdateStartDate(
                e.target.value
              )
            }
          />

          <Input
            type="date"
            value={updateEndDate}
            onChange={(e) =>
              setUpdateEndDate(
                e.target.value
              )
            }
          />

          <Input
            type="number"
            placeholder="Expense Paid"
            value={expensePaid}
            onChange={(e) =>
              setExpensePaid(
                e.target.value
              )
            }
          />

          <Select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
          >
            <option value="">
              Select Payment Method
            </option>

            <option value="Phone Pay">
              Phone Pay
            </option>

            <option value="Google Pay">
              Google Pay
            </option>

            <option value="Cash">
              Cash
            </option>

            <option value="Bank">
              Bank
            </option>

            <option value="Office Cash">
              Office Cash
            </option>

            <option value="Site Cash">
              Site Cash
            </option>
          </Select>

          <Button
            onClick={handleUpdateEmployee}
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Employee"}
          </Button>

          <Button
            onClick={() =>
              setUpdateFormVisible(false)
            }
          >
            Cancel
          </Button>

        </UpdateForm>
      )}

      {/* =================================================
          ROLE TABS
      ================================================= */}

      <RoleTabs>
        {["driver", "driller", "manager", "worker"].map(
  (role) => (
    <Tab
      key={role}
      onClick={() => {
        // Change role
        setEmployeeData({
          ...employeeData,
          role,
        });

        // Clear previously selected employee
        setSelectedEmployeeDetails(null);

        // Return to default view
        setShowTableView(false);

        // Close update form
        setUpdateFormVisible(false);
      }}
      $active={employeeData.role === role}
    >
      {role.charAt(0).toUpperCase() +
        role.slice(1)}
    </Tab>
  )
)}
      </RoleTabs>

      {/* =================================================
          EMPLOYEE LIST
      ================================================= */}

      {loading ? (
        <LoadingText>
          Loading...
        </LoadingText>
      ) : (
        <EmployeeList>

          {filteredEmployees.length === 0 ? (
            <NoEmployees>
              No {employeeData.role}s found
              for this lorry.
            </NoEmployees>
          ) : (
            filteredEmployees.map(
              (employee) => (
                <EmployeeItem
                  key={employee.phone}
                >

                  {/* Employee Name */}

                  <EmployeeName
                    onClick={() =>
                      handleEmployeeNameClick(
                        employee.phone
                      )
                    }
                  >
                    {employee.name} (
                    {employee.phone})
                  </EmployeeName>

                  {/* Buttons */}

                  <EmployeeActions>

                    <Button
                      onClick={() =>
                        toggleTableView(
                          employee.phone
                        )
                      }
                    >
                      {showTableView
                        ? "Show Cards"
                        : "Show Table"}
                    </Button>

                    <Button
                      onClick={() =>
                        deleteEmployee(
                          employee.phone
                        )
                      }
                    >
                      Delete
                    </Button>

                    <Button
                      onClick={() =>
                        openUpdateForm(
                          employee.phone
                        )
                      }
                    >
                      Update
                    </Button>

                  </EmployeeActions>

                </EmployeeItem>
              )
            )
          )}

        </EmployeeList>
      )}

      {/* =================================================
          SALARY / EXPENSE TABLE
      ================================================= */}

      {selectedEmployeeDetails &&
        showTableView && (
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

              {selectedEmployeeDetails
                .salaryRecords &&
              selectedEmployeeDetails
                .salaryRecords.length > 0 ? (

                selectedEmployeeDetails.salaryRecords.map(
                  (record, index) => (
                    <tr
                      key={
                        record.id ||
                        `${record.start_date}-${index}`
                      }
                    >

                      <td>
                        {
                          selectedEmployeeDetails.name
                        }
                      </td>

                      <td>
                        {
                          selectedEmployeeDetails.phone
                        }
                      </td>

                      <td>
                        {record.start_date}
                      </td>

                      <td>
                        {record.end_date}
                      </td>

                      <td>
                        ₹
                        {parseFloat(
                          record.expense_paid ||
                            0
                        ).toFixed(2)}
                      </td>

                      <td>
                        {record.expense_payment_method ||
                          "N/A"}
                      </td>

                      <td>
                        {calculateDaysWorked(
                          record.start_date,
                          record.end_date
                        )}
                      </td>

                    </tr>
                  )
                )

              ) : (

                <tr>
                  <td colSpan="7">
                    No salary records found.
                  </td>
                </tr>

              )}

            </tbody>

          </DetailsTable>
        )}

      {/* =================================================
          EMPLOYEE METRICS CARD VIEW
      ================================================= */}

      {selectedEmployeeDetails &&
        !showTableView && (

          <CardContainer>

            <Card>
              Name:{" "}
              {selectedEmployeeDetails.name}
            </Card>

            <Card>
              Phone:{" "}
              {selectedEmployeeDetails.phone}
            </Card>

            <Card>
              Fixed Salary: ₹
              {Number(
                selectedEmployeeDetails.fixed_salary ||
                  0
              ).toFixed(2)}
            </Card>

            <Card>
              Earned Money: ₹
              {Number(
                selectedEmployeeDetails
                  .metrics?.earnedMoney || 0
              ).toFixed(2)}
            </Card>

            <Card>
              Total Expense: ₹
              {Number(
                selectedEmployeeDetails
                  .metrics?.totalExpense || 0
              ).toFixed(2)}
            </Card>

            <Card>
              Remaining Amount: ₹
              {Number(
                selectedEmployeeDetails
                  .metrics?.remainingAmount || 0
              ).toFixed(2)}
            </Card>

            <Card>
              Total Days Worked:{" "}
              {Number(
                selectedEmployeeDetails
                  .metrics?.totalDays || 0
              ).toFixed(2)}
            </Card>

          </CardContainer>
        )}

    </Container>
  );
};

// =====================================================
// STYLED COMPONENTS
// =====================================================

const Container = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  font-family: "Roboto", sans-serif;
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
  box-sizing: border-box;
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
  box-shadow: 0 2px 6px
    rgba(0, 0, 0, 0.1);
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
  flex-wrap: wrap;
`;

const Tab = styled.div`
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  background-color: ${(props) =>
    props.$active
      ? "#007bff"
      : "#e9ecef"};
  color: ${(props) =>
    props.$active
      ? "#ffffff"
      : "#333"};
  border: none;
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.$active
        ? "#0056b3"
        : "#d6d6d6"};
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
  box-shadow: 0 2px 4px
    rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const EmployeeName = styled.div`
  cursor: pointer;
  text-decoration: underline;
  color: blue;
  font-weight: 500;
`;

const EmployeeActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.1rem;
  margin-top: 30px;
`;

const NoEmployees = styled.p`
  text-align: center;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px
    rgba(0, 0, 0, 0.1);
`;

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #ffffff;
  box-shadow: 0 2px 6px
    rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
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

  @media (max-width: 768px) {
    font-size: 0.8rem;

    th,
    td {
      padding: 8px;
    }
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px
    rgba(0, 0, 0, 0.1);
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