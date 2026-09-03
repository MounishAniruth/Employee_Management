import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../utils/api";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import styled, { createGlobalStyle } from "styled-components";


// =====================================================
// EMPLOYEE ROLES
// =====================================================

const EMPLOYEE_ROLES = [
  "driver",
  "driller",
  "worker",
  "lorry_manager"
];


// =====================================================
// EMPLOYEE PAGE
// =====================================================

const EmployeePage = () => {

  const { id } = useParams();

  const navigate = useNavigate();


  // ===================================================
  // LORRY
  // ===================================================

  const [lorry, setLorry] =
    useState(null);


  // ===================================================
  // ROLES
  // ===================================================

  const roleLabels = {

    driver: "Drivers",

    driller: "Drillers",

    worker: "Workers",

    lorry_manager:
      "Lorry Managers"

  };


  const roleIcons = {

    driver: "🚚",

    driller: "⚙️",

    worker: "👷",

    lorry_manager: "👨‍💼"

  };


  // ===================================================
  // SELECTED ROLE
  // ===================================================

  const [
    selectedRole,
    setSelectedRole
  ] = useState("driver");


  // ===================================================
  // EMPLOYEES
  // ===================================================

  const [
    employees,
    setEmployees
  ] = useState([]);


  const [
    roleCounts,
    setRoleCounts
  ] = useState({
    driver: 0,
    driller: 0,
    worker: 0,
    lorry_manager: 0
  });


  // ===================================================
  // SEARCH
  // ===================================================

  const [
    searchTerm,
    setSearchTerm
  ] = useState("");


  // ===================================================
  // LOADING
  // ===================================================

  const [
    loading,
    setLoading
  ] = useState(false);


  // ===================================================
  // EMPLOYEE DETAILS
  // ===================================================

  const [
    selectedEmployee,
    setSelectedEmployee
  ] = useState(null);


  const [
    showDetails,
    setShowDetails
  ] = useState(false);


  // ===================================================
  // ADD EMPLOYEE
  // ===================================================

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


  // ===================================================
  // ID PROOF
  // ===================================================

  const [idProofFiles, setIdProofFiles] = useState([]);
  const [idProofPreviews, setIdProofPreviews] = useState([]);
  const [selectedIdModal, setSelectedIdModal] = useState(null);
  
  // Lightbox Viewer State
  const [lightboxIndex, setLightboxIndex] = useState(0);


  // ===================================================
  // EXPENSE
  // ===================================================

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


  // ===================================================
  // SALARY
  // ===================================================

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


  const [
    salaryHistory,
    setSalaryHistory
  ] = useState([]);


  const [
    salaryHistoryLoading,
    setSalaryHistoryLoading
  ] = useState(false);


  // ===================================================
  // USER TYPE
  // ===================================================

  const getUserType = () => {

    const directType =
      localStorage.getItem(
        "userType"
      );

    if (directType) {
      return directType;
    }

    try {

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        );

      return (
        user.user_type || ""
      );

    } catch {

      return "";

    }
  };


  const userType =
    getUserType();


  const isOwner =
    userType === "owner";


  // ===================================================
  // UNAUTHORIZED
  // ===================================================

  const handleUnauthorized = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "authToken"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "userId"
    );

    localStorage.removeItem(
      "userType"
    );

    localStorage.removeItem(
      "userName"
    );

    window.location.href =
      "/login";
  };


  // ===================================================
  // FORMAT MONEY
  // ===================================================

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


  // ===================================================
  // FORMAT DATE
  // ===================================================

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


  // ===================================================
  // CALCULATE DAYS
  // ===================================================

  const calculateDays = (
    start,
    end
  ) => {

    if (!start || !end) {
      return 0;
    }

    const startDate =
      new Date(start);

    const endDate =
      new Date(end);

    const difference =
      (
        endDate - startDate
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


  // ===================================================
  // ID PROOF HANDLERS
  // ===================================================

  const handleIdProofChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (idProofFiles.length + files.length > 5) {
      alert("You can upload a maximum of 5 ID proofs.");
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image file.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is larger than 10MB.`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setIdProofFiles([...validFiles]);
    setIdProofPreviews([...newPreviews]);
  };

  const handleRemoveIdProof = (index) => {
    setIdProofFiles((prev) => prev.filter((_, i) => i !== index));
    setIdProofPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };


  // ===================================================
  // FETCH LORRY
  // ===================================================

  const fetchLorry = useCallback(
    async () => {

      try {

        const response =
          await api.get(
            `/lorry/${id}`
          );

        setLorry(
          response.data
        );

      } catch (error) {

        console.error(
          "Error fetching lorry:",
          error
        );

        setLorry(null);

      }

    },
    [id]
  );


  // ===================================================
  // FETCH EMPLOYEES
  // ===================================================

  const fetchEmployeesByRole =
    useCallback(
      async (role) => {

        setLoading(true);

        try {

          const response =
            await api.get(
              `/employee/employeesByRole/${id}/${role}`
            );

          const data =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];

          setEmployees(data);

          setRoleCounts(
            previous => ({
              ...previous,
              [role]:
                data.length
            })
          );

        } catch (error) {

          console.error(
            "Error fetching employees:",
            error
          );

          if (
            error.response?.status ===
            401
          ) {

            handleUnauthorized();

            return;
          }

          setEmployees([]);

        } finally {

          setLoading(false);

        }

      },
      [id]
    );


  // ===================================================
  // FETCH ALL ROLE COUNTS
  // ===================================================

  const fetchAllRoleCounts =
    useCallback(
      async () => {

        const counts = {
          driver: 0,
          driller: 0,
          worker: 0,
          lorry_manager: 0
        };

        try {

          await Promise.all(
            EMPLOYEE_ROLES.map(
              async (role) => {

                try {

                  const response =
                    await api.get(
                      `/employee/employeesByRole/${id}/${role}`
                    );

                  counts[role] =
                    Array.isArray(
                      response.data
                    )
                      ? response.data.length
                      : 0;

                } catch {

                  counts[role] = 0;

                }

              }
            )
          );

          setRoleCounts(
            counts
          );

        } catch (error) {

          console.error(
            "Error fetching counts:",
            error
          );

        }

      },
      [id]
    );


  // ===================================================
  // FETCH EMPLOYEE DETAILS
  // ===================================================

  const fetchEmployeeDetails =
    async (phone) => {

      try {

        setLoading(true);


        const employeeResponse =
          await api.get(
            `/employee/details/${phone}`
          );


        let salaryRecords = [];


        // ---------------------------------------------
        // EXPENSE RECORDS
        // ---------------------------------------------

        try {

          const response =
            await api.get(
              `/salary/salaryDetails/${phone}`
            );

          if (
            Array.isArray(
              response.data
            )
          ) {

            salaryRecords =
              response.data;

          } else if (
            Array.isArray(
              response.data?.records
            )
          ) {

            salaryRecords =
              response.data.records;

          } else if (
            Array.isArray(
              response.data?.data
            )
          ) {

            salaryRecords =
              response.data.data;

          }

        } catch (error) {

          // Silent fallback

        }


        // ---------------------------------------------
        // FIXED SALARY HISTORY
        // ---------------------------------------------

        let fixedSalaryHistory = [];


        try {

          const response =
            await api.get(
              `/salary/fixed/history/${employeeResponse.data.id}`
            );

          if (
            Array.isArray(
              response.data
            )
          ) {

            fixedSalaryHistory =
              response.data;

          } else if (
            Array.isArray(
              response.data?.history
            )
          ) {

            fixedSalaryHistory =
              response.data.history;

          } else if (
            Array.isArray(
              response.data?.data
            )
          ) {

            fixedSalaryHistory =
              response.data.data;

          }

        } catch (error) {

          // Silent fallback

        }


        const employee = {

          ...employeeResponse.data,

          salaryRecords,

          fixedSalaryHistory

        };


        const records =
          salaryRecords;


        const totalExpense =
          records.reduce(
            (
              total,
              record
            ) =>
              total +
              Number(
                record.expense_paid ||
                0
              ),
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
            employee.fixed_salary ||
            0
          );


        const earnedAmount =
          (
            fixedSalary / 30
          ) *
          totalDays;


        employee.metrics = {

          totalExpense,

          totalDays,

          fixedSalary,

          earnedAmount,

          remainingAmount:
            earnedAmount -
            totalExpense

        };


        setSelectedEmployee(
          employee
        );


        setSalaryHistory(
          fixedSalaryHistory
        );


        return employee;

      } catch (error) {

        console.error(
          "Error fetching employee details:",
          error
        );

        if (
          error.response?.status ===
          401
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


  // ===================================================
  // VIEW EMPLOYEE
  // ===================================================

  const handleViewEmployee =
    async (employee) => {

      const result =
        await fetchEmployeeDetails(
          employee.phone
        );

      if (result) {

        setShowDetails(
          true
        );

      }

    };


  // ===================================================
  // CHANGE ROLE
  // ===================================================

  const changeRole = (role) => {

    setSelectedRole(
      role
    );

    setSearchTerm("");

    setSelectedEmployee(
      null
    );

    setShowDetails(
      false
    );

    setEmployeeData(
      previous => ({
        ...previous,
        role
      })
    );

    fetchEmployeesByRole(
      role
    );

  };


  // ===================================================
  // ADD EMPLOYEE
  // ===================================================

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


      try {

        setLoading(true);

        const formData = new FormData();
        formData.append("lorry_id", Number(id));
        formData.append("name", employeeData.name.trim());
        formData.append("phone", employeeData.phone.trim());
        formData.append("role", employeeData.role);
        formData.append("fixed_salary", Number(employeeData.salary || 0));

        if (idProofFiles.length > 0) {
          idProofFiles.forEach(file => {
            formData.append("idProofs", file);
          });
        }

        await api.post(
          "/employee/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );


        alert(
          "Employee added successfully."
        );


        setShowAddForm(
          false
        );


        setEmployeeData({
          name: "",
          phone: "",
          role: selectedRole,
          salary: ""
        });
        setIdProofFiles([]);
        setIdProofPreviews([]);

        await fetchEmployeesByRole(
          selectedRole
        );


        await fetchAllRoleCounts();

      } catch (error) {

        console.error(
          "Error adding employee:",
          error
        );

        if (
          error.response?.status ===
          401
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


  // ===================================================
  // DELETE EMPLOYEE
  // ===================================================

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


        setSelectedEmployee(
          null
        );

        setShowDetails(
          false
        );


        await fetchEmployeesByRole(
          selectedRole
        );

        await fetchAllRoleCounts();

      } catch (error) {

        console.error(
          "Error deleting employee:",
          error
        );

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete employee."
        );

      } finally {

        setLoading(false);

      }

    };


  // ===================================================
  // OPEN EXPENSE
  // ===================================================

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


  // ===================================================
  // UPDATE EXPENSE
  // ===================================================

  const handleUpdateExpense =
    async () => {

      if (
        !updateStartDate ||
        !updateEndDate
      ) {

        alert(
          "Please select both dates."
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


      if (!paymentMethod) {

        alert(
          "Please select payment method."
        );

        return;
      }


      try {

        setLoading(true);


        await api.put(
          `/employee/updateExpense/${updatePhone}`,
          {
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
          "Expense added successfully."
        );


        setShowExpenseForm(
          false
        );


        const refreshed =
          await fetchEmployeeDetails(
            updatePhone
          );


        if (refreshed) {

          setSelectedEmployee(
            refreshed
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

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save expense."
        );

      } finally {

        setLoading(false);

      }

    };


  // ===================================================
  // OPEN SALARY FORM
  // ===================================================

  const openSalaryForm =
    async (employee) => {

      if (!isOwner) {

        alert(
          "Only the owner can update salary."
        );

        return;
      }


      setSalaryEmployee(
        employee
      );


      setNewSalary(
        employee.fixed_salary ||
        ""
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
            : [];


        setSalaryHistory(
          history
        );

      } catch (error) {

        console.error(
          "Salary history error:",
          error
        );

      } finally {

        setSalaryHistoryLoading(
          false
        );

      }

    };


  // ===================================================
  // UPDATE SALARY
  // ===================================================

  const handleUpdateSalary =
    async () => {

      if (!isOwner) {

        alert(
          "Only the owner can update salary."
        );

        return;
      }


      if (
        !salaryEmployee?.id
      ) {

        alert(
          "Employee not found."
        );

        return;
      }


      if (
        newSalary === "" ||
        Number(newSalary) < 0
      ) {

        alert(
          "Enter a valid salary."
        );

        return;
      }


      if (
        !salaryEffectiveFrom
      ) {

        alert(
          "Please select effective date."
        );

        return;
      }


      try {

        setLoading(true);


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
          "Salary updated successfully."
        );


        const refreshed =
          await fetchEmployeeDetails(
            salaryEmployee.phone
          );


        if (refreshed) {

          setSelectedEmployee(
            refreshed
          );

        }


        await fetchEmployeesByRole(
          selectedRole
        );


        await fetchAllRoleCounts();


        setShowSalaryForm(
          false
        );

      } catch (error) {

        console.error(
          "Salary update error:",
          error
        );

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update salary."
        );

      } finally {

        setLoading(false);

      }

    };


  // ===================================================
  // INITIAL DATA
  // ===================================================

  useEffect(() => {

    fetchLorry();

  }, [
    fetchLorry
  ]);


  useEffect(() => {

    fetchEmployeesByRole(
      selectedRole
    );

    fetchAllRoleCounts();

  }, [
    id,
    selectedRole,
    fetchEmployeesByRole,
    fetchAllRoleCounts
  ]);


  // ===================================================
  // FILTERED EMPLOYEES
  // ===================================================

  const filteredEmployees =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      if (!search) {
        return employees;
      }


      return employees.filter(
        employee =>
          employee.name
            ?.toLowerCase()
            .includes(search) ||

          employee.phone
            ?.toLowerCase()
            .includes(search)
      );

    }, [
      employees,
      searchTerm
    ]);


  // ===================================================
  // TOTAL WORKFORCE
  // ===================================================

  const totalWorkforce =
    Object.values(
      roleCounts
    ).reduce(
      (
        total,
        count
      ) =>
        total + count,
      0
    );


  // ===================================================
  // LORRY REGISTRATION
  // ===================================================

  const registrationNumber =
    lorry?.registration_number ||
    `Lorry ${id}`;


  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      <GlobalStyle />
      <ResponsiveStyle />

      <Page>

        {/* =========================================
            TOP HEADER
        ========================================= */}

        <Header>

          <HeaderLeft>

            <BackButton
              onClick={() =>
                navigate(
                  `/dashboard/${id}`
                )
              }
            >
              ←
            </BackButton>


            <TruckIcon>
              🚛
            </TruckIcon>


            <HeaderText>

              <SmallHeading>
                EMPLOYEE MANAGEMENT
              </SmallHeading>


              <PageHeading>
                {registrationNumber}
              </PageHeading>


              <Subtitle>
                Workforce management
                for this rig
              </Subtitle>

            </HeaderText>

          </HeaderLeft>


          <HeaderRight>

            <LorryInfo>

              <LorryInfoLabel>
                LORRY REGISTRATION
              </LorryInfoLabel>


              <LorryRegistration>
                🚛{" "}
                {registrationNumber}
              </LorryRegistration>

            </LorryInfo>


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

          </HeaderRight>

        </Header>


        {/* =========================================
            HERO
        ========================================= */}

        <Hero>

          <HeroContent>

            <HeroEyebrow>
              SRI MURUGAN RIG SERVICE
            </HeroEyebrow>


            <HeroTitle>
              The people behind
              <br />
              every operation.
            </HeroTitle>


            <HeroDescription>
              Manage drivers, drillers,
              workers and lorry managers
              working across your drilling
              operations.
            </HeroDescription>


            <HeroQuote>
              “25 Years of Experience.
              Built on Trust. Driven by
              Service.”
            </HeroQuote>


            <HeroRegistration>

              <span>
                CURRENT LORRY
              </span>

              <strong>
                🚛 {registrationNumber}
              </strong>

            </HeroRegistration>

          </HeroContent>


          <HeroCircle />

          <HeroCircleTwo />

        </Hero>


        {/* =========================================
            OVERVIEW
        ========================================= */}

        <SectionHeader>

          <div>

            <SectionEyebrow>
              WORKFORCE OVERVIEW
            </SectionEyebrow>

            <SectionTitle>
              Employee Management
            </SectionTitle>

            <SectionDescription>
              {registrationNumber} ·
              Current workforce
            </SectionDescription>

          </div>


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

        </SectionHeader>


        {/* =========================================
            METRICS
        ========================================= */}

        <MetricsGrid>

          <MetricCard>

            <MetricIcon>
              👥
            </MetricIcon>

            <MetricContent>

              <MetricLabel>
                TOTAL WORKFORCE
              </MetricLabel>

              <MetricValue>
                {totalWorkforce}
              </MetricValue>

              <MetricHint>
                Employees
              </MetricHint>

            </MetricContent>

          </MetricCard>


          {EMPLOYEE_ROLES.map(
            role => (

              <MetricCard
                key={role}
                $active={
                  selectedRole ===
                  role
                }
                onClick={() =>
                  changeRole(role)
                }
              >

                <MetricIcon>
                  {
                    roleIcons[
                      role
                    ]
                  }
                </MetricIcon>

                <MetricContent>

                  <MetricLabel>
                    {roleLabels[
                      role
                    ].toUpperCase()}
                  </MetricLabel>

                  <MetricValue>
                    {
                      roleCounts[
                        role
                      ]
                    }
                  </MetricValue>

                  <MetricHint>
                    Click to view
                  </MetricHint>

                </MetricContent>

              </MetricCard>

            )
          )}

        </MetricsGrid>


        {/* =========================================
            SEARCH
        ========================================= */}

        <Toolbar>

          <SearchBox>

            <SearchIcon>
              ⌕
            </SearchIcon>


            <SearchInput
              value={
                searchTerm
              }
              onChange={e =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search employee by name or phone number..."
            />


            {searchTerm && (

              <ClearButton
                onClick={() =>
                  setSearchTerm(
                    ""
                  )
                }
              >
                ×
              </ClearButton>

            )}

          </SearchBox>


          <ToolbarText>
            Showing{" "}
            <strong>
              {
                filteredEmployees.length
              }
            </strong>{" "}
            {
              roleLabels[
                selectedRole
              ].toLowerCase()
            }
          </ToolbarText>

        </Toolbar>


        {/* =========================================
            ROLE TABS
        ========================================= */}

        <RoleTabs>

          {EMPLOYEE_ROLES.map(
            role => (

              <RoleTab
                key={role}
                $active={
                  selectedRole ===
                  role
                }
                onClick={() =>
                  changeRole(role)
                }
              >

                <RoleTabIcon>
                  {
                    roleIcons[
                      role
                    ]
                  }
                </RoleTabIcon>


                <RoleTabText>
                  {
                    roleLabels[
                      role
                    ]
                  }
                </RoleTabText>


                <RoleTabCount
                  $active={
                    selectedRole ===
                    role
                  }
                >
                  {
                    roleCounts[
                      role
                    ]
                  }
                </RoleTabCount>

              </RoleTab>

            )
          )}

        </RoleTabs>


        {/* =========================================
            EMPLOYEE SECTION
        ========================================= */}

        <EmployeeSectionHeader>

          <div>

            <EmployeeSectionTitle>
              {
                roleLabels[
                  selectedRole
                ]
              }
            </EmployeeSectionTitle>

            <EmployeeSectionSubtitle>
              {registrationNumber}
            </EmployeeSectionSubtitle>

          </div>


          {loading && (

            <LoadingBadge>
              Loading...
            </LoadingBadge>

          )}

        </EmployeeSectionHeader>


        {/* =========================================
            EMPLOYEE LIST
        ========================================= */}

        {loading &&
        employees.length === 0 ? (

          <EmptyState>

            <LoadingSpinner>
              ◌
            </LoadingSpinner>

            <EmptyTitle>
              Loading employees...
            </EmptyTitle>

            <EmptyDescription>
              Fetching workforce
              information.
            </EmptyDescription>

          </EmptyState>

        ) : filteredEmployees.length ===
          0 ? (

          <EmptyState>

            <EmptyIcon>
              👥
            </EmptyIcon>

            <EmptyTitle>
              No employees found
            </EmptyTitle>

            <EmptyDescription>

              {searchTerm
                ? "No employees match your search."
                : "No employees are assigned to this role yet."}

            </EmptyDescription>


            {!searchTerm && (

              <EmptyAction
                onClick={() =>
                  setShowAddForm(
                    true
                  )
                }
              >
                ＋ Add Employee
              </EmptyAction>

            )}

          </EmptyState>

        ) : (

          <EmployeeGrid>

            {filteredEmployees.map(
              employee => {

                const salary =
                  Number(
                    employee.fixed_salary ||
                    0
                  );


                return (

                  <EmployeeCard
                    key={
                      employee.id
                    }
                  >

                    <EmployeeCardTop>

                      <EmployeeAvatar>
                        {
                          roleIcons[
                            employee.role
                          ]
                        }
                      </EmployeeAvatar>


                      <EmployeeIdentity>

                        <EmployeeName>
                          {
                            employee.name
                          }
                        </EmployeeName>

                        <EmployeePhone>
                          {
                            employee.phone
                          }
                        </EmployeePhone>

                      </EmployeeIdentity>


                      <ActiveStatus>
                        <StatusDot />
                        Active
                      </ActiveStatus>

                    </EmployeeCardTop>


                    <EmployeeInfoRow>

                      <RoleBadge>
                        {
                          roleLabels[
                            employee.role
                          ]
                        }
                      </RoleBadge>


                      <LorryBadge>
                        🚛{" "}
                        {registrationNumber}
                      </LorryBadge>

                    </EmployeeInfoRow>


                    <SalaryPanel>

                      <SalaryLabel>
                        MONTHLY FIXED SALARY
                      </SalaryLabel>


                      <SalaryValue>
                        {salary > 0
                          ? `₹${formatMoney(
                              salary
                            )}`
                          : "Not Assigned"}
                      </SalaryValue>

                    </SalaryPanel>


                    <CardActions>

                      <ViewButton
                        onClick={() =>
                          handleViewEmployee(
                            employee
                          )
                        }
                      >
                        View Details
                        <span>
                          →
                        </span>
                      </ViewButton>

                      {employee.id_proof_urls && (
                        <ViewIdButton
                          onClick={() => setSelectedIdModal(employee)}
                          title="View ID Proofs"
                        >
                          🪪 ID Proof
                        </ViewIdButton>
                      )}


                      <ExpenseButton
                        onClick={() =>
                          openExpenseForm(
                            employee
                          )
                        }
                      >
                        + Expense
                      </ExpenseButton>

                    </CardActions>


                    {isOwner && (

                      <CardFooter>

                        <SalaryButton
                          onClick={() =>
                            openSalaryForm(
                              employee
                            )
                          }
                        >
                          💰 Salary
                        </SalaryButton>


                        <DeleteButton
                          onClick={() =>
                            deleteEmployee(
                              employee
                            )
                          }
                        >
                          Delete
                        </DeleteButton>

                      </CardFooter>

                    )}

                  </EmployeeCard>

                );

              }
            )}

          </EmployeeGrid>

        )}


        {/* =========================================
            EMPLOYEE DETAILS MODAL
        ========================================= */}

        {showDetails &&
          selectedEmployee && (

            <Overlay>

              <DetailsModal>

                <DetailsModalHeader>

                  <div>

                    <DetailsEyebrow>
                      EMPLOYEE PROFILE
                    </DetailsEyebrow>


                    <DetailsModalTitle>
                      Employee Details
                    </DetailsModalTitle>

                  </div>


                  <CloseButton
                    onClick={() =>
                      setShowDetails(
                        false
                      )
                    }
                  >
                    ×
                  </CloseButton>

                </DetailsModalHeader>


                <RegistrationBanner>

                  <RegistrationBannerIcon>
                    🚛
                  </RegistrationBannerIcon>


                  <div>

                    <RegistrationBannerLabel>
                      WORKING WITH LORRY
                    </RegistrationBannerLabel>


                    <RegistrationBannerNumber>
                      {
                        registrationNumber
                      }
                    </RegistrationBannerNumber>

                  </div>

                </RegistrationBanner>


                <ProfileBanner>

                  <ProfileAvatar>
                    {
                      roleIcons[
                        selectedEmployee
                          .role
                      ]
                    }
                  </ProfileAvatar>


                  <ProfileInfo>

                    <ProfileName>
                      {
                        selectedEmployee.name
                      }
                    </ProfileName>


                    <ProfilePhone>
                      {
                        selectedEmployee.phone
                      }
                    </ProfilePhone>


                    <ProfileTags>

                      <ProfileRole>
                        {
                          roleLabels[
                            selectedEmployee
                              .role
                          ]
                        }
                      </ProfileRole>


                      <ActiveTag>
                        ● Active
                      </ActiveTag>

                    </ProfileTags>

                  </ProfileInfo>

                </ProfileBanner>


                <DetailMetrics>

                  <DetailMetric>

                    <DetailMetricIcon>
                      ₹
                    </DetailMetricIcon>

                    <DetailMetricLabel>
                      MONTHLY SALARY
                    </DetailMetricLabel>

                    <DetailMetricValue>
                      {
                        selectedEmployee
                          .metrics
                          ?.fixedSalary >
                        0
                          ? `₹${formatMoney(
                              selectedEmployee
                                .metrics
                                .fixedSalary
                            )}`
                          : "Not Set"
                      }
                    </DetailMetricValue>

                  </DetailMetric>


                  <DetailMetric>

                    <DetailMetricIcon>
                      📅
                    </DetailMetricIcon>

                    <DetailMetricLabel>
                      DAYS WORKED
                    </DetailMetricLabel>

                    <DetailMetricValue>
                      {
                        selectedEmployee
                          .metrics
                          ?.totalDays ||
                        0
                      }
                    </DetailMetricValue>

                  </DetailMetric>


                  <DetailMetric>

                    <DetailMetricIcon>
                      💸
                    </DetailMetricIcon>

                    <DetailMetricLabel>
                      TOTAL EXPENSE
                    </DetailMetricLabel>

                    <DetailMetricValue
                      $danger
                    >
                      ₹
                      {formatMoney(
                        selectedEmployee
                          .metrics
                          ?.totalExpense
                      )}
                    </DetailMetricValue>

                  </DetailMetric>


                  <DetailMetric>

                    <DetailMetricIcon>
                      📈
                    </DetailMetricIcon>

                    <DetailMetricLabel>
                      EARNED AMOUNT
                    </DetailMetricLabel>

                    <DetailMetricValue>
                      ₹
                      {formatMoney(
                        selectedEmployee
                          .metrics
                          ?.earnedAmount
                      )}
                    </DetailMetricValue>

                  </DetailMetric>

                </DetailMetrics>


                <DetailsSection>

                  <DetailsSectionHeader>

                    <div>

                      <DetailsSectionTitle>
                        Salary & Expense History
                      </DetailsSectionTitle>

                      <DetailsSectionSubtitle>
                        Payment records
                      </DetailsSectionSubtitle>

                    </div>


                    <RecordCount>
                      {
                        selectedEmployee
                          .salaryRecords
                          ?.length ||
                        0
                      }{" "}
                      Records
                    </RecordCount>

                  </DetailsSectionHeader>


                  {
                    selectedEmployee
                      .salaryRecords
                      ?.length > 0 ? (

                      <HistoryScroll>

                        <HistoryTable>

                          <HistoryHead>

                            <span>
                              Start
                            </span>

                            <span>
                              End
                            </span>

                            <span>
                              Days
                            </span>

                            <span>
                              Expense
                            </span>

                            <span>
                              Method
                            </span>

                          </HistoryHead>


                          {
                            selectedEmployee
                              .salaryRecords
                              .map(
                                record => (

                                  <HistoryRow
                                    key={
                                      record.id
                                    }
                                  >

                                    <span>
                                      {
                                        formatDate(
                                          record.start_date
                                        )
                                      }
                                    </span>


                                    <span>
                                      {
                                        formatDate(
                                          record.end_date
                                        )
                                      }
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


                                    <PaymentTag>
                                      {
                                        record.expense_payment_method ||
                                        "N/A"
                                      }
                                    </PaymentTag>

                                  </HistoryRow>

                                )
                              )
                          }

                        </HistoryTable>

                      </HistoryScroll>

                    ) : (

                      <NoHistory>
                        No expense records
                        available.
                      </NoHistory>

                    )
                  }

                </DetailsSection>


                <DetailsSection>

                  <DetailsSectionHeader>

                    <div>

                      <DetailsSectionTitle>
                        Fixed Salary History
                      </DetailsSectionTitle>

                      <DetailsSectionSubtitle>
                        Salary changes
                      </DetailsSectionSubtitle>

                    </div>

                  </DetailsSectionHeader>


                  {
                    selectedEmployee
                      .fixedSalaryHistory
                      ?.length > 0 ? (

                      <SalaryHistoryList>

                        {
                          selectedEmployee
                            .fixedSalaryHistory
                            .map(
                              record => (

                                <SalaryHistoryRow
                                  key={
                                    record.id
                                  }
                                >

                                  <SalaryHistoryAmount>
                                    ₹
                                    {formatMoney(
                                      record.fixed_salary
                                    )}
                                  </SalaryHistoryAmount>


                                  <SalaryHistoryDate>
                                    From{" "}
                                    {
                                      formatDate(
                                        record.effective_from
                                      )
                                    }

                                    {" — "}

                                    {
                                      record.effective_to
                                        ? `To ${formatDate(
                                            record.effective_to
                                          )}`
                                        : "Current"
                                    }
                                  </SalaryHistoryDate>


                                  <UpdatedBadge>
                                    {
                                      record.updated_by_name ||
                                      "Owner"
                                    }
                                  </UpdatedBadge>

                                </SalaryHistoryRow>

                              )
                            )
                        }

                      </SalaryHistoryList>

                    ) : (

                      <NoHistory>
                        No salary history
                        available.
                      </NoHistory>

                    )
                  }

                </DetailsSection>


                <DetailsActions>

                  <LargeExpenseButton
                    onClick={() =>
                      openExpenseForm(
                        selectedEmployee
                      )
                    }
                  >
                    ＋ Add Expense
                  </LargeExpenseButton>


                  {isOwner && (

                    <LargeSalaryButton
                      onClick={() =>
                        openSalaryForm(
                          selectedEmployee
                        )
                      }
                    >
                      💰 Update Salary
                    </LargeSalaryButton>

                  )}

                </DetailsActions>

              </DetailsModal>

            </Overlay>

          )}
                  {/* =========================================
            ADD EMPLOYEE MODAL
        ========================================= */}

        {showAddForm && (

          <Overlay>

            <FormModal>

              <ModalHeader>

                <div>

                  <ModalEyebrow>
                    NEW EMPLOYEE
                  </ModalEyebrow>

                  <ModalTitle>
                    Add Employee
                  </ModalTitle>

                  <ModalSubtitle>
                    Add a new employee to{" "}
                    {registrationNumber}
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


              {/* =====================================
                  LORRY IDENTIFICATION
              ===================================== */}

              <FormLorryBanner>

                <FormLorryIcon>
                  🚛
                </FormLorryIcon>


                <div>

                  <FormLorryLabel>
                    ASSIGNING EMPLOYEE TO
                  </FormLorryLabel>

                  <FormLorryNumber>
                    {registrationNumber}
                  </FormLorryNumber>

                </div>

              </FormLorryBanner>


              {/* =====================================
                  NAME
              ===================================== */}

              <FormGroup>

                <FormLabel>
                  Employee Name
                </FormLabel>


                <FormInput
                  type="text"
                  value={
                    employeeData.name
                  }
                  onChange={e =>
                    setEmployeeData(
                      previous => ({
                        ...previous,
                        name:
                          e.target.value
                      })
                    )
                  }
                  placeholder="Enter employee full name"
                />

              </FormGroup>


              {/* =====================================
                  PHONE
              ===================================== */}

              <FormGroup>

                <FormLabel>
                  Phone Number
                </FormLabel>


                <FormInput
                  type="tel"
                  value={
                    employeeData.phone
                  }
                  onChange={e =>
                    setEmployeeData(
                      previous => ({
                        ...previous,
                        phone:
                          e.target.value
                      })
                    )
                  }
                  placeholder="Enter phone number"
                  maxLength={10}
                />

              </FormGroup>


              {/* =====================================
                  ROLE
              ===================================== */}

              <FormGroup>

                <FormLabel>
                  Employee Role
                </FormLabel>


                <FormSelect
                  value={
                    employeeData.role
                  }
                  onChange={e =>
                    setEmployeeData(
                      previous => ({
                        ...previous,
                        role:
                          e.target.value
                      })
                    )
                  }
                >

                  {EMPLOYEE_ROLES.map(
                    role => (

                      <option
                        key={role}
                        value={role}
                      >
                        {
                          roleLabels[
                            role
                          ]
                        }
                      </option>

                    )
                  )}

                </FormSelect>

              </FormGroup>


              {/* =====================================
                  SALARY
              ===================================== */}

              <FormGroup>

                <FormLabel>
                  Monthly Fixed Salary
                </FormLabel>


                <MoneyInputWrapper>

                  <MoneyPrefix>
                    ₹
                  </MoneyPrefix>


                  <FormInput
                    type="number"
                    min="0"
                    value={
                      employeeData.salary
                    }
                    onChange={e =>
                      setEmployeeData(
                        previous => ({
                          ...previous,
                          salary:
                            e.target.value
                        })
                      )
                    }
                    placeholder="Enter monthly salary"
                  />

                </MoneyInputWrapper>

              </FormGroup>


              {/* =====================================
                  ID PROOF UPLOAD
              ===================================== */}

              <FormGroup>
                <IdProofUploadCard>
                  <IdProofUploadHeader>
                    <IdProofUploadTitle>
                      📸 Upload ID Proofs
                    </IdProofUploadTitle>
                    <IdProofUploadSubtitle>
                      Aadhar Card, Driving License (Max 5 images)
                    </IdProofUploadSubtitle>
                  </IdProofUploadHeader>

                  {idProofPreviews.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      {idProofPreviews.map((previewUrl, idx) => (
                        <IdProofPreviewContainer key={idx}>
                          <IdProofPreviewImage src={previewUrl} alt={`Preview ${idx + 1}`} />
                          <IdProofPreviewInfo>
                            <IdProofFileName>
                              {idProofFiles[idx]?.name || `Image ${idx + 1}`}
                            </IdProofFileName>
                            <IdProofFileSize>
                              {idProofFiles[idx]?.size
                                ? (idProofFiles[idx].size / 1024 / 1024).toFixed(2) + " MB"
                                : ""}
                            </IdProofFileSize>
                            <RemoveIdProofButton type="button" onClick={() => handleRemoveIdProof(idx)}>
                              Remove
                            </RemoveIdProofButton>
                          </IdProofPreviewInfo>
                        </IdProofPreviewContainer>
                      ))}
                    </div>
                  )}

                  {idProofPreviews.length < 5 && (
                    <UploadDropzone>
                      <UploadTrigger>
                        <UploadIcon>📷</UploadIcon>
                        <UploadText>
                          Tap to <strong>Capture</strong> or <strong>Upload</strong>
                        </UploadText>
                        <UploadHint>
                          Max size: 10MB per image
                        </UploadHint>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: "none" }}
                          onChange={handleIdProofChange}
                        />
                      </UploadTrigger>
                    </UploadDropzone>
                  )}
                </IdProofUploadCard>
              </FormGroup>


              {/* =====================================
                  ACTIONS
              ===================================== */}

              <ModalActions>

                <CancelButton
                  onClick={() =>
                    setShowAddForm(
                      false
                    )
                  }
                >
                  Cancel
                </CancelButton>


                <PrimaryModalButton
                  onClick={
                    addEmployee
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Adding..."
                    : "Add Employee"}
                </PrimaryModalButton>

              </ModalActions>

            </FormModal>

          </Overlay>

        )}


        {/* =========================================
            EXPENSE MODAL
        ========================================= */}

        {showExpenseForm && (

          <Overlay>

            <FormModal>

              <ModalHeader>

                <div>

                  <ModalEyebrow>
                    EMPLOYEE EXPENSE
                  </ModalEyebrow>

                  <ModalTitle>
                    Add Expense
                  </ModalTitle>

                  <ModalSubtitle>
                    Record work-period expense
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


              {/* =====================================
                  EMPLOYEE
              ===================================== */}

              <SelectedEmployeeBanner>

                <SelectedAvatar>
                  {
                    roleIcons[
                      selectedEmployee?.role ||
                      selectedRole
                    ]
                  }
                </SelectedAvatar>


                <div>

                  <SelectedEmployeeName>
                    {
                      selectedEmployee?.name ||
                      updatePhone
                    }
                  </SelectedEmployeeName>


                  <SelectedEmployeePhone>
                    {updatePhone}
                  </SelectedEmployeePhone>

                </div>

              </SelectedEmployeeBanner>


              {/* =====================================
                  LORRY
              ===================================== */}

              <FormLorryBanner>

                <FormLorryIcon>
                  🚛
                </FormLorryIcon>


                <div>

                  <FormLorryLabel>
                    LORRY
                  </FormLorryLabel>

                  <FormLorryNumber>
                    {registrationNumber}
                  </FormLorryNumber>

                </div>

              </FormLorryBanner>


              {/* =====================================
                  START DATE
              ===================================== */}

              <FormRow>

                <FormGroup>

                  <FormLabel>
                    Start Date
                  </FormLabel>


                  <FormInput
                    type="date"
                    value={
                      updateStartDate
                    }
                    onChange={e =>
                      setUpdateStartDate(
                        e.target.value
                      )
                    }
                  />

                </FormGroup>


                {/* ===================================
                    END DATE
                =================================== */}

                <FormGroup>

                  <FormLabel>
                    End Date
                  </FormLabel>


                  <FormInput
                    type="date"
                    value={
                      updateEndDate
                    }
                    onChange={e =>
                      setUpdateEndDate(
                        e.target.value
                      )
                    }
                  />

                </FormGroup>

              </FormRow>


              {/* =====================================
                  DAYS PREVIEW
              ===================================== */}

              {updateStartDate &&
                updateEndDate && (

                  <DaysPreview>

                    <DaysPreviewIcon>
                      📅
                    </DaysPreviewIcon>


                    <div>

                      <DaysPreviewLabel>
                        WORKING PERIOD
                      </DaysPreviewLabel>


                      <DaysPreviewValue>
                        {
                          calculateDays(
                            updateStartDate,
                            updateEndDate
                          )
                        }{" "}
                        day
                        {
                          calculateDays(
                            updateStartDate,
                            updateEndDate
                          ) !== 1
                            ? "s"
                            : ""
                        }
                      </DaysPreviewValue>

                    </div>

                  </DaysPreview>

                )}


              {/* =====================================
                  EXPENSE
              ===================================== */}

              <FormGroup>

                <FormLabel>
                  Expense Amount
                </FormLabel>


                <MoneyInputWrapper>

                  <MoneyPrefix>
                    ₹
                  </MoneyPrefix>


                  <FormInput
                    type="number"
                    min="0"
                    value={
                      expensePaid
                    }
                    onChange={e =>
                      setExpensePaid(
                        e.target.value
                      )
                    }
                    placeholder="Enter amount paid"
                  />

                </MoneyInputWrapper>

              </FormGroup>


              {/* =====================================
                  PAYMENT METHOD
              ===================================== */}

              <FormGroup>

                <FormLabel>
                  Payment Method
                </FormLabel>


                <FormSelect
                  value={
                    paymentMethod
                  }
                  onChange={e =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select payment method
                  </option>


                  <option value="Cash">
                    Cash
                  </option>


                  <option value="UPI">
                    UPI
                  </option>


                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>


                  <option value="Cheque">
                    Cheque
                  </option>

                </FormSelect>

              </FormGroup>


              {/* =====================================
                  ACTIONS
              ===================================== */}

              <ModalActions>

                <CancelButton
                  onClick={() =>
                    setShowExpenseForm(
                      false
                    )
                  }
                >
                  Cancel
                </CancelButton>


                <PrimaryModalButton
                  onClick={
                    handleUpdateExpense
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "Save Expense"}
                </PrimaryModalButton>

              </ModalActions>

            </FormModal>

          </Overlay>

        )}


        {/* =========================================
            SALARY MODAL
        ========================================= */}

        {showSalaryForm &&
          salaryEmployee && (

            <Overlay>

              <FormModal>

                <ModalHeader>

                  <div>

                    <ModalEyebrow>
                      SALARY MANAGEMENT
                    </ModalEyebrow>

                    <ModalTitle>
                      Update Salary
                    </ModalTitle>

                    <ModalSubtitle>
                      Change the fixed monthly
                      salary for this employee.
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


                {/* =================================
                    EMPLOYEE
                ================================= */}

                <SelectedEmployeeBanner>

                  <SelectedAvatar>
                    {
                      roleIcons[
                        salaryEmployee
                          .role
                      ]
                    }
                  </SelectedAvatar>


                  <div>

                    <SelectedEmployeeName>
                      {
                        salaryEmployee
                          .name
                      }
                    </SelectedEmployeeName>


                    <SelectedEmployeePhone>
                      {
                        salaryEmployee
                          .phone
                      }
                    </SelectedEmployeePhone>

                  </div>

                </SelectedEmployeeBanner>


                {/* =================================
                    LORRY
                ================================= */}

                <FormLorryBanner>

                  <FormLorryIcon>
                    🚛
                  </FormLorryIcon>


                  <div>

                    <FormLorryLabel>
                      ASSIGNED LORRY
                    </FormLorryLabel>


                    <FormLorryNumber>
                      {registrationNumber}
                    </FormLorryNumber>

                  </div>

                </FormLorryBanner>


                {/* =================================
                    NEW SALARY
                ================================= */}

                <FormGroup>

                  <FormLabel>
                    New Monthly Salary
                  </FormLabel>


                  <MoneyInputWrapper>

                    <MoneyPrefix>
                      ₹
                    </MoneyPrefix>


                    <FormInput
                      type="number"
                      min="0"
                      value={
                        newSalary
                      }
                      onChange={e =>
                        setNewSalary(
                          e.target.value
                        )
                      }
                      placeholder="Enter new salary"
                    />

                  </MoneyInputWrapper>

                </FormGroup>


                {/* =================================
                    EFFECTIVE DATE
                ================================= */}

                <FormGroup>

                  <FormLabel>
                    Effective From
                  </FormLabel>


                  <FormInput
                    type="date"
                    value={
                      salaryEffectiveFrom
                    }
                    onChange={e =>
                      setSalaryEffectiveFrom(
                        e.target.value
                      )
                    }
                  />

                </FormGroup>


                {/* =================================
                    SALARY HISTORY
                ================================= */}

                <HistoryPreview>

                  <HistoryPreviewHeader>

                    <HistoryPreviewTitle>
                      Previous Salary Changes
                    </HistoryPreviewTitle>


                    {salaryHistoryLoading && (

                      <HistoryLoading>
                        Loading...
                      </HistoryLoading>

                    )}

                  </HistoryPreviewHeader>


                  {!salaryHistoryLoading &&
                  salaryHistory.length ===
                    0 ? (

                    <NoHistorySmall>
                      No previous salary
                      changes found.
                    </NoHistorySmall>

                  ) : (

                    <SalaryHistoryMiniList>

                      {salaryHistory.map(
                        record => (

                          <SalaryHistoryMiniRow
                            key={
                              record.id
                            }
                          >

                            <div>

                              <MiniSalaryAmount>
                                ₹
                                {formatMoney(
                                  record.fixed_salary
                                )}
                              </MiniSalaryAmount>


                              <MiniSalaryDate>
                                From{" "}
                                {formatDate(
                                  record.effective_from
                                )}
                              </MiniSalaryDate>

                            </div>


                            <MiniCurrentBadge>
                              {
                                record.effective_to
                                  ? "Past"
                                  : "Current"
                              }
                            </MiniCurrentBadge>

                          </SalaryHistoryMiniRow>

                        )
                      )}

                    </SalaryHistoryMiniList>

                  )}

                </HistoryPreview>


                {/* =================================
                    ACTIONS
                ================================= */}

                <ModalActions>

                  <CancelButton
                    onClick={() =>
                      setShowSalaryForm(
                        false
                      )
                    }
                  >
                    Cancel
                  </CancelButton>


                  <PrimaryModalButton
                    onClick={
                      handleUpdateSalary
                    }
                    disabled={loading}
                  >
                    {loading
                      ? "Updating..."
                      : "Update Salary"}
                  </PrimaryModalButton>

                </ModalActions>

              </FormModal>

            </Overlay>

          )}


        {/* =================================================
            ID PROOF PREVIEW MODAL (LIGHTBOX)
        ================================================= */}
        {selectedIdModal && (() => {
          let urls = [];
          if (selectedIdModal.id_proof_urls) {
            urls = Array.isArray(selectedIdModal.id_proof_urls) 
              ? selectedIdModal.id_proof_urls 
              : (() => { try { return JSON.parse(selectedIdModal.id_proof_urls); } catch(e) { return []; }})();
          }

          if (urls.length === 0) return null;

          return (
            <IdProofModalOverlay onClick={() => { setSelectedIdModal(null); setLightboxIndex(0); }}>
              <IdProofModalContent onClick={(e) => e.stopPropagation()}>
                <IdProofModalHeader>
                  <div>
                    <IdProofModalTitle>Employee ID Proofs ({lightboxIndex + 1} of {urls.length})</IdProofModalTitle>
                    <IdProofModalMeta>
                      {selectedIdModal.name} • {selectedIdModal.role.toUpperCase()}
                    </IdProofModalMeta>
                  </div>
                  <IdProofModalClose onClick={() => { setSelectedIdModal(null); setLightboxIndex(0); }}>
                    ✕
                  </IdProofModalClose>
                </IdProofModalHeader>
                <IdProofModalBody style={{ position: 'relative' }}>
                  {urls.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev === 0 ? urls.length - 1 : prev - 1)); }}
                      style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 18 }}
                    >
                      ❮
                    </button>
                  )}
                  <IdProofModalImg
                    src={urls[lightboxIndex]}
                    alt={`ID proof for ${selectedIdModal.name} - ${lightboxIndex + 1}`}
                    referrerPolicy="no-referrer"
                    style={{ maxHeight: '75vh', cursor: 'zoom-in' }}
                    onClick={(e) => {
                      if (!document.fullscreenElement) {
                        e.target.requestFullscreen().catch(err => console.log(err));
                      } else {
                        document.exitFullscreen();
                      }
                    }}
                  />
                  {urls.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev === urls.length - 1 ? 0 : prev + 1)); }}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 18 }}
                    >
                      ❯
                    </button>
                  )}
                </IdProofModalBody>
                <IdProofModalFooter style={{ justifyContent: 'center' }}>
                  <IdProofModalDoneBtn onClick={() => { setSelectedIdModal(null); setLightboxIndex(0); }} style={{ width: '100%' }}>
                    Close Viewer
                  </IdProofModalDoneBtn>
                </IdProofModalFooter>
              </IdProofModalContent>
            </IdProofModalOverlay>
          );
        })()}


      </Page>
    </>
  );
};


// =====================================================
// GLOBAL STYLE
// =====================================================

const GlobalStyle = createGlobalStyle`

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    background: #f4f7f5;
  }

`;


// =====================================================
// MAIN PAGE
// =====================================================

const Page = styled.div`

  min-height: 100vh;

  padding: 30px 42px 70px;

  background:

    radial-gradient(
      circle at 10% 0%,
      rgba(34, 197, 94, 0.08),
      transparent 30%
    ),

    radial-gradient(
      circle at 90% 10%,
      rgba(20, 184, 166, 0.07),
      transparent 28%
    ),

    linear-gradient(
      135deg,
      #f8faf9 0%,
      #eef4f0 100%
    );

`;


// =====================================================
// HEADER
// =====================================================

const Header = styled.header`

  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;

  padding: 26px 30px;

  margin-bottom: 28px;

  background:
    rgba(255, 255, 255, 0.94);

  border:
    1px solid #dce7e1;

  border-radius: 22px;

  box-shadow:
    0 12px 35px
    rgba(15, 23, 42, 0.07);

`;


// =====================================================
// HEADER LEFT
// =====================================================

const HeaderLeft = styled.div`

  display: flex;

  align-items: center;

  gap: 18px;

  min-width: 0;

`;


// =====================================================
// BACK BUTTON
// =====================================================

const BackButton = styled.button`

  width: 50px;

  height: 50px;

  border: none;

  border-radius: 15px;

  background: #ecfdf5;

  color: #166534;

  font-size: 25px;

  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {

    background: #dcfce7;

    transform:
      translateX(-3px);

  }

`;


// =====================================================
// TRUCK ICON
// =====================================================

const TruckIcon = styled.div`

  width: 62px;

  height: 62px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 18px;

  background:
    linear-gradient(
      135deg,
      #166534,
      #15803d
    );

  color: white;

  font-size: 31px;

  box-shadow:
    0 10px 22px
    rgba(22, 101, 52, 0.2);

`;


// =====================================================
// HEADER TEXT
// =====================================================

const HeaderText = styled.div`

  min-width: 0;

`;


// =====================================================
// SMALL HEADING
// =====================================================

const SmallHeading = styled.div`

  color: #64748b;

  font-size: 12px;

  font-weight: 900;

  letter-spacing: 1.8px;

  margin-bottom: 5px;

`;


// =====================================================
// PAGE HEADING
// =====================================================

const PageHeading = styled.h1`

  margin: 0;

  color: #172554;

  font-size: 34px;

  line-height: 1.1;

  font-weight: 900;

  letter-spacing: -0.8px;

`;


// =====================================================
// SUBTITLE
// =====================================================

const Subtitle = styled.div`

  margin-top: 7px;

  color: #64748b;

  font-size: 15px;

  font-weight: 500;

`;


// =====================================================
// HEADER RIGHT
// =====================================================

const HeaderRight = styled.div`

  display: flex;

  align-items: center;

  gap: 18px;

`;


// =====================================================
// LORRY INFO
// =====================================================

const LorryInfo = styled.div`

  min-width: 220px;

  padding: 13px 18px;

  background:
    linear-gradient(
      135deg,
      #f0fdf4,
      #ecfdf5
    );

  border:
    1px solid #bbf7d0;

  border-radius: 15px;

`;


// =====================================================
// LORRY INFO LABEL
// =====================================================

const LorryInfoLabel = styled.div`

  color: #64748b;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 1.3px;

  margin-bottom: 5px;

`;


// =====================================================
// LORRY REGISTRATION
// =====================================================

const LorryRegistration = styled.div`

  color: #14532d;

  font-size: 21px;

  font-weight: 900;

  letter-spacing: 0.7px;

`;


// =====================================================
// ADD BUTTON
// =====================================================

const AddButton = styled.button`

  min-height: 50px;

  padding: 0 22px;

  border: none;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #166534,
      #15803d
    );

  color: white;

  font-size: 15px;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 9px 22px
    rgba(22, 101, 52, 0.18);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {

    transform:
      translateY(-2px);

    box-shadow:
      0 13px 28px
      rgba(22, 101, 52, 0.24);

  }

`;
// =====================================================
// HERO
// =====================================================

const Hero = styled.section`

  position: relative;

  min-height: 330px;

  display: flex;

  align-items: center;

  overflow: hidden;

  padding: 50px 55px;

  margin-bottom: 35px;

  border-radius: 28px;

  background:
    linear-gradient(
      120deg,
      #12372a 0%,
      #1f513c 48%,
      #2d6a4f 100%
    );

  box-shadow:
    0 20px 45px
    rgba(18, 55, 42, 0.18);

`;


// =====================================================
// HERO CONTENT
// =====================================================

const HeroContent = styled.div`

  position: relative;

  z-index: 3;

  max-width: 720px;

`;


// =====================================================
// HERO EYEBROW
// =====================================================

const HeroEyebrow = styled.div`

  color: #bbf7d0;

  font-size: 13px;

  font-weight: 900;

  letter-spacing: 2.2px;

  margin-bottom: 12px;

`;


// =====================================================
// HERO TITLE
// =====================================================

const HeroTitle = styled.h2`

  margin: 0;

  color: #ffffff;

  font-size: 46px;

  line-height: 1.08;

  font-weight: 900;

  letter-spacing: -1.5px;

`;


// =====================================================
// HERO DESCRIPTION
// =====================================================

const HeroDescription = styled.p`

  max-width: 610px;

  margin: 18px 0 0;

  color: #dcefe4;

  font-size: 17px;

  line-height: 1.7;

`;


// =====================================================
// HERO QUOTE
// =====================================================

const HeroQuote = styled.div`

  display: inline-flex;

  margin-top: 22px;

  padding: 11px 16px;

  border-left:
    3px solid #86efac;

  color: #f0fdf4;

  background:
    rgba(255, 255, 255, 0.07);

  border-radius: 0 10px 10px 0;

  font-size: 14px;

  font-weight: 700;

  font-style: italic;

`;


// =====================================================
// HERO REGISTRATION
// =====================================================

const HeroRegistration = styled.div`

  display: flex;

  align-items: center;

  gap: 14px;

  margin-top: 25px;

  color: #ffffff;

  span {

    color: #a7f3d0;

    font-size: 10px;

    font-weight: 900;

    letter-spacing: 1.4px;

  }

  strong {

    padding: 9px 15px;

    border-radius: 10px;

    background:
      rgba(255, 255, 255, 0.12);

    border:
      1px solid
      rgba(255, 255, 255, 0.15);

    font-size: 17px;

    letter-spacing: 0.8px;

  }

`;


// =====================================================
// HERO CIRCLES
// =====================================================

const HeroCircle = styled.div`

  position: absolute;

  right: -100px;

  top: -150px;

  width: 470px;

  height: 470px;

  border-radius: 50%;

  border:
    1px solid
    rgba(255, 255, 255, 0.12);

  box-shadow:
    inset 0 0 80px
    rgba(255, 255, 255, 0.04);

`;


// =====================================================
// HERO SECOND CIRCLE
// =====================================================

const HeroCircleTwo = styled.div`

  position: absolute;

  right: 70px;

  bottom: -210px;

  width: 430px;

  height: 430px;

  border-radius: 50%;

  border:
    1px solid
    rgba(255, 255, 255, 0.09);

`;


// =====================================================
// SECTION HEADER
// =====================================================

const SectionHeader = styled.div`

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 25px;

  margin-bottom: 22px;

`;


// =====================================================
// SECTION EYEBROW
// =====================================================

const SectionEyebrow = styled.div`

  color: #3f6f5a;

  font-size: 11px;

  font-weight: 900;

  letter-spacing: 1.7px;

  margin-bottom: 6px;

`;


// =====================================================
// SECTION TITLE
// =====================================================

const SectionTitle = styled.h2`

  margin: 0;

  color: #172554;

  font-size: 31px;

  font-weight: 900;

  letter-spacing: -0.7px;

`;


// =====================================================
// SECTION DESCRIPTION
// =====================================================

const SectionDescription = styled.div`

  margin-top: 7px;

  color: #64748b;

  font-size: 15px;

`;


// =====================================================
// METRICS GRID
// =====================================================

const MetricsGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  gap: 18px;

  margin-bottom: 30px;

`;


// =====================================================
// METRIC CARD
// =====================================================

const MetricCard = styled.button`

  min-height: 145px;

  display: flex;

  align-items: center;

  gap: 16px;

  padding: 23px;

  text-align: left;

  border:
    1px solid
    ${({ $active }) =>
      $active
        ? "#86efac"
        : "#dce7e1"};

  border-radius: 20px;

  background:
    ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #f0fdf4, #ecfdf5)"
        : "#ffffff"};

  box-shadow:
    0 9px 25px
    rgba(15, 23, 42, 0.055);

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {

    transform:
      translateY(-4px);

    box-shadow:
      0 15px 30px
      rgba(15, 23, 42, 0.09);

  }

`;


// =====================================================
// METRIC ICON
// =====================================================

const MetricIcon = styled.div`

  width: 54px;

  height: 54px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 16px;

  background:
    #ecfdf5;

  font-size: 26px;

`;


// =====================================================
// METRIC CONTENT
// =====================================================

const MetricContent = styled.div`

  min-width: 0;

`;


// =====================================================
// METRIC LABEL
// =====================================================

const MetricLabel = styled.div`

  color: #64748b;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 1px;

  line-height: 1.4;

`;


// =====================================================
// METRIC VALUE
// =====================================================

const MetricValue = styled.div`

  margin-top: 5px;

  color: #172554;

  font-size: 31px;

  font-weight: 900;

  line-height: 1;

`;


// =====================================================
// METRIC HINT
// =====================================================

const MetricHint = styled.div`

  margin-top: 7px;

  color: #94a3b8;

  font-size: 11px;

`;


// =====================================================
// TOOLBAR
// =====================================================

const Toolbar = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 18px;

`;


// =====================================================
// SEARCH BOX
// =====================================================

const SearchBox = styled.div`

  width: min(560px, 100%);

  min-height: 58px;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 0 17px;

  background: #ffffff;

  border:
    1px solid #dce7e1;

  border-radius: 15px;

  box-shadow:
    0 6px 20px
    rgba(15, 23, 42, 0.045);

`;


// =====================================================
// SEARCH ICON
// =====================================================

const SearchIcon = styled.div`

  color: #64748b;

  font-size: 27px;

  line-height: 1;

`;


// =====================================================
// SEARCH INPUT
// =====================================================

const SearchInput = styled.input`

  flex: 1;

  min-width: 0;

  border: none;

  outline: none;

  background: transparent;

  color: #172554;

  font-size: 15px;

  font-weight: 500;

  &::placeholder {

    color: #94a3b8;

  }

`;


// =====================================================
// CLEAR BUTTON
// =====================================================

const ClearButton = styled.button`

  width: 30px;

  height: 30px;

  border: none;

  border-radius: 50%;

  background: #f1f5f9;

  color: #64748b;

  font-size: 20px;

  cursor: pointer;

`;


// =====================================================
// TOOLBAR TEXT
// =====================================================

const ToolbarText = styled.div`

  color: #64748b;

  font-size: 14px;

  white-space: nowrap;

  strong {

    color: #172554;

    font-weight: 900;

  }

`;


// =====================================================
// ROLE TABS
// =====================================================

const RoleTabs = styled.div`

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 14px;

  margin-bottom: 32px;

`;


// =====================================================
// ROLE TAB
// =====================================================

const RoleTab = styled.button`

  min-height: 74px;

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 13px 17px;

  border:
    1px solid
    ${({ $active }) =>
      $active
        ? "#86efac"
        : "#dce7e1"};

  border-radius: 16px;

  background:
    ${({ $active }) =>
      $active
        ? "#f0fdf4"
        : "#ffffff"};

  cursor: pointer;

  transition:
    all 0.2s ease;

  &:hover {

    transform:
      translateY(-2px);

    border-color:
      #86efac;

  }

`;


// =====================================================
// ROLE TAB ICON
// =====================================================

const RoleTabIcon = styled.div`

  width: 43px;

  height: 43px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #f1f5f9;

  font-size: 22px;

`;


// =====================================================
// ROLE TAB TEXT
// =====================================================

const RoleTabText = styled.div`

  flex: 1;

  text-align: left;

  color: #334155;

  font-size: 14px;

  font-weight: 800;

`;


// =====================================================
// ROLE TAB COUNT
// =====================================================

const RoleTabCount = styled.div`

  min-width: 34px;

  height: 34px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background:
    ${({ $active }) =>
      $active
        ? "#166534"
        : "#f1f5f9"};

  color:
    ${({ $active }) =>
      $active
        ? "#ffffff"
        : "#475569"};

  font-size: 13px;

  font-weight: 900;

`;


// =====================================================
// EMPLOYEE SECTION HEADER
// =====================================================

const EmployeeSectionHeader = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 20px;

`;


// =====================================================
// EMPLOYEE SECTION TITLE
// =====================================================

const EmployeeSectionTitle = styled.h3`

  margin: 0;

  color: #172554;

  font-size: 25px;

  font-weight: 900;

`;


// =====================================================
// EMPLOYEE SECTION SUBTITLE
// =====================================================

const EmployeeSectionSubtitle = styled.div`

  margin-top: 5px;

  color: #64748b;

  font-size: 13px;

  font-weight: 600;

`;


// =====================================================
// LOADING BADGE
// =====================================================

const LoadingBadge = styled.div`

  padding: 8px 13px;

  border-radius: 9px;

  background: #ecfdf5;

  color: #166534;

  font-size: 12px;

  font-weight: 800;

`;


// =====================================================
// EMPLOYEE GRID
// =====================================================

const EmployeeGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 22px;

`;


// =====================================================
// EMPLOYEE CARD
// =====================================================

const EmployeeCard = styled.article`

  padding: 24px;

  background: #ffffff;

  border:
    1px solid #dce7e1;

  border-radius: 22px;

  box-shadow:
    0 9px 27px
    rgba(15, 23, 42, 0.055);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;

  &:hover {

    transform:
      translateY(-5px);

    box-shadow:
      0 18px 35px
      rgba(15, 23, 42, 0.10);

  }

`;


// =====================================================
// EMPLOYEE CARD TOP
// =====================================================

const EmployeeCardTop = styled.div`

  display: flex;

  align-items: center;

  gap: 14px;

`;


// =====================================================
// EMPLOYEE AVATAR
// =====================================================

const EmployeeAvatar = styled.div`

  width: 60px;

  height: 60px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #ecfdf5,
      #dcfce7
    );

  font-size: 28px;

