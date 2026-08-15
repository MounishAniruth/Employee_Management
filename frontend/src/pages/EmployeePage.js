import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import axios from "axios";

import { useParams } from "react-router-dom";

import styled from "styled-components";


// =====================================================
// API CONFIGURATION
// =====================================================

const API_BASE_URL =
  "http://localhost:5001/api";


// =====================================================
// GET TOKEN
// =====================================================

const getToken = () => {

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );

};


// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({

  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json"
  }

});


// =====================================================
// ADD JWT TOKEN TO EVERY REQUEST
// =====================================================

api.interceptors.request.use(
  (config) => {

    const token =
      getToken();

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }
);


// =====================================================
// EMPLOYEE PAGE
// =====================================================

const EmployeePage = () => {

  const { id } = useParams();


  // =====================================================
  // ROLES
  // =====================================================

  const roles = [
    "driver",
    "driller",
    "worker",
    "lorry_manager"
  ];


  // =====================================================
  // ROLE LABELS
  // =====================================================

  const roleLabels = {

    driver: "🚚 Driver",

    driller: "⚙️ Driller",

    worker: "👷 Worker",

    lorry_manager: "👨‍💼 Lorry Manager"

  };


  // =====================================================
  // SELECTED ROLE
  // =====================================================

  const [
    selectedRole,
    setSelectedRole
  ] = useState("driver");


  // =====================================================
  // EMPLOYEES
  // =====================================================

  const [
    employees,
    setEmployees
  ] = useState([]);


  // =====================================================
  // SELECTED EMPLOYEE
  // =====================================================

  const [
    selectedEmployee,
    setSelectedEmployee
  ] = useState(null);


  const [
    selectedPhone,
    setSelectedPhone
  ] = useState(null);


  // =====================================================
  // VIEW MODE
  // =====================================================

  const [
    viewMode,
    setViewMode
  ] = useState("none");


  // =====================================================
  // LOADING
  // =====================================================

  const [
    loading,
    setLoading
  ] = useState(false);


  // =====================================================
  // ADD EMPLOYEE MODAL
  // =====================================================

  const [
    showAddForm,
    setShowAddForm
  ] = useState(false);


  const [
    employeeData,
    setEmployeeData
  ] = useState({

    name: "",

    phone: "",

    role: "driver",

    salary: ""

  });


  // =====================================================
  // EXPENSE MODAL
  // =====================================================

  const [
    showExpenseForm,
    setShowExpenseForm
  ] = useState(false);


  const [
    updatePhone,
    setUpdatePhone
  ] = useState("");


  const [
    updateStartDate,
    setUpdateStartDate
  ] = useState("");


  const [
    updateEndDate,
    setUpdateEndDate
  ] = useState("");


  const [
    expensePaid,
    setExpensePaid
  ] = useState("");


  const [
    paymentMethod,
    setPaymentMethod
  ] = useState("");


  // =====================================================
  // FIXED SALARY MODAL
  // =====================================================

  const [
    showSalaryForm,
    setShowSalaryForm
  ] = useState(false);


  const [
    salaryEmployee,
    setSalaryEmployee
  ] = useState(null);


  const [
    newSalary,
    setNewSalary
  ] = useState("");


  const [
    salaryEffectiveFrom,
    setSalaryEffectiveFrom
  ] = useState("");


  // =====================================================
  // SALARY HISTORY
  // =====================================================

  const [
    salaryHistory,
    setSalaryHistory
  ] = useState([]);


  const [
    salaryHistoryLoading,
    setSalaryHistoryLoading
  ] = useState(false);


  // =====================================================
  // USER TYPE
  // =====================================================

  const getUserType = () => {

    const directUserType =
      localStorage.getItem("userType");

    if (directUserType) {

      return directUserType;

    }


    try {

      const user =
        JSON.parse(
          localStorage.getItem("user") ||
          "{}"
        );

      return user.user_type || "";

    } catch {

      return "";

    }

  };


  const userType =
    getUserType();


  const isOwner =
    userType === "owner";
      // =====================================================
  // UNAUTHORIZED HANDLER
  // =====================================================

  const handleUnauthorized = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("authToken");

    localStorage.removeItem("user");

    localStorage.removeItem("userId");

    localStorage.removeItem("userType");

    localStorage.removeItem("userName");

    window.location.href = "/login";

  };


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,

        maximumFractionDigits: 2
      }
    );

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {

    if (!value) {

      return "N/A";

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",

        month: "short",

        year: "numeric"
      }
    );

  };


  // =====================================================
  // CALCULATE DAYS
  // =====================================================

  const calculateDays = (
    startDate,
    endDate
  ) => {

    if (
      !startDate ||
      !endDate
    ) {

      return 0;

    }


    const start =
      new Date(startDate);


    const end =
      new Date(endDate);


    const difference =
      (
        end - start
      ) /
      (
        1000 *
        60 *
        60 *
        24
      );


    return (
      difference + 1
    );

  };


  // =====================================================
  // CALCULATE EMPLOYEE METRICS
  // =====================================================

  const calculateMetrics = (
    employee
  ) => {

    const records =
      Array.isArray(
        employee?.salaryRecords
      )
        ? employee.salaryRecords
        : [];


    const totalExpense =
      records.reduce(
        (
          total,
          record
        ) => {

          return (
            total +
            Number(
              record.expense_paid || 0
            )
          );

        },
        0
      );


    const totalDays =
      records.reduce(
        (
          total,
          record
        ) => {

          if (
            record.days_worked !==
            null &&
            record.days_worked !==
            undefined
          ) {

            return (
              total +
              Number(
                record.days_worked
              )
            );

          }


          return (
            total +
            calculateDays(
              record.start_date,
              record.end_date
            )
          );

        },
        0
      );


    const fixedSalary =
      Number(
        employee?.fixed_salary ||
        0
      );


    const earnedAmount =
      (
        fixedSalary / 30
      ) *
      totalDays;


    const remainingAmount =
      earnedAmount -
      totalExpense;


    return {

      totalExpense,

      totalDays,

      fixedSalary,

      earnedAmount,

      remainingAmount

    };

  };


  // =====================================================
  // FETCH EMPLOYEES BY ROLE
  // =====================================================

  const fetchEmployeesByRole =
    useCallback(
      async (role) => {

        setLoading(true);


        try {

          const response =
            await api.get(
              `/employee/employeesByRole/${id}/${role}`
            );


          setEmployees(
            Array.isArray(
              response.data
            )
              ? response.data
              : []
          );


        } catch (error) {

          console.error(
            "Error fetching employees:",
            error
          );


          if (
            error.response?.status === 401
          ) {

            handleUnauthorized();

            return;

          }


          alert(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch employees."
          );


          setEmployees([]);

        } finally {

          setLoading(false);

        }

      },
      [id]
    );


  // =====================================================
  // FETCH EMPLOYEE DETAILS
  // =====================================================

  const fetchEmployeeDetails =
    async (phone) => {

      try {

        setLoading(true);


        // =============================================
        // EMPLOYEE DETAILS
        // =============================================

        const employeeResponse =
          await api.get(
            `/employee/details/${phone}`
          );


        let salaryRecords = [];


        // =============================================
        // EXPENSE / SALARY RECORDS
        // =============================================

        try {

          const salaryResponse =
            await api.get(
              `/salary/salaryDetails/${phone}`
            );


          if (
            Array.isArray(
              salaryResponse.data
            )
          ) {

            salaryRecords =
              salaryResponse.data;

          } else if (
            Array.isArray(
              salaryResponse.data?.records
            )
          ) {

            salaryRecords =
              salaryResponse.data.records;

          } else if (
            Array.isArray(
              salaryResponse.data?.data
            )
          ) {

            salaryRecords =
              salaryResponse.data.data;

          }

        } catch (salaryError) {

          console.warn(
            "Salary records could not be loaded:",
            salaryError
          );


          if (
            salaryError.response?.status === 401
          ) {

            handleUnauthorized();

            return null;

          }

        }


        // =============================================
        // FIXED SALARY HISTORY
        // =============================================

        let fixedSalaryHistory = [];


        try {

          const historyResponse =
            await api.get(
              `/salary/fixed/history/${employeeResponse.data.id}`
            );


          if (
            Array.isArray(
              historyResponse.data
            )
          ) {

            fixedSalaryHistory =
              historyResponse.data;

          } else if (
            Array.isArray(
              historyResponse.data?.history
            )
          ) {

            fixedSalaryHistory =
              historyResponse.data.history;

          } else if (
            Array.isArray(
              historyResponse.data?.data
            )
          ) {

            fixedSalaryHistory =
              historyResponse.data.data;

          }

        } catch (historyError) {

          console.warn(
            "Fixed salary history could not be loaded:",
            historyError
          );


          if (
            historyError.response?.status === 401
          ) {

            handleUnauthorized();

            return null;

          }

        }


        // =============================================
        // COMBINE EVERYTHING
        // =============================================

        const employee = {

          ...employeeResponse.data,

          salaryRecords,

          fixedSalaryHistory

        };


        employee.metrics =
          calculateMetrics(
            employee
          );


        setSelectedEmployee(
          employee
        );


        setSalaryHistory(
          fixedSalaryHistory
        );


        setSelectedPhone(
          phone
        );


        return employee;


      } catch (error) {

        console.error(
          "Error fetching employee details:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          handleUnauthorized();

          return null;

        }


        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch employee details."
        );


        return null;


      } finally {

        setLoading(false);

      }

    };
      // =====================================================
  // SHOW EMPLOYEE
  // =====================================================

  const handleViewEmployee =
    async (employee) => {

      if (
        selectedPhone !==
        employee.phone
      ) {

        const result =
          await fetchEmployeeDetails(
            employee.phone
          );


        if (!result) {

          return;

        }


        setViewMode(
          "table"
        );

        return;

      }


      if (
        viewMode === "none"
      ) {

        setViewMode(
          "table"
        );

        return;

      }


      if (
        viewMode === "table"
      ) {

        setViewMode(
          "cards"
        );

        return;

      }


      setViewMode(
        "table"
      );

    };


  // =====================================================
  // CHANGE ROLE
  // =====================================================

  const changeRole =
    (role) => {

      setSelectedRole(
        role
      );


      setEmployeeData(
        previous => ({

          ...previous,

          role

        })
      );


      setSelectedEmployee(
        null
      );


      setSelectedPhone(
        null
      );


      setViewMode(
        "none"
      );

    };


  // =====================================================
  // ADD EMPLOYEE
  // =====================================================

  const addEmployee =
    async () => {

      if (
        !employeeData.name.trim()
      ) {

        alert(
          "Please enter employee name."
        );

        return;

      }


      if (
        !employeeData.phone.trim()
      ) {

        alert(
          "Please enter employee phone."
        );

        return;

      }


      if (
        employeeData.phone.trim().length <
        10
      ) {

        alert(
          "Please enter a valid phone number."
        );

        return;

      }


      try {

        setLoading(true);


        const data = {

          lorry_id:
            Number(id),

          user_id:
            null,

          name:
            employeeData.name.trim(),

          phone:
            employeeData.phone.trim(),

          role:
            employeeData.role,

          fixed_salary:
            employeeData.salary === ""
              ? 0
              : Number(
                  employeeData.salary
                )

        };


        await api.post(
          "/employee/add",
          data
        );


        alert(
          "Employee added successfully."
        );


        setEmployeeData({

          name: "",

          phone: "",

          role: selectedRole,

          salary: ""

        });


        setShowAddForm(
          false
        );


        await fetchEmployeesByRole(
          selectedRole
        );


      } catch (error) {

        console.error(
          "Error adding employee:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          handleUnauthorized();

          return;

        }


        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add employee."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const deleteEmployee =
    async (employee) => {

      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${employee.name}?`
        );


      if (!confirmed) {

        return;

      }


      try {

        setLoading(true);


        await api.delete(
          `/employee/delete/${employee.phone}`
        );


        alert(
          "Employee deleted successfully."
        );


        if (
          selectedPhone ===
          employee.phone
        ) {

          setSelectedEmployee(
            null
          );

          setSelectedPhone(
            null
          );

          setViewMode(
            "none"
          );

        }


        await fetchEmployeesByRole(
          selectedRole
        );


      } catch (error) {

        console.error(
          "Error deleting employee:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          handleUnauthorized();

          return;

        }


        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete employee."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // OPEN EXPENSE FORM
  // =====================================================

  const openExpenseForm =
    (employee) => {

      setUpdatePhone(
        employee.phone
      );


      setUpdateStartDate(
        ""
      );


      setUpdateEndDate(
        ""
      );


      setExpensePaid(
        ""
      );


      setPaymentMethod(
        ""
      );


      setShowExpenseForm(
        true
      );

    };


  // =====================================================
  // UPDATE EXPENSE
  // =====================================================

  const handleUpdateExpense =
    async () => {

      if (
        !updateStartDate ||
        !updateEndDate
      ) {

        alert(
          "Please select start and end dates."
        );

        return;

      }


      if (
        new Date(updateEndDate) <
        new Date(updateStartDate)
      ) {

        alert(
          "End date cannot be before start date."
        );

        return;

      }


      if (
        expensePaid === ""
      ) {

        alert(
          "Please enter expense amount."
        );

        return;

      }


      if (
        !paymentMethod
      ) {

        alert(
          "Please select payment method."
        );

        return;

      }


      try {

        setLoading(true);


        /*
         * IMPORTANT:
         *
         * This endpoint must exist in your
         * salaryRoutes.js.
         *
         * If your salaryRoutes uses another
         * endpoint, change this URL accordingly.
         */

        await api.post(
          "/salary/add",
          {

            phone:
              updatePhone,

            startDate:
              updateStartDate,

            endDate:
              updateEndDate,

            expensePaid:
              Number(
                expensePaid
              ),

            expensePaymentMethod:
              paymentMethod

          }
        );


        alert(
          "Expense record added successfully."
        );


        setShowExpenseForm(
          false
        );


        const refreshed =
          await fetchEmployeeDetails(
            updatePhone
          );


        if (refreshed) {

          setViewMode(
            "cards"
          );

        }


        await fetchEmployeesByRole(
          selectedRole
        );


      } catch (error) {

        console.error(
          "Error updating expense:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          handleUnauthorized();

          return;

        }


        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save expense."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // OPEN FIXED SALARY FORM
  // OWNER ONLY
  // =====================================================

  const openSalaryForm =
    async (employee) => {

      if (!isOwner) {

        alert(
          "Only the owner can update fixed salary."
        );

        return;

      }


      setSalaryEmployee(
        employee
      );


      setNewSalary(

        Number(
          employee.fixed_salary ||
          0
        ) > 0

          ? Number(
              employee.fixed_salary
            )

          : ""

      );


      setSalaryEffectiveFrom(
        ""
      );


      setSalaryHistory(
        []
      );


      setShowSalaryForm(
        true
      );


      try {

        setSalaryHistoryLoading(
          true
        );


        const response =
          await api.get(
            `/salary/fixed/history/${employee.id}`
          );


        const history =

          Array.isArray(
            response.data
          )

            ? response.data

            : Array.isArray(
                response.data?.history
              )

              ? response.data.history

              : Array.isArray(
                  response.data?.data
                )

                ? response.data.data

                : [];


        setSalaryHistory(
          history
        );


      } catch (error) {

        console.error(
          "Error fetching salary history:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          handleUnauthorized();

          return;

        }


        setSalaryHistory(
          []
        );


      } finally {

        setSalaryHistoryLoading(
          false
        );

      }

    };


  // =====================================================
  // UPDATE FIXED SALARY
  // =====================================================

  const handleUpdateFixedSalary =
    async () => {

      if (!isOwner) {

        alert(
          "Only the owner can update fixed salary."
        );

        return;

      }


      if (
        !salaryEmployee?.id
      ) {

        alert(
          "Employee information is missing."
        );

        return;

      }


      if (
        newSalary === "" ||
        Number(newSalary) < 0
      ) {

        alert(
          "Please enter a valid salary."
        );

        return;

      }


      if (
        !salaryEffectiveFrom
      ) {

        alert(
          "Please select the effective date."
        );

        return;

      }


      try {

        setLoading(true);


        const response =
          await api.put(
            `/salary/fixed/${salaryEmployee.id}`,
            {

              newSalary:
                Number(
                  newSalary
                ),

              effectiveFrom:
                salaryEffectiveFrom

            }
          );


        alert(
          response.data?.message ||
          "Fixed salary updated successfully."
        );


        // =============================================
        // REFRESH DETAILS
        // =============================================

        const phone =
          salaryEmployee.phone;


        const refreshed =
          await fetchEmployeeDetails(
            phone
          );


        // =============================================
        // REFRESH LIST
        // =============================================

        await fetchEmployeesByRole(
          selectedRole
        );


        if (refreshed) {

          setSalaryEmployee(
            refreshed
          );

        }


        setShowSalaryForm(
          false
        );


      } catch (error) {

        console.error(
          "Error updating fixed salary:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          handleUnauthorized();

          return;

        }


        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update fixed salary."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(
    () => {

      setSelectedEmployee(
        null
      );


      setSelectedPhone(
        null
      );


      setViewMode(
        "none"
      );


      fetchEmployeesByRole(
        selectedRole
      );

    },
    [
      id,
      selectedRole,
      fetchEmployeesByRole
    ]
  );


  // =====================================================
  // METRICS
  // =====================================================

  const metrics =
    selectedEmployee?.metrics ||
    calculateMetrics(
      selectedEmployee
    );
      // =====================================================
  // MAIN RENDER
  // =====================================================

return (
  <>
    <ResponsiveStyle />

    <Page>

      {/* =================================================
          HEADER
      ================================================= */}

      <Header>

        <HeaderLeft>

          <TruckIcon>
            🚛
          </TruckIcon>


          <HeaderText>

            <SmallHeading>
              EMPLOYEE MANAGEMENT
            </SmallHeading>


            <PageHeading>
              Lorry {id}
            </PageHeading>


            <Subtitle>
              Manage employees, salaries and expenses
            </Subtitle>

          </HeaderText>

        </HeaderLeft>


        <AddButton
          onClick={() => {

            setEmployeeData({

              name: "",

              phone: "",

              role: selectedRole,

              salary: ""

            });


            setShowAddForm(
              true
            );

          }}
        >
          ＋ Add Employee
        </AddButton>

      </Header>


      {/* =================================================
          ROLE TABS
      ================================================= */}

      <RoleTabs>

        {roles.map(
          (role) => (

            <RoleTab
              key={role}
              $active={
                selectedRole === role
              }
              onClick={() =>
                changeRole(role)
              }
            >

              {roleLabels[role]}

            </RoleTab>

          )
        )}

      </RoleTabs>


      {/* =================================================
          ADD EMPLOYEE MODAL
      ================================================= */}

      {showAddForm && (

        <Overlay>

          <Modal>

            <ModalHeader>

              <div>

                <ModalTitle>
                  Add Employee
                </ModalTitle>


                <ModalSubtitle>
                  Add employee to Lorry {id}
                </ModalSubtitle>

              </div>


              <CloseButton
                onClick={() =>
                  setShowAddForm(
                    false
                  )
                }
              >
                ×
              </CloseButton>

            </ModalHeader>


            <FormGrid>

              <Field>

                <Label>
                  Employee Name
                </Label>


                <Input
                  value={
                    employeeData.name
                  }
                  placeholder="Enter employee name"
                  onChange={(e) =>
                    setEmployeeData(
                      (previous) => ({

                        ...previous,

                        name:
                          e.target.value

                      })
                    )
                  }
                />

              </Field>


              <Field>

                <Label>
                  Phone Number
                </Label>


                <Input
                  value={
                    employeeData.phone
                  }
                  placeholder="Enter phone number"
                  maxLength={15}
                  onChange={(e) =>
                    setEmployeeData(
                      (previous) => ({

                        ...previous,

                        phone:
                          e.target.value

                      })
                    )
                  }
                />

              </Field>


              <Field>

                <Label>
                  Role
                </Label>


                <Select
                  value={
                    employeeData.role
                  }
                  onChange={(e) =>
                    setEmployeeData(
                      (previous) => ({

                        ...previous,

                        role:
                          e.target.value

                      })
                    )
                  }
                >

                  <option value="driver">
                    Driver
                  </option>

                  <option value="driller">
                    Driller
                  </option>

                  <option value="worker">
                    Worker
                  </option>

                  <option value="lorry_manager">
                    Lorry Manager
                  </option>

                </Select>

              </Field>


              <Field>

                <Label>
                  Initial Fixed Salary
                </Label>


                <Input
                  type="number"
                  min="0"
                  value={
                    employeeData.salary
                  }
                  placeholder="Leave empty if not assigned"
                  onChange={(e) =>
                    setEmployeeData(
                      (previous) => ({

                        ...previous,

                        salary:
                          e.target.value

                      })
                    )
                  }
                />


                <Hint>
                  You can leave this empty and
                  assign salary later.
                </Hint>

              </Field>

            </FormGrid>


            <ModalActions>

              <SecondaryButton
                onClick={() =>
                  setShowAddForm(
                    false
                  )
                }
              >
                Cancel
              </SecondaryButton>


              <PrimaryButton
                onClick={
                  addEmployee
                }
                disabled={
                  loading
                }
              >

                {loading
                  ? "Saving..."
                  : "Add Employee"}

              </PrimaryButton>

            </ModalActions>

          </Modal>

        </Overlay>

      )}


      {/* =================================================
          EMPLOYEE LIST
      ================================================= */}

      <EmployeeList>

        {loading &&
        employees.length === 0 ? (

          <EmptyState>

            <EmptyIcon>
              ⏳
            </EmptyIcon>

            <EmptyTitle>
              Loading employees...
            </EmptyTitle>

          </EmptyState>

        ) : employees.length === 0 ? (

          <EmptyState>

            <EmptyIcon>
              👥
            </EmptyIcon>

            <EmptyTitle>
              No employees found
            </EmptyTitle>

            <EmptyDescription>
              No{" "}
              {selectedRole.replace(
                "_",
                " "
              )}{" "}
              is assigned to this lorry.
            </EmptyDescription>

          </EmptyState>

        ) : (

          employees.map(
            (employee) => (

              <EmployeeRow
                key={
                  employee.id
                }
                $selected={
                  selectedPhone ===
                  employee.phone
                }
              >

                {/* =====================================
                    EMPLOYEE
                ===================================== */}

                <EmployeeIdentity>

                  <Avatar>

                    {employee.role ===
                    "driver"

                      ? "🚚"

                      : employee.role ===
                        "driller"

                        ? "⚙️"

                        : employee.role ===
                          "worker"

                          ? "👷"

                          : "👨‍💼"}

                  </Avatar>


                  <EmployeeBasic>

                    <EmployeeName>
                      {employee.name}
                    </EmployeeName>


                    <EmployeePhone>
                      {employee.phone}
                    </EmployeePhone>


                    <RoleBadge>
                      {employee.role
                        .replace(
                          "_",
                          " "
                        )
                        .toUpperCase()}
                    </RoleBadge>

                  </EmployeeBasic>

                </EmployeeIdentity>


                {/* =====================================
                    SALARY
                ===================================== */}

                <SalarySmall>

                  <SalaryLabel>
                    FIXED SALARY
                  </SalaryLabel>


                  {Number(
                    employee.fixed_salary ||
                    0
                  ) > 0 ? (

                    <SalaryValue>
                      ₹
                      {formatMoney(
                        employee.fixed_salary
                      )}
                    </SalaryValue>

                  ) : (

                    <NotSet>
                      Not Set
                    </NotSet>

                  )}

                </SalarySmall>


                {/* =====================================
                    ACTIONS
                ===================================== */}

                <EmployeeActions>

                  <ViewButton
                    onClick={() =>
                      handleViewEmployee(
                        employee
                      )
                    }
                  >

                    {selectedPhone ===
                      employee.phone &&
                    viewMode ===
                      "table"

                      ? "Show Cards"

                      : selectedPhone ===
                          employee.phone &&
                        viewMode ===
                          "cards"

                        ? "Show Table"

                        : "Show Table"}

                  </ViewButton>


                  {isOwner && (

                    <SalaryButton
                      onClick={() =>
                        openSalaryForm(
                          employee
                        )
                      }
                    >
                      💰 Salary
                    </SalaryButton>

                  )}


                  <ExpenseButton
                    onClick={() =>
                      openExpenseForm(
                        employee
                      )
                    }
                  >
                    Expense
                  </ExpenseButton>


                  <DeleteButton
                    onClick={() =>
                      deleteEmployee(
                        employee
                      )
                    }
                  >
                    Delete
                  </DeleteButton>

                </EmployeeActions>

              </EmployeeRow>

            )
          )

        )}

      </EmployeeList>
            {/* =================================================
          EMPLOYEE DETAILS
      ================================================= */}

      {selectedEmployee &&
        selectedPhone && (

          <DetailsSection>

            {/* ===========================================
                EMPLOYEE HEADER
            =========================================== */}

            <DetailsHeader>

              <EmployeeIdentity>

                <LargeAvatar>
                  {selectedEmployee.role ===
                  "driver"

                    ? "🚚"

                    : selectedEmployee.role ===
                      "driller"

                      ? "⚙️"

                      : selectedEmployee.role ===
                        "worker"

                        ? "👷"

                        : "👨‍💼"}
                </LargeAvatar>


                <div>

                  <DetailsName>
                    {selectedEmployee.name}
                  </DetailsName>


                  <DetailsPhone>
                    {selectedEmployee.phone}
                  </DetailsPhone>

                </div>

              </EmployeeIdentity>


              <RegistrationBadge>

                {selectedEmployee.registration_number ||
                  `Lorry ${selectedEmployee.lorry_id}`}

              </RegistrationBadge>

            </DetailsHeader>


            {/* ===========================================
                METRIC CARDS
            =========================================== */}

            <MetricsGrid>

              {/* FIXED SALARY */}

              <MetricCard>

                <MetricIcon>
                  💰
                </MetricIcon>


                <MetricLabel>
                  MONTHLY FIXED SALARY
                </MetricLabel>


                <MetricValue>

                  {metrics.fixedSalary >
                  0

                    ? `₹${formatMoney(
                        metrics.fixedSalary
                      )}`

                    : "Not Set"}

                </MetricValue>


                <MetricHint>
                  Current fixed salary
                </MetricHint>

              </MetricCard>


              {/* DAYS */}

              <MetricCard>

                <MetricIcon>
                  📅
                </MetricIcon>


                <MetricLabel>
                  TOTAL DAYS WORKED
                </MetricLabel>


                <MetricValue>
                  {metrics.totalDays}
                </MetricValue>


                <MetricHint>
                  Across all records
                </MetricHint>

              </MetricCard>


              {/* EXPENSE */}

              <MetricCard>

                <MetricIcon>
                  💸
                </MetricIcon>


                <MetricLabel>
                  TOTAL EXPENSE
                </MetricLabel>


                <ExpenseMetric>
                  ₹
                  {formatMoney(
                    metrics.totalExpense
                  )}
                </ExpenseMetric>


                <MetricHint>
                  Total expense paid
                </MetricHint>

              </MetricCard>


              {/* EARNED */}

              <MetricCard>

                <MetricIcon>
                  📈
                </MetricIcon>


                <MetricLabel>
                  EARNED AMOUNT
                </MetricLabel>


                <MetricValue>
                  ₹
                  {formatMoney(
                    metrics.earnedAmount
                  )}
                </MetricValue>


                <MetricHint>
                  Based on days worked
                </MetricHint>

              </MetricCard>


              {/* REMAINING */}

              <MetricCard>

                <MetricIcon>
                  🧾
                </MetricIcon>


                <MetricLabel>
                  REMAINING AMOUNT
                </MetricLabel>


                <RemainingMetric
                  $negative={
                    metrics.remainingAmount <
                    0
                  }
                >
                  ₹
                  {formatMoney(
                    metrics.remainingAmount
                  )}
                </RemainingMetric>


                <MetricHint>
                  Earned amount − expenses
                </MetricHint>

              </MetricCard>


              {/* ROLE */}

              <MetricCard>

                <MetricIcon>
                  👤
                </MetricIcon>


                <MetricLabel>
                  EMPLOYEE ROLE
                </MetricLabel>


                <RoleMetric>
                  {selectedEmployee.role
                    .replace(
                      "_",
                      " "
                    )
                    .replace(
                      /\b\w/g,
                      (letter) =>
                        letter.toUpperCase()
                    )}
                </RoleMetric>


                <MetricHint>
                  Assigned to this lorry
                </MetricHint>

              </MetricCard>


              {/* LORRY */}

              <MetricCard>

                <MetricIcon>
                  🚛
                </MetricIcon>


                <MetricLabel>
                  LORRY REGISTRATION
                </MetricLabel>


                <RoleMetric>
                  {selectedEmployee.registration_number ||
                    selectedEmployee.lorry_id}
                </RoleMetric>


                <MetricHint>
                  Assigned lorry
                </MetricHint>

              </MetricCard>


              {/* RECORDS */}

              <MetricCard>

                <MetricIcon>
                  📋
                </MetricIcon>


                <MetricLabel>
                  EXPENSE RECORDS
                </MetricLabel>


                <MetricValue>
                  {
                    selectedEmployee
                      .salaryRecords
                      ?.length || 0
                  }
                </MetricValue>


                <MetricHint>
                  Salary and expense history
                </MetricHint>

              </MetricCard>

            </MetricsGrid>


            {/* =========================================
                FIXED SALARY HISTORY
            ========================================= */}

            <Section>

              <SectionHeader>

                <div>

                  <SectionTitle>
                    Fixed Salary History
                  </SectionTitle>


                  <SectionSubtitle>
                    Salary changes made by the owner
                  </SectionSubtitle>

                </div>


                <CountBadge>
                  {
                    selectedEmployee
                      .fixedSalaryHistory
                      ?.length || 0
                  } Records
                </CountBadge>

              </SectionHeader>


              {selectedEmployee
                .fixedSalaryHistory
                ?.length > 0 ? (

                <HistoryTable>

                  <HistoryHeader>

                    <span>
                      Salary
                    </span>


                    <span>
                      Effective From
                    </span>


                    <span>
                      Effective To
                    </span>


                    <span>
                      Updated By
                    </span>

                  </HistoryHeader>


                  {selectedEmployee
                    .fixedSalaryHistory
                    .map(
                      (record) => (

                        <HistoryRow
                          key={
                            record.id
                          }
                        >

                          <HistorySalary>
                            ₹
                            {formatMoney(
                              record.fixed_salary
                            )}
                          </HistorySalary>


                          <span>
                            {formatDate(
                              record.effective_from
                            )}
                          </span>


                          <span>

                            {record.effective_to

                              ? formatDate(
                                  record.effective_to
                                )

                              : "Current"}

                          </span>


                          <span>
                            {record.updated_by_name ||
                              "Owner"}
                          </span>

                        </HistoryRow>

                      )
                    )}

                </HistoryTable>

              ) : (

                <NoRecords>
                  No fixed salary history available.
                </NoRecords>

              )}

            </Section>


            {/* =========================================
                EXPENSE HISTORY
            ========================================= */}

            <Section>

              <SectionHeader>

                <div>

                  <SectionTitle>
                    Salary & Expense History
                  </SectionTitle>


                  <SectionSubtitle>
                    Complete payment and work records
                  </SectionSubtitle>

                </div>


                <CountBadge>
                  {
                    selectedEmployee
                      .salaryRecords
                      ?.length || 0
                  } Records
                </CountBadge>

              </SectionHeader>


              {selectedEmployee
                .salaryRecords
                ?.length > 0 ? (

                <ExpenseTable>

                  <ExpenseHeader>

                    <span>
                      Start Date
                    </span>


                    <span>
                      End Date
                    </span>


                    <span>
                      Days
                    </span>


                    <span>
                      Expense
                    </span>


                    <span>
                      Payment Method
                    </span>

                  </ExpenseHeader>


                  {selectedEmployee
                    .salaryRecords
                    .map(
                      (record) => (

                        <ExpenseRow
                          key={
                            record.id
                          }
                        >

                          <span>
                            {formatDate(
                              record.start_date
                            )}
                          </span>


                          <span>
                            {formatDate(
                              record.end_date
                            )}
                          </span>


                          <span>
                            {
                              record.days_worked ??
                              calculateDays(
                                record.start_date,
                                record.end_date
                              )
                            }
                          </span>


                          <ExpenseAmount>
                            ₹
                            {formatMoney(
                              record.expense_paid
                            )}
                          </ExpenseAmount>


                          <PaymentBadge>
                            {
                              record.expense_payment_method ||
                              "N/A"
                            }
                          </PaymentBadge>

                        </ExpenseRow>

                      )
                    )}

                </ExpenseTable>

              ) : (

                <NoRecords>

                  <NoRecordsIcon>
                    📋
                  </NoRecordsIcon>


                  <div>
                    No expense records.
                  </div>

                </NoRecords>

              )}

            </Section>


            {/* =========================================
                BOTTOM ACTIONS
            ========================================= */}

            <BottomActions>

              <ExpenseButtonLarge
                onClick={() =>
                  openExpenseForm(
                    selectedEmployee
                  )
                }
              >
                ＋ Add Expense Record
              </ExpenseButtonLarge>


              {isOwner && (

                <SalaryButtonLarge
                  onClick={() =>
                    openSalaryForm(
                      selectedEmployee
                    )
                  }
                >
                  💰 Update Fixed Salary
                </SalaryButtonLarge>

              )}

            </BottomActions>

          </DetailsSection>

        )}
              {/* =================================================
          EXPENSE MODAL
      ================================================= */}

      {showExpenseForm && (

        <Overlay>

          <Modal>

            <ModalHeader>

              <div>

                <ModalTitle>
                  Add Expense Record
                </ModalTitle>


                <ModalSubtitle>
                  Employee: {updatePhone}
                </ModalSubtitle>

              </div>


              <CloseButton
                onClick={() =>
                  setShowExpenseForm(
                    false
                  )
                }
              >
                ×
              </CloseButton>

            </ModalHeader>


            <FormGrid>

              <Field>

                <Label>
                  Start Date
                </Label>


                <Input
                  type="date"
                  value={
                    updateStartDate
                  }
                  onChange={(e) =>
                    setUpdateStartDate(
                      e.target.value
                    )
                  }
                />

              </Field>


              <Field>

                <Label>
                  End Date
                </Label>


                <Input
                  type="date"
                  value={
                    updateEndDate
                  }
                  onChange={(e) =>
                    setUpdateEndDate(
                      e.target.value
                    )
                  }
                />

              </Field>


              <Field>

                <Label>
                  Expense Paid
                </Label>


                <Input
                  type="number"
                  min="0"
                  value={
                    expensePaid
                  }
                  placeholder="Enter amount"
                  onChange={(e) =>
                    setExpensePaid(
                      e.target.value
                    )
                  }
                />

              </Field>


              <Field>

                <Label>
                  Payment Method
                </Label>


                <Select
                  value={
                    paymentMethod
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select method
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

              </Field>

            </FormGrid>


            <ModalActions>

              <SecondaryButton
                onClick={() =>
                  setShowExpenseForm(
                    false
                  )
                }
              >
                Cancel
              </SecondaryButton>


              <PrimaryButton
                onClick={
                  handleUpdateExpense
                }
                disabled={
                  loading
                }
              >

                {loading
                  ? "Saving..."
                  : "Save Expense"}

              </PrimaryButton>

            </ModalActions>

          </Modal>

        </Overlay>

      )}


      {/* =================================================
          FIXED SALARY MODAL
      ================================================= */}

      {showSalaryForm && (

        <Overlay>

          <Modal>

            <ModalHeader>

              <div>

                <ModalTitle>
                  💰 Update Fixed Salary
                </ModalTitle>


                <ModalSubtitle>
                  Owner-only salary management
                </ModalSubtitle>

              </div>


              <CloseButton
                onClick={() =>
                  setShowSalaryForm(
                    false
                  )
                }
              >
                ×
              </CloseButton>

            </ModalHeader>


            {/* =========================================
                EMPLOYEE SALARY CARD
            ========================================= */}

            <SalaryEmployeeCard>

              <Avatar>
                👤
              </Avatar>


              <div>

                <SalaryEmployeeName>
                  {salaryEmployee?.name}
                </SalaryEmployeeName>


                <SalaryEmployeePhone>
                  {salaryEmployee?.phone}
                </SalaryEmployeePhone>

              </div>


              <CurrentSalary>

                <SalaryLabel>
                  CURRENT
                </SalaryLabel>


                <SalaryValue>

                  {Number(
                    salaryEmployee?.fixed_salary ||
                    0
                  ) > 0

                    ? `₹${formatMoney(
                        salaryEmployee.fixed_salary
                      )}`

                    : "Not Set"}

                </SalaryValue>

              </CurrentSalary>

            </SalaryEmployeeCard>


            {/* =========================================
                SALARY FORM
            ========================================= */}

            <FormGrid>

              <Field>

                <Label>
                  New Fixed Salary
                </Label>


                <Input
                  type="number"
                  min="0"
                  value={
                    newSalary
                  }
                  placeholder="Enter monthly salary"
                  onChange={(e) =>
                    setNewSalary(
                      e.target.value
                    )
                  }
                />

              </Field>


              <Field>

                <Label>
                  Effective From
                </Label>


                <Input
                  type="date"
                  value={
                    salaryEffectiveFrom
                  }
                  onChange={(e) =>
                    setSalaryEffectiveFrom(
                      e.target.value
                    )
                  }
                />


                <Hint>
                  The previous salary will end
                  automatically.
                </Hint>

              </Field>

            </FormGrid>


            {/* =========================================
                INFORMATION BOX
            ========================================= */}

            <SalaryInfoBox>

              <SalaryInfoTitle>
                How salary history works
              </SalaryInfoTitle>


              <SalaryInfoText>

                When the owner changes the salary,
                the old salary remains in the
                history and the new salary starts
                from the selected effective date.

              </SalaryInfoText>

            </SalaryInfoBox>


            {/* =========================================
                SALARY HISTORY
            ========================================= */}

            <SalaryHistoryTitle>
              Salary History
            </SalaryHistoryTitle>


            <SalaryHistoryModal>

              {salaryHistoryLoading ? (

                <NoRecords>
                  Loading salary history...
                </NoRecords>

              ) : salaryHistory.length === 0 ? (

                <NoRecords>
                  No salary history available.
                </NoRecords>

              ) : (

                salaryHistory.map(
                  (record) => (

                    <SalaryHistoryItem
                      key={
                        record.id
                      }
                    >

                      <div>

                        <HistorySalary>
                          ₹
                          {formatMoney(
                            record.fixed_salary
                          )}
                        </HistorySalary>


                        <HistoryDate>

                          From{" "}

                          {formatDate(
                            record.effective_from
                          )}


                          {" — "}


                          {record.effective_to

                            ? `To ${formatDate(
                                record.effective_to
                              )}`

                            : "Current"}

                        </HistoryDate>

                      </div>


                      <UpdatedBy>

                        {record.updated_by_name ||
                          "Owner"}

                      </UpdatedBy>

                    </SalaryHistoryItem>

                  )
                )

              )}

            </SalaryHistoryModal>


            {/* =========================================
                MODAL ACTIONS
            ========================================= */}

            <ModalActions>

              <SecondaryButton
                onClick={() =>
                  setShowSalaryForm(
                    false
                  )
                }
              >
                Cancel
              </SecondaryButton>


              <PrimaryButton
                onClick={
                  handleUpdateFixedSalary
                }
                disabled={
                  loading
                }
              >

                {loading
                  ? "Updating..."
                  : "Update Fixed Salary"}

              </PrimaryButton>

            </ModalActions>

          </Modal>

        </Overlay>

      )}

    </Page>

    </>
  );

};



// =====================================================
// PAGE
// =====================================================

const Page = styled.div`

  min-height: 100vh;

  padding: 30px;

  box-sizing: border-box;

  background:
    linear-gradient(
      135deg,
      #f8fafc 0%,
      #eef4ff 100%
    );

  color: #172554;

`;


// =====================================================
// HEADER
// =====================================================

const Header = styled.div`

  background: white;

  border-radius: 20px;

  padding: 24px 28px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  border:
    1px solid #e2e8f0;

  box-shadow:
    0 8px 30px
    rgba(15, 23, 42, 0.08);

`;

const HeaderLeft = styled.div`

  display: flex;

  align-items: center;

  gap: 18px;

`;

const TruckIcon = styled.div`

  width: 65px;

  height: 65px;

  border-radius: 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 34px;

  background: #eff6ff;

`;

const HeaderText = styled.div``;


const SmallHeading = styled.div`

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1.5px;

  color: #64748b;

`;


const PageHeading = styled.h1`

  margin: 3px 0;

  font-size: 30px;

  color: #172554;

`;


const Subtitle = styled.div`

  color: #64748b;

  font-size: 14px;

`;


// =====================================================
// BUTTONS
// =====================================================

const AddButton = styled.button`

  border: none;

  background: #2563eb;

  color: white;

  padding: 13px 20px;

  border-radius: 11px;

  font-weight: 700;

  font-size: 14px;

  cursor: pointer;

  transition: 0.2s;

  &:hover {

    background: #1d4ed8;

    transform: translateY(-1px);

  }

`;


const PrimaryButton = styled.button`

  border: none;

  background: #2563eb;

  color: white;

  padding: 12px 20px;

  border-radius: 9px;

  font-weight: 700;

  cursor: pointer;

  &:hover {

    background: #1d4ed8;

  }

  &:disabled {

    opacity: 0.6;

    cursor: not-allowed;

  }

`;


const SecondaryButton = styled.button`

  border:
    1px solid #cbd5e1;

  background: white;

  color: #334155;

  padding: 12px 20px;

  border-radius: 9px;

  font-weight: 700;

  cursor: pointer;

`;


const ViewButton = styled.button`

  border:
    1px solid #bfdbfe;

  background: #eff6ff;

  color: #1d4ed8;

  padding: 8px 12px;

  border-radius: 8px;

  cursor: pointer;

  font-weight: 700;

`;


const SalaryButton = styled.button`

  border:
    1px solid #bbf7d0;

  background: #f0fdf4;

  color: #15803d;

  padding: 8px 12px;

  border-radius: 8px;

  cursor: pointer;

  font-weight: 700;

`;


const ExpenseButton = styled.button`

  border:
    1px solid #fed7aa;

  background: #fff7ed;

  color: #c2410c;

  padding: 8px 12px;

  border-radius: 8px;

  cursor: pointer;

  font-weight: 700;

`;


const DeleteButton = styled.button`

  border:
    1px solid #fecaca;

  background: #fef2f2;

  color: #dc2626;

  padding: 8px 12px;

  border-radius: 8px;

  cursor: pointer;

  font-weight: 700;

`;


// =====================================================
// ROLE TABS
// =====================================================

const RoleTabs = styled.div`

  margin-top: 22px;

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 12px;

`;


const RoleTab = styled.button`

  border:
    1px solid #e2e8f0;

  background:
    ${(props) =>
      props.$active
        ? "#2563eb"
        : "white"};

  color:
    ${(props) =>
      props.$active
        ? "white"
        : "#475569"};

  padding: 15px;

  border-radius: 12px;

  font-weight: 700;

  cursor: pointer;

  box-shadow:
    ${(props) =>
      props.$active
        ? "0 7px 20px rgba(37,99,235,.2)"
        : "none"};

`;


// =====================================================
// EMPLOYEE LIST
// =====================================================

const EmployeeList = styled.div`

  margin-top: 20px;

  display: flex;

  flex-direction: column;

  gap: 12px;

`;


const EmployeeRow = styled.div`

  background: white;

  border:
    1px solid
    ${(props) =>
      props.$selected
        ? "#93c5fd"
        : "#e2e8f0"};

  border-radius: 16px;

  padding: 16px 18px;

  display: grid;

  grid-template-columns:
    1.5fr
    0.7fr
    2fr;

  align-items: center;

  gap: 20px;

  box-shadow:
    0 5px 20px
    rgba(15,23,42,.05);

`;


const EmployeeIdentity = styled.div`

  display: flex;

  align-items: center;

  gap: 13px;

`;


const Avatar = styled.div`

  width: 48px;

  height: 48px;

  border-radius: 14px;

  background: #eff6ff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 23px;

`;


const LargeAvatar = styled(Avatar)`

  width: 58px;

  height: 58px;

`;


const EmployeeBasic = styled.div``;


const EmployeeName = styled.div`

  font-size: 16px;

  font-weight: 800;

  color: #172554;

`;


const EmployeePhone = styled.div`

  color: #64748b;

  font-size: 13px;

  margin-top: 3px;

`;


const RoleBadge = styled.span`

  display: inline-block;

  margin-top: 5px;

  padding: 3px 7px;

  border-radius: 5px;

  background: #f1f5f9;

  color: #475569;

  font-size: 9px;

  font-weight: 800;

`;


const SalarySmall = styled.div``;


const SalaryLabel = styled.div`

  color: #64748b;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: .5px;

`;


const SalaryValue = styled.div`

  color: #15803d;

  font-size: 17px;

  font-weight: 800;

  margin-top: 4px;

`;


const NotSet = styled.div`

  color: #94a3b8;

  font-size: 14px;

  font-weight: 700;

  margin-top: 4px;

`;


const EmployeeActions = styled.div`

  display: flex;

  justify-content: flex-end;

  align-items: center;

  flex-wrap: wrap;

  gap: 7px;

`;
// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = styled.div`

  background: white;

  border:
    1px dashed #cbd5e1;

  border-radius: 16px;

  padding: 55px 20px;

  text-align: center;

`;


const EmptyIcon = styled.div`

  font-size: 42px;

`;


const EmptyTitle = styled.div`

  margin-top: 10px;

  font-size: 18px;

  font-weight: 800;

`;


const EmptyDescription = styled.div`

  margin-top: 6px;

  color: #64748b;

`;


// =====================================================
// DETAILS
// =====================================================

const DetailsSection = styled.div`

  margin-top: 22px;

`;


const DetailsHeader = styled.div`

  background: white;

  border-radius: 16px;

  padding: 18px 22px;

  border:
    1px solid #e2e8f0;

  display: flex;

  align-items: center;

  justify-content: space-between;

`;


const DetailsName = styled.div`

  font-size: 20px;

  font-weight: 800;

`;


const DetailsPhone = styled.div`

  color: #64748b;

  font-size: 13px;

  margin-top: 3px;

`;


const RegistrationBadge = styled.div`

  background: #eef2ff;

  color: #3730a3;

  padding: 8px 12px;

  border-radius: 8px;

  font-weight: 800;

  font-size: 12px;

`;


// =====================================================
// METRIC GRID
// =====================================================

const MetricsGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 14px;

  margin-top: 14px;

`;


const MetricCard = styled.div`

  background: white;

  border:
    1px solid #e2e8f0;

  border-radius: 15px;

  padding: 18px;

  min-height: 125px;

`;


const MetricIcon = styled.div`

  font-size: 20px;

`;


const MetricLabel = styled.div`

  font-size: 9px;

  font-weight: 800;

  color: #64748b;

  margin-top: 8px;

`;


const MetricValue = styled.div`

  color: #172554;

  font-size: 21px;

  font-weight: 800;

  margin-top: 6px;

`;


const ExpenseMetric = styled(
  MetricValue
)`

  color: #dc2626;

`;


const RemainingMetric = styled(
  MetricValue
)`

  color:
    ${(props) =>
      props.$negative
        ? "#dc2626"
        : "#15803d"};

`;


const RoleMetric = styled.div`

  font-size: 16px;

  font-weight: 800;

  color: #172554;

  margin-top: 8px;

`;


const MetricHint = styled.div`

  color: #94a3b8;

  font-size: 11px;

  margin-top: 4px;

`;
// =====================================================
// SECTION
// =====================================================

const Section = styled.div`

  background: white;

  border:
    1px solid #e2e8f0;

  border-radius: 16px;

  margin-top: 16px;

  padding: 20px;

`;


const SectionHeader = styled.div`

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 15px;

`;


const SectionTitle = styled.h3`

  margin: 0;

  color: #172554;

`;


const SectionSubtitle = styled.div`

  color: #64748b;

  font-size: 12px;

  margin-top: 4px;

`;


const CountBadge = styled.span`

  background: #eff6ff;

  color: #1d4ed8;

  padding: 6px 10px;

  border-radius: 8px;

  font-size: 11px;

  font-weight: 800;

`;


// =====================================================
// FIXED SALARY HISTORY TABLE
// =====================================================

const HistoryTable = styled.div`

  border:
    1px solid #e2e8f0;

  border-radius: 10px;

  overflow: hidden;

`;


const HistoryHeader = styled.div`

  display: grid;

  grid-template-columns:
    1fr 1fr 1fr 1fr;

  background: #f8fafc;

  padding: 12px 15px;

  font-size: 11px;

  font-weight: 800;

  color: #64748b;

`;


const HistoryRow = styled.div`

  display: grid;

  grid-template-columns:
    1fr 1fr 1fr 1fr;

  padding: 13px 15px;

  border-top:
    1px solid #f1f5f9;

  align-items: center;

  font-size: 13px;

`;


const HistorySalary = styled.div`

  color: #15803d;

  font-weight: 800;

`;


// =====================================================
// EXPENSE TABLE
// =====================================================

const ExpenseTable = styled.div`

  border:
    1px solid #e2e8f0;

  border-radius: 10px;

  overflow: hidden;

`;


const ExpenseHeader = styled.div`

  display: grid;

  grid-template-columns:
    1fr
    1fr
    .6fr
    1fr
    1.3fr;

  background: #f8fafc;

  padding: 12px 15px;

  font-size: 11px;

  font-weight: 800;

  color: #64748b;

`;


const ExpenseRow = styled.div`

  display: grid;

  grid-template-columns:
    1fr
    1fr
    .6fr
    1fr
    1.3fr;

  padding: 13px 15px;

  border-top:
    1px solid #f1f5f9;

  align-items: center;

  font-size: 13px;

`;


const ExpenseAmount = styled.div`

  color: #dc2626;

  font-weight: 800;

`;


const PaymentBadge = styled.span`

  display: inline-block;

  background: #f1f5f9;

  padding: 5px 8px;

  border-radius: 6px;

  color: #475569;

  font-size: 11px;

  width: fit-content;

`;


const NoRecords = styled.div`

  padding: 30px;

  text-align: center;

  color: #64748b;

`;


const NoRecordsIcon = styled.div`

  font-size: 30px;

  margin-bottom: 7px;

`;


// =====================================================
// BOTTOM ACTIONS
// =====================================================

const BottomActions = styled.div`

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 16px;

`;


const ExpenseButtonLarge = styled(
  ExpenseButton
)`

  padding: 12px 18px;

`;


const SalaryButtonLarge = styled(
  SalaryButton
)`

  padding: 12px 18px;

`;

// =====================================================
// MODAL OVERLAY
// =====================================================

const Overlay = styled.div`

  position: fixed;

  inset: 0;

  background:
    rgba(15, 23, 42, .55);

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  z-index: 1000;

`;


// =====================================================
// MODAL
// =====================================================

const Modal = styled.div`

  width: 100%;

  max-width: 760px;

  max-height: 90vh;

  overflow-y: auto;

  background: white;

  border-radius: 18px;

  padding: 24px;

  box-shadow:
    0 25px 70px
    rgba(15,23,42,.25);

`;


const ModalHeader = styled.div`

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 22px;

`;


const ModalTitle = styled.h2`

  margin: 0;

  color: #172554;

  font-size: 21px;

`;


const ModalSubtitle = styled.div`

  color: #64748b;

  font-size: 12px;

  margin-top: 5px;

`;


const CloseButton = styled.button`

  width: 34px;

  height: 34px;

  border: none;

  border-radius: 8px;

  background: #f1f5f9;

  color: #475569;

  font-size: 22px;

  cursor: pointer;

`;


// =====================================================
// FORM
// =====================================================

const FormGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 16px;

`;


const Field = styled.div`

  display: flex;

  flex-direction: column;

  gap: 7px;

`;


const Label = styled.label`

  color: #334155;

  font-size: 12px;

  font-weight: 800;

`;


const Input = styled.input`

  width: 100%;

  box-sizing: border-box;

  padding: 12px 13px;

  border:
    1px solid #cbd5e1;

  border-radius: 9px;

  font-size: 14px;

  outline: none;

  &:focus {

    border-color: #2563eb;

    box-shadow:
      0 0 0 3px
      rgba(37,99,235,.1);

  }

`;


const Select = styled.select`

  width: 100%;

  box-sizing: border-box;

  padding: 12px 13px;

  border:
    1px solid #cbd5e1;

  border-radius: 9px;

  font-size: 14px;

  background: white;

  outline: none;

`;


const Hint = styled.div`

  color: #94a3b8;

  font-size: 11px;

`;


const ModalActions = styled.div`

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 22px;

`;
// =====================================================
// SALARY EMPLOYEE CARD
// =====================================================

const SalaryEmployeeCard = styled.div`

  display: flex;

  align-items: center;

  gap: 12px;

  background: #f8fafc;

  border:
    1px solid #e2e8f0;

  border-radius: 12px;

  padding: 13px;

  margin-bottom: 18px;

`;


const SalaryEmployeeName = styled.div`

  font-weight: 800;

  color: #172554;

`;


const SalaryEmployeePhone = styled.div`

  font-size: 12px;

  color: #64748b;

  margin-top: 3px;

`;


const CurrentSalary = styled.div`

  margin-left: auto;

  text-align: right;

`;


// =====================================================
// SALARY INFORMATION BOX
// =====================================================

const SalaryInfoBox = styled.div`

  background: #eff6ff;

  border:
    1px solid #bfdbfe;

  border-radius: 10px;

  padding: 13px;

  margin: 18px 0;

  color: #1e3a8a;

  font-size: 12px;

`;


const SalaryInfoTitle = styled.div`

  font-weight: 800;

  font-size: 13px;

`;


const SalaryInfoText = styled.div`

  margin-top: 6px;

  line-height: 1.6;

`;


// =====================================================
// SALARY HISTORY MODAL
// =====================================================

const SalaryHistoryTitle = styled.h3`

  margin: 18px 0 10px;

  color: #172554;

  font-size: 16px;

`;


const SalaryHistoryModal = styled.div`

  border:
    1px solid #e2e8f0;

  border-radius: 10px;

  overflow: hidden;

`;


const SalaryHistoryItem = styled.div`

  padding: 13px 15px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-bottom:
    1px solid #f1f5f9;

  &:last-child {

    border-bottom: none;

  }

`;


const HistoryDate = styled.div`

  color: #64748b;

  font-size: 11px;

  margin-top: 4px;

`;


const UpdatedBy = styled.div`

  background: #f1f5f9;

  color: #475569;

  padding: 5px 8px;

  border-radius: 6px;

  font-size: 10px;

  font-weight: 700;

`;


// =====================================================
// RESPONSIVE DESIGN
// =====================================================

const ResponsiveStyle = styled.div`

  @media (max-width: 1100px) {

    ${MetricsGrid} {

      grid-template-columns:
        repeat(2, 1fr);

    }


    ${EmployeeRow} {

      grid-template-columns:
        1fr;

    }


    ${EmployeeActions} {

      justify-content: flex-start;

    }

  }


  @media (max-width: 800px) {

    ${Page} {

      padding: 15px;

    }


    ${Header} {

      flex-direction: column;

      align-items: flex-start;

    }


    ${AddButton} {

      width: 100%;

    }


    ${RoleTabs} {

      grid-template-columns:
        repeat(2, 1fr);

    }


    ${FormGrid} {

      grid-template-columns:
        1fr;

    }


    ${DetailsHeader} {

      flex-direction: column;

      align-items: flex-start;

      gap: 12px;

    }


    ${HistoryTable} {

      overflow-x: auto;

    }


    ${HistoryHeader},
    ${HistoryRow} {

      min-width: 650px;

    }


    ${ExpenseTable} {

      overflow-x: auto;

    }


    ${ExpenseHeader},
    ${ExpenseRow} {

      min-width: 750px;

    }

  }


  @media (max-width: 550px) {

    ${MetricsGrid} {

      grid-template-columns:
        1fr;

    }


    ${RoleTabs} {

      grid-template-columns:
        1fr;

    }


    ${EmployeeActions} {

      width: 100%;

    }


    ${EmployeeActions} button {

      flex: 1;

    }


    ${SalaryEmployeeCard} {

      flex-wrap: wrap;

    }


    ${CurrentSalary} {

      width: 100%;

      margin-left: 0;

      text-align: left;

    }


    ${BottomActions} {

      flex-direction: column;

    }


    ${BottomActions} button {

      width: 100%;

    }

  }

`;


// =====================================================
// EXPORT
// =====================================================

export default EmployeePage;