`;


// =====================================================
// EMPLOYEE IDENTITY
// =====================================================

const EmployeeIdentity = styled.div`

  flex: 1;

  min-width: 0;

`;


// =====================================================
// EMPLOYEE NAME
// =====================================================

const EmployeeName = styled.div`

  overflow: hidden;

  color: #172554;

  font-size: 18px;

  font-weight: 900;

  white-space: nowrap;

  text-overflow: ellipsis;

`;


// =====================================================
// EMPLOYEE PHONE
// =====================================================

const EmployeePhone = styled.div`

  margin-top: 5px;

  color: #64748b;

  font-size: 13px;

  font-weight: 600;

`;


// =====================================================
// ACTIVE STATUS
// =====================================================

const ActiveStatus = styled.div`

  display: flex;

  align-items: center;

  gap: 5px;

  padding: 6px 9px;

  border-radius: 8px;

  background: #f0fdf4;

  color: #166534;

  font-size: 10px;

  font-weight: 900;

`;


// =====================================================
// STATUS DOT
// =====================================================

const StatusDot = styled.span`

  width: 7px;

  height: 7px;

  display: inline-block;

  border-radius: 50%;

  background: #22c55e;

`;


// =====================================================
// EMPLOYEE INFO ROW
// =====================================================

const EmployeeInfoRow = styled.div`

  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 20px;

`;


// =====================================================
// ROLE BADGE
// =====================================================

const RoleBadge = styled.div`

  display: inline-flex;

  align-items: center;

  padding: 7px 11px;

  border-radius: 9px;

  background: #f1f5f9;

  color: #475569;

  font-size: 11px;

  font-weight: 800;

`;


// =====================================================
// LORRY BADGE
// =====================================================

const LorryBadge = styled.div`

  display: inline-flex;

  align-items: center;

  padding: 7px 11px;

  border-radius: 9px;

  background: #ecfdf5;

  color: #166534;

  font-size: 11px;

  font-weight: 900;

`;


// =====================================================
// SALARY PANEL
// =====================================================

const SalaryPanel = styled.div`

  margin-top: 19px;

  padding: 17px;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #f8fafc,
      #f1f5f9
    );

`;


// =====================================================
// SALARY LABEL
// =====================================================

const SalaryLabel = styled.div`

  color: #64748b;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// SALARY VALUE
// =====================================================

const SalaryValue = styled.div`

  margin-top: 6px;

  color: #172554;

  font-size: 22px;

  font-weight: 900;

`;


// =====================================================
// CARD ACTIONS
// =====================================================

const CardActions = styled.div`

  display: grid;

  grid-template-columns:
    1fr auto;

  gap: 10px;

  margin-top: 18px;

`;


// =====================================================
// VIEW BUTTON
// =====================================================

const ViewButton = styled.button`

  min-height: 45px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 14px;

  border: none;

  border-radius: 11px;

  background: #172554;

  color: white;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.2s ease;

  span {

    font-size: 19px;

  }

  &:hover {

    background: #1e3a8a;

  }

`;


// =====================================================
// EXPENSE BUTTON
// =====================================================

const ExpenseButton = styled.button`

  min-height: 45px;

  padding: 0 15px;

  border:
    1px solid #bbf7d0;

  border-radius: 11px;

  background: #f0fdf4;

  color: #166534;

  font-size: 12px;

  font-weight: 900;

  cursor: pointer;

  &:hover {

    background: #dcfce7;

  }

`;


// =====================================================
// CARD FOOTER
// =====================================================

const CardFooter = styled.div`

  display: grid;

  grid-template-columns:
    1fr auto;

  gap: 10px;

  margin-top: 10px;

`;


// =====================================================
// SALARY BUTTON
// =====================================================

const SalaryButton = styled.button`

  min-height: 40px;

  border:
    1px solid #bfdbfe;

  border-radius: 10px;

  background: #eff6ff;

  color: #1d4ed8;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  &:hover {

    background: #dbeafe;

  }

`;


// =====================================================
// DELETE BUTTON
// =====================================================

const DeleteButton = styled.button`

  min-height: 40px;

  padding: 0 14px;

  border:
    1px solid #fecaca;

  border-radius: 10px;

  background: #fef2f2;

  color: #dc2626;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  &:hover {

    background: #fee2e2;

  }

`;


// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = styled.div`

  min-height: 350px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 50px;

  border:
    1px dashed #cbd5e1;

  border-radius: 22px;

  background:
    rgba(255, 255, 255, 0.75);

`;


// =====================================================
// EMPTY ICON
// =====================================================

const EmptyIcon = styled.div`

  width: 76px;

  height: 76px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 18px;

  border-radius: 22px;

  background: #ecfdf5;

  font-size: 35px;

`;


// =====================================================
// LOADING SPINNER
// =====================================================

const LoadingSpinner = styled.div`

  margin-bottom: 15px;

  color: #166534;

  font-size: 48px;

  animation:
    spin 1s linear infinite;

  @keyframes spin {

    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }

  }

`;


// =====================================================
// EMPTY TITLE
// =====================================================

const EmptyTitle = styled.h3`

  margin: 0;

  color: #172554;

  font-size: 21px;

  font-weight: 900;

`;


// =====================================================
// EMPTY DESCRIPTION
// =====================================================

const EmptyDescription = styled.p`

  max-width: 450px;

  margin: 8px 0 20px;

  color: #64748b;

  font-size: 14px;

  text-align: center;

  line-height: 1.6;

`;


// =====================================================
// EMPTY ACTION
// =====================================================

const EmptyAction = styled.button`

  min-height: 45px;

  padding: 0 18px;

  border: none;

  border-radius: 11px;

  background: #166534;

  color: white;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

`;

// =====================================================
// OVERLAY
// =====================================================

const Overlay = styled.div`

  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 30px;

  background:
    rgba(15, 23, 42, 0.62);

  backdrop-filter:
    blur(7px);

  overflow-y: auto;

`;


// =====================================================
// FORM MODAL
// =====================================================

const FormModal = styled.div`

  width: min(620px, 100%);

  max-height: 92vh;

  overflow-y: auto;

  padding: 32px;

  border-radius: 24px;

  background: #ffffff;

  box-shadow:
    0 30px 80px
    rgba(15, 23, 42, 0.25);

`;


// =====================================================
// DETAILS MODAL
// =====================================================

const DetailsModal = styled.div`

  width: min(1000px, 100%);

  max-height: 92vh;

  overflow-y: auto;

  padding: 34px;

  border-radius: 26px;

  background: #ffffff;

  box-shadow:
    0 30px 90px
    rgba(15, 23, 42, 0.27);

`;


// =====================================================
// MODAL HEADER
// =====================================================

const ModalHeader = styled.div`

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 25px;

`;


// =====================================================
// DETAILS MODAL HEADER
// =====================================================

const DetailsModalHeader = styled(ModalHeader)`

  margin-bottom: 20px;

`;


// =====================================================
// MODAL EYEBROW
// =====================================================

const ModalEyebrow = styled.div`

  margin-bottom: 6px;

  color: #3f6f5a;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 1.7px;

`;


// =====================================================
// DETAILS EYEBROW
// =====================================================

const DetailsEyebrow = styled.div`

  margin-bottom: 6px;

  color: #3f6f5a;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 1.7px;

`;


// =====================================================
// MODAL TITLE
// =====================================================

const ModalTitle = styled.h2`

  margin: 0;

  color: #172554;

  font-size: 28px;

  font-weight: 900;

  letter-spacing: -0.6px;

`;


// =====================================================
// DETAILS MODAL TITLE
// =====================================================

const DetailsModalTitle = styled.h2`

  margin: 0;

  color: #172554;

  font-size: 29px;

  font-weight: 900;

  letter-spacing: -0.6px;

`;


// =====================================================
// MODAL SUBTITLE
// =====================================================

const ModalSubtitle = styled.div`

  margin-top: 7px;

  color: #64748b;

  font-size: 14px;

  line-height: 1.5;

`;


// =====================================================
// CLOSE BUTTON
// =====================================================

const CloseButton = styled.button`

  width: 45px;

  height: 45px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border: none;

  border-radius: 13px;

  background: #f1f5f9;

  color: #475569;

  font-size: 28px;

  line-height: 1;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {

    background: #e2e8f0;

    transform:
      rotate(5deg);

  }

`;


// =====================================================
// FORM LORRY BANNER
// =====================================================

const FormLorryBanner = styled.div`

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 16px 18px;

  margin-bottom: 21px;

  border:
    1px solid #bbf7d0;

  border-radius: 15px;

  background:
    linear-gradient(
      135deg,
      #f0fdf4,
      #ecfdf5
    );

`;


// =====================================================
// FORM LORRY ICON
// =====================================================

const FormLorryIcon = styled.div`

  width: 48px;

  height: 48px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  background: #dcfce7;

  font-size: 24px;

`;


// =====================================================
// FORM LORRY LABEL
// =====================================================

const FormLorryLabel = styled.div`

  color: #64748b;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 1.2px;

`;


// =====================================================
// FORM LORRY NUMBER
// =====================================================

const FormLorryNumber = styled.div`

  margin-top: 4px;

  color: #14532d;

  font-size: 19px;

  font-weight: 900;

  letter-spacing: 0.7px;

`;


// =====================================================
// FORM GROUP
// =====================================================

const FormGroup = styled.div`

  margin-bottom: 19px;

`;


// =====================================================
// FORM ROW
// =====================================================

const FormRow = styled.div`

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 16px;

`;


// =====================================================
// FORM LABEL
// =====================================================

const FormLabel = styled.label`

  display: block;

  margin-bottom: 8px;

  color: #334155;

  font-size: 13px;

  font-weight: 800;

`;


// =====================================================
// FORM INPUT
// =====================================================

const FormInput = styled.input`

  width: 100%;

  min-height: 52px;

  padding: 0 15px;

  border:
    1px solid #cbd5e1;

  border-radius: 12px;

  outline: none;

  background: #ffffff;

  color: #172554;

  font-family: inherit;

  font-size: 15px;

  font-weight: 600;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {

    border-color: #4ade80;

    box-shadow:
      0 0 0 4px
      rgba(74, 222, 128, 0.12);

  }

  &::placeholder {

    color: #94a3b8;

    font-weight: 500;

  }

`;


// =====================================================
// FORM SELECT
// =====================================================

const FormSelect = styled.select`

  width: 100%;

  min-height: 52px;

  padding: 0 15px;

  border:
    1px solid #cbd5e1;

  border-radius: 12px;

  outline: none;

  background: #ffffff;

  color: #172554;

  font-family: inherit;

  font-size: 15px;

  font-weight: 600;

  cursor: pointer;

  &:focus {

    border-color: #4ade80;

    box-shadow:
      0 0 0 4px
      rgba(74, 222, 128, 0.12);

  }

`;


// =====================================================
// MONEY INPUT WRAPPER
// =====================================================

const MoneyInputWrapper = styled.div`

  position: relative;

  display: flex;

  align-items: center;

  width: 100%;

  ${FormInput} {

    padding-left: 36px !important;

  }

`;


// =====================================================
// MONEY PREFIX
// =====================================================

const MoneyPrefix = styled.div`

  position: absolute;

  left: 14px;

  top: 50%;

  transform: translateY(-50%);

  z-index: 2;

  color: #166534;

  font-size: 16px;

  font-weight: 900;

  pointer-events: none;

  line-height: 1;

`;




// =====================================================
// SELECTED EMPLOYEE BANNER
// =====================================================

const SelectedEmployeeBanner = styled.div`

  display: flex;

  align-items: center;

  gap: 14px;

  padding: 15px;

  margin-bottom: 18px;

  border:
    1px solid #e2e8f0;

  border-radius: 15px;

  background: #f8fafc;

`;


// =====================================================
// SELECTED AVATAR
// =====================================================

const SelectedAvatar = styled.div`

  width: 51px;

  height: 51px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 14px;

  background: #ecfdf5;

  font-size: 24px;

`;


// =====================================================
// SELECTED EMPLOYEE NAME
// =====================================================

const SelectedEmployeeName = styled.div`

  color: #172554;

  font-size: 17px;

  font-weight: 900;

`;


// =====================================================
// SELECTED EMPLOYEE PHONE
// =====================================================

const SelectedEmployeePhone = styled.div`

  margin-top: 4px;

  color: #64748b;

  font-size: 13px;

  font-weight: 600;

`;


// =====================================================
// DAYS PREVIEW
// =====================================================

const DaysPreview = styled.div`

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 14px 16px;

  margin:
    -4px 0 18px;

  border:
    1px solid #bfdbfe;

  border-radius: 13px;

  background: #eff6ff;

`;


// =====================================================
// DAYS PREVIEW ICON
// =====================================================

const DaysPreviewIcon = styled.div`

  width: 40px;

  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  background: #dbeafe;

  font-size: 20px;

`;


// =====================================================
// DAYS PREVIEW LABEL
// =====================================================

const DaysPreviewLabel = styled.div`

  color: #64748b;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// DAYS PREVIEW VALUE
// =====================================================

const DaysPreviewValue = styled.div`

  margin-top: 3px;

  color: #1e3a8a;

  font-size: 17px;

  font-weight: 900;

`;


// =====================================================
// MODAL ACTIONS
// =====================================================

const ModalActions = styled.div`

  display: flex;

  justify-content: flex-end;

  gap: 11px;

  margin-top: 27px;

`;


// =====================================================
// CANCEL BUTTON
// =====================================================

const CancelButton = styled.button`

  min-height: 48px;

  padding: 0 19px;

  border:
    1px solid #cbd5e1;

  border-radius: 11px;

  background: #ffffff;

  color: #475569;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

  &:hover {

    background: #f8fafc;

  }

`;


// =====================================================
// PRIMARY MODAL BUTTON
// =====================================================

const PrimaryModalButton = styled.button`

  min-height: 48px;

  padding: 0 21px;

  border: none;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #166534,
      #15803d
    );

  color: #ffffff;

  font-size: 13px;

  font-weight: 900;

  cursor: pointer;

  box-shadow:
    0 7px 17px
    rgba(22, 101, 52, 0.17);

  &:hover {

    background:
      linear-gradient(
        135deg,
        #14532d,
        #166534
      );

  }

  &:disabled {

    opacity: 0.55;

    cursor: not-allowed;

  }

`;


// =====================================================
// PROFILE BANNER
// =====================================================

const ProfileBanner = styled.div`

  display: flex;

  align-items: center;

  gap: 19px;

  padding: 20px;

  margin-bottom: 18px;

  border-radius: 18px;

  background:
    linear-gradient(
      135deg,
      #f8fafc,
      #f1f5f9
    );

  border:
    1px solid #e2e8f0;

`;


// =====================================================
// PROFILE AVATAR
// =====================================================

const ProfileAvatar = styled.div`

  width: 76px;

  height: 76px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      #dcfce7,
      #bbf7d0
    );

  font-size: 35px;

`;


// =====================================================
// PROFILE INFO
// =====================================================

const ProfileInfo = styled.div`

  min-width: 0;

`;


// =====================================================
// PROFILE NAME
// =====================================================

const ProfileName = styled.div`

  color: #172554;

  font-size: 25px;

  font-weight: 900;

`;


// =====================================================
// PROFILE PHONE
// =====================================================

const ProfilePhone = styled.div`

  margin-top: 4px;

  color: #64748b;

  font-size: 14px;

  font-weight: 600;

`;


// =====================================================
// PROFILE TAGS
// =====================================================

const ProfileTags = styled.div`

  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 10px;

`;


// =====================================================
// PROFILE ROLE
// =====================================================

const ProfileRole = styled.div`

  padding: 6px 10px;

  border-radius: 8px;

  background: #e2e8f0;

  color: #475569;

  font-size: 10px;

  font-weight: 900;

`;


// =====================================================
// ACTIVE TAG
// =====================================================

const ActiveTag = styled.div`

  padding: 6px 10px;

  border-radius: 8px;

  background: #dcfce7;

  color: #166534;

  font-size: 10px;

  font-weight: 900;

`;


// =====================================================
// REGISTRATION BANNER
// =====================================================

const RegistrationBanner = styled.div`

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 17px 19px;

  margin-bottom: 18px;

  border:
    1px solid #bbf7d0;

  border-radius: 15px;

  background:
    linear-gradient(
      135deg,
      #f0fdf4,
      #ecfdf5
    );

`;


// =====================================================
// REGISTRATION BANNER ICON
// =====================================================

const RegistrationBannerIcon = styled.div`

  width: 50px;

  height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 14px;

  background: #dcfce7;

  font-size: 25px;

`;


// =====================================================
// REGISTRATION BANNER LABEL
// =====================================================

const RegistrationBannerLabel = styled.div`

  color: #64748b;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.3px;

`;


// =====================================================
// REGISTRATION BANNER NUMBER
// =====================================================

const RegistrationBannerNumber = styled.div`

  margin-top: 4px;

  color: #14532d;

  font-size: 22px;

  font-weight: 900;

  letter-spacing: 0.7px;

`;


// =====================================================
// DETAIL METRICS
// =====================================================

const DetailMetrics = styled.div`

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 14px;

  margin-bottom: 25px;

`;


// =====================================================
// DETAIL METRIC
// =====================================================

const DetailMetric = styled.div`

  min-height: 125px;

  padding: 18px;

  border:
    1px solid #e2e8f0;

  border-radius: 15px;

  background: #ffffff;

`;


// =====================================================
// DETAIL METRIC ICON
// =====================================================

const DetailMetricIcon = styled.div`

  width: 38px;

  height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 10px;

  border-radius: 10px;

  background: #f1f5f9;

  color: #166534;

  font-size: 17px;

  font-weight: 900;

`;


// =====================================================
// DETAIL METRIC LABEL
// =====================================================

const DetailMetricLabel = styled.div`

  color: #64748b;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// DETAIL METRIC VALUE
// =====================================================

const DetailMetricValue = styled.div`

  margin-top: 5px;

  color:
    ${({ $danger }) =>
      $danger
        ? "#dc2626"
        : "#172554"};

  font-size: 20px;

  font-weight: 900;

`;


// =====================================================
// DETAILS SECTION
// =====================================================

const DetailsSection = styled.section`

  margin-top: 22px;

  padding: 21px;

  border:
    1px solid #e2e8f0;

  border-radius: 17px;

  background: #ffffff;

`;


// =====================================================
// DETAILS SECTION HEADER
// =====================================================

const DetailsSectionHeader = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 16px;

`;


// =====================================================
// DETAILS SECTION TITLE
// =====================================================

const DetailsSectionTitle = styled.h3`

  margin: 0;

  color: #172554;

  font-size: 17px;

  font-weight: 900;

`;


// =====================================================
// DETAILS SECTION SUBTITLE
// =====================================================

const DetailsSectionSubtitle = styled.div`

  margin-top: 4px;

  color: #94a3b8;

  font-size: 11px;

`;


// =====================================================
// RECORD COUNT
// =====================================================

const RecordCount = styled.div`

  padding: 7px 10px;

  border-radius: 8px;

  background: #f1f5f9;

  color: #475569;

  font-size: 10px;

  font-weight: 900;

`;


// =====================================================
// HISTORY SCROLL
// =====================================================

const HistoryScroll = styled.div`

  width: 100%;

  overflow-x: auto;

`;


// =====================================================
// HISTORY TABLE
// =====================================================

const HistoryTable = styled.div`

  min-width: 720px;

`;


// =====================================================
// HISTORY HEAD
// =====================================================

const HistoryHead = styled.div`

  display: grid;

  grid-template-columns:
    1.1fr
    1.1fr
    0.6fr
    1fr
    1fr;

  gap: 10px;

  padding: 11px 13px;

  border-radius: 9px;

  background: #f8fafc;

  color: #64748b;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 0.8px;

`;


// =====================================================
// HISTORY ROW
// =====================================================

const HistoryRow = styled.div`

  display: grid;

  grid-template-columns:
    1.1fr
    1.1fr
    0.6fr
    1fr
    1fr;

  gap: 10px;

  align-items: center;

  padding: 14px 13px;

  border-bottom:
    1px solid #f1f5f9;

  color: #475569;

  font-size: 12px;

  font-weight: 600;

`;


// =====================================================
// EXPENSE AMOUNT
// =====================================================

const ExpenseAmount = styled.span`

  color: #dc2626;

  font-weight: 900;

`;


// =====================================================
// PAYMENT TAG
// =====================================================

const PaymentTag = styled.span`

  width: fit-content;

  padding: 5px 8px;

  border-radius: 7px;

  background: #eff6ff;

  color: #1d4ed8;

  font-size: 9px;

  font-weight: 900;

`;


// =====================================================
// NO HISTORY
// =====================================================

const NoHistory = styled.div`

  padding: 30px;

  text-align: center;

  border-radius: 12px;

  background: #f8fafc;

  color: #94a3b8;

  font-size: 13px;

`;


// =====================================================
// SALARY HISTORY LIST
// =====================================================

const SalaryHistoryList = styled.div`

  display: flex;

  flex-direction: column;

  gap: 9px;

`;


// =====================================================
// SALARY HISTORY ROW
// =====================================================

const SalaryHistoryRow = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding: 13px 15px;

  border:
    1px solid #e2e8f0;

  border-radius: 11px;

  background: #f8fafc;

`;


// =====================================================
// SALARY HISTORY AMOUNT
// =====================================================

const SalaryHistoryAmount = styled.div`

  color: #172554;

  font-size: 15px;

  font-weight: 900;

`;


// =====================================================
// SALARY HISTORY DATE
// =====================================================

const SalaryHistoryDate = styled.div`

  flex: 1;

  color: #64748b;

  font-size: 11px;

  font-weight: 600;

`;


// =====================================================
// UPDATED BADGE
// =====================================================

const UpdatedBadge = styled.div`

  padding: 5px 8px;

  border-radius: 7px;

  background: #f0fdf4;

  color: #166534;

  font-size: 9px;

  font-weight: 900;

`;


// =====================================================
// DETAILS ACTIONS
// =====================================================

const DetailsActions = styled.div`

  display: flex;

  justify-content: flex-end;

  gap: 11px;

  margin-top: 22px;

`;


// =====================================================
// LARGE EXPENSE BUTTON
// =====================================================

const LargeExpenseButton = styled.button`

  min-height: 48px;

  padding: 0 20px;

  border:
    1px solid #bbf7d0;

  border-radius: 11px;

  background: #f0fdf4;

  color: #166534;

  font-size: 13px;

  font-weight: 900;

  cursor: pointer;

  &:hover {

    background: #dcfce7;

  }

`;


// =====================================================
// LARGE SALARY BUTTON
// =====================================================

const LargeSalaryButton = styled.button`

  min-height: 48px;

  padding: 0 20px;

  border: none;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #1d4ed8,
      #2563eb
    );

  color: #ffffff;

  font-size: 13px;

  font-weight: 900;

  cursor: pointer;

  box-shadow:
    0 7px 17px
    rgba(37, 99, 235, 0.16);

`;


// =====================================================
// HISTORY PREVIEW
// =====================================================

const HistoryPreview = styled.div`

  margin-top: 7px;

  padding: 16px;

  border:
    1px solid #e2e8f0;

  border-radius: 13px;

  background: #f8fafc;

`;


// =====================================================
// HISTORY PREVIEW HEADER
// =====================================================

const HistoryPreviewHeader = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 11px;

`;


// =====================================================
// HISTORY PREVIEW TITLE
// =====================================================

const HistoryPreviewTitle = styled.div`

  color: #334155;

  font-size: 12px;

  font-weight: 900;

`;


// =====================================================
// HISTORY LOADING
// =====================================================

const HistoryLoading = styled.div`

  color: #166534;

  font-size: 10px;

  font-weight: 800;

`;


// =====================================================
// NO HISTORY SMALL
// =====================================================

const NoHistorySmall = styled.div`

  padding: 14px;

  text-align: center;

  border-radius: 9px;

  background: #ffffff;

  color: #94a3b8;

  font-size: 11px;

`;


// =====================================================
// SALARY HISTORY MINI LIST
// =====================================================

const SalaryHistoryMiniList = styled.div`

  display: flex;

  flex-direction: column;

  gap: 7px;

`;


// =====================================================
// SALARY HISTORY MINI ROW
// =====================================================

const SalaryHistoryMiniRow = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  padding: 10px 12px;

  border:
    1px solid #e2e8f0;

  border-radius: 9px;

  background: #ffffff;

`;


// =====================================================
// MINI SALARY AMOUNT
// =====================================================

const MiniSalaryAmount = styled.div`

  color: #172554;

  font-size: 13px;

  font-weight: 900;

`;


// =====================================================
// MINI SALARY DATE
// =====================================================

const MiniSalaryDate = styled.div`

  margin-top: 2px;

  color: #94a3b8;

  font-size: 9px;

  font-weight: 600;

`;


// =====================================================
// MINI CURRENT BADGE
// =====================================================

const MiniCurrentBadge = styled.div`

  padding: 5px 7px;

  border-radius: 6px;

  background: #f0fdf4;

  color: #166534;

  font-size: 8px;

  font-weight: 900;

`;


// =====================================================
// ID PROOF STYLES
// =====================================================

const IdProofUploadCard = styled.div`
  background: #f8faf9;
  border: 1.5px dashed #cbd5e1;
  border-radius: 14px;
  padding: 16px 20px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #16a34a;
    background: #f0fdf4;
  }
`;

const IdProofUploadHeader = styled.div`
  margin-bottom: 12px;
`;

const IdProofUploadTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IdProofUploadSubtitle = styled.div`
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
`;

const UploadDropzone = styled.div`
  width: 100%;
`;

const UploadTrigger = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 20px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0fdf4;
    border-color: #86efac;
    transform: translateY(-1px);
  }
`;

const UploadIcon = styled.div`
  font-size: 28px;
`;

const UploadText = styled.div`
  font-size: 13px;
  color: #334155;

  strong {
    color: #15803d;
  }
`;

const UploadHint = styled.div`
  font-size: 11px;
  color: #94a3b8;
`;

const IdProofPreviewContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #bbf7d0;
`;

const IdProofPreviewImage = styled.img`
  width: 68px;
  height: 68px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
`;

const IdProofPreviewInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const IdProofFileName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  word-break: break-all;
`;

const IdProofFileSize = styled.div`
  font-size: 11px;
  color: #64748b;
`;

const RemoveIdProofButton = styled.button`
  align-self: flex-start;
  margin-top: 4px;
  padding: 4px 10px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fee2e2;
  }
`;

const ViewIdButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  background: #f0fdf4;
  color: #15803d;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: #dcfce7;
    border-color: #86efac;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.1);
  }
`;

const IdProofModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const IdProofModalContent = styled.div`
  background: #ffffff;
  border-radius: 18px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes modalPop {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const IdProofModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #eef2f6;
  background: #fcfdfd;
`;

const IdProofModalTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`;

const IdProofModalMeta = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
  font-weight: 600;
`;

const IdProofModalClose = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const IdProofModalBody = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a08;
  overflow-y: auto;
  max-height: 65vh;
`;

const IdProofModalImg = styled.img`
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  background: #ffffff;
`;

const IdProofModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #eef2f6;
  background: #ffffff;
`;

const IdProofModalDoneBtn = styled.button`
  padding: 9px 20px;
  background: #15803d;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #166534;
  }
`;


// =====================================================
// RESPONSIVE DESIGN
// =====================================================

const ResponsiveStyle = createGlobalStyle`

  @media (max-width: 1250px) {

    ${MetricsGrid} {

      grid-template-columns:
        repeat(3, minmax(0, 1fr));

    }


    ${EmployeeGrid} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

    }

  }


  @media (max-width: 1000px) {

    ${Header} {

      align-items: flex-start;

      flex-direction: column;

    }


    ${HeaderRight} {

      width: 100%;

      align-items: stretch;

    }


    ${LorryInfo} {

      flex: 1;

    }


    ${HeroTitle} {

      font-size: 39px;

    }


    ${DetailMetrics} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

    }

  }


  @media (max-width: 800px) {

    ${Page} {

      padding:
        20px 20px 50px;

    }


    ${HeaderRight} {

      flex-direction: column;

      width: 100%;

    }


    ${LorryInfo} {

      width: 100%;

    }


    ${AddButton} {

      width: 100%;

    }


    ${Hero} {

      min-height: auto;

      padding: 35px 25px;

    }


    ${HeroTitle} {

      font-size: 32px;

    }


    ${HeroDescription} {

      font-size: 15px;

    }


    ${MetricsGrid} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));
      gap: 12px;

    }


    ${RoleTabs} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));
      gap: 10px;

    }


    ${Toolbar} {

      align-items: stretch;

      flex-direction: column;

    }


    ${SearchBox} {

      width: 100%;

    }


    ${ToolbarText} {

      text-align: left;

    }

  }


  @media (max-width: 650px) {

    ${Page} {

      padding:
        15px 14px 40px;

    }


    ${Header} {

      padding: 18px;

      border-radius: 18px;

    }


    ${HeaderLeft} {

      width: 100%;

    }


    ${TruckIcon} {

      width: 48px;

      height: 48px;

      border-radius: 12px;

      font-size: 24px;

    }


    ${BackButton} {

      width: 42px;

      height: 42px;

      font-size: 20px;

    }


    ${PageHeading} {

      font-size: 24px;

    }


    ${SmallHeading} {

      font-size: 10px;

    }


    ${Subtitle} {

      font-size: 13px;

    }


    ${LorryRegistration} {

      font-size: 17px;

    }


    ${Hero} {

      min-height: auto;

      padding: 28px 20px;

      border-radius: 20px;

    }


    ${HeroTitle} {

      font-size: 26px;

    }


    ${HeroDescription} {

      font-size: 13px;

      line-height: 1.5;

    }


    ${HeroQuote} {

      font-size: 12px;

    }


    ${HeroRegistration} {

      align-items: flex-start;

      flex-direction: column;

      gap: 7px;

    }


    ${SectionHeader} {

      align-items: stretch;

      flex-direction: column;

    }


    ${SectionTitle} {

      font-size: 22px;

    }


    ${MetricsGrid} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));
      gap: 10px;

    }

    ${MetricCard} {
      min-height: 80px;
      padding: 12px 10px;
      gap: 10px;
      border-radius: 14px;
    }

    ${MetricIcon} {
      width: 38px;
      height: 38px;
      font-size: 20px;
      border-radius: 10px;
    }

    ${MetricLabel} {
      font-size: 9px;
    }

    ${MetricValue} {
      font-size: 20px;
      margin-top: 2px;
    }


    ${RoleTabs} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));
      gap: 8px;

    }

    ${RoleTab} {
      min-height: 52px;
      padding: 8px 10px;
      gap: 8px;
      border-radius: 12px;
    }

    ${RoleTabIcon} {
      width: 32px;
      height: 32px;
      font-size: 17px;
      border-radius: 8px;
    }

    ${RoleTabText} {
      font-size: 12px;
    }

    ${RoleTabCount} {
      min-width: 24px;
      height: 24px;
      font-size: 11px;
    }


    ${EmployeeGrid} {

      grid-template-columns:
        1fr;

    }


    ${EmployeeCard} {

      padding: 18px;
      border-radius: 16px;

    }


    ${EmployeeName} {

      font-size: 16px;

    }


    ${ActiveStatus} {

      display: none;

    }


    ${FormRow} {

      grid-template-columns:
        1fr;

      gap: 0;

    }


    ${FormModal} {

      padding: 20px;

      border-radius: 18px;
      width: 95%;
      max-width: 500px;

    }


    ${DetailsModal} {

      padding: 20px;

      border-radius: 18px;
      width: 95%;
      max-width: 500px;

    }


    ${ProfileBanner} {

      align-items: flex-start;

    }


    ${ProfileName} {

      font-size: 20px;

    }


    ${DetailMetrics} {

      grid-template-columns:
        1fr 1fr;

    }


    ${DetailsActions} {

      flex-direction: column;

    }


    ${LargeExpenseButton},
    ${LargeSalaryButton} {

      width: 100%;

    }


    ${ModalActions} {

      flex-direction: column-reverse;

    }


    ${CancelButton},
    ${PrimaryModalButton} {

      width: 100%;

    }

  }


  @media (max-width: 450px) {

    ${HeaderLeft} {

      gap: 10px;

    }


    ${PageHeading} {

      font-size: 21px;

    }


    ${TruckIcon} {

      width: 42px;

      height: 42px;

      font-size: 20px;

    }


    ${BackButton} {

      width: 38px;

      height: 38px;

      font-size: 18px;

    }


    ${Hero} {

      min-height: auto;

      padding: 24px 16px;

    }


    ${HeroTitle} {

      font-size: 22px;

    }


    ${HeroRegistration} strong {

      font-size: 13px;

    }


    ${DetailMetrics} {

      grid-template-columns:
        1fr;

    }


    ${RegistrationBannerNumber} {

      font-size: 16px;

    }


    ${ProfileAvatar} {

      width: 52px;

      height: 52px;

      font-size: 24px;

    }

  }

`;

// =====================================================
// EXPORT
// =====================================================

export default EmployeePage;