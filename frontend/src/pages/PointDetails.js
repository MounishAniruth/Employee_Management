import React, {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import api from "../utils/api";

import styled from "styled-components";

import rigLogo from "../assets/images/rig_logo.jpg";


// =====================================================
// POINT DETAILS PAGE
// =====================================================

const PointDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();


  // =====================================================
  // PAGE STATE
  // =====================================================

  const [lorry, setLorry] = useState(null);

  const [points, setPoints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [pointsLoading, setPointsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingPointId, setEditingPointId] =
    useState(null);


  // =====================================================
  // VIEW POINT DETAILS
  // =====================================================

  const [selectedPoint, setSelectedPoint] =
    useState(null);

  const [showPointDetails, setShowPointDetails] =
    useState(false);


  // =====================================================
  // SUMMARY
  // =====================================================

  const [summary, setSummary] = useState({
    total_points: 0,
    total_depth: "0.00",
    total_running_rpm: "0.00",
    average_depth_per_rpm: null,
    total_drilling_amount: "0.00",
    total_casing_amount: "0.00",
    total_amount: "0.00",
    total_given_amount: "0.00",
    total_balance: "0.00",
  });


  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const overallSummary = points.reduce(
    (acc, point) => {
      acc.total_points += 1;
      acc.total_depth += Number(point.total_depth || 0);
      acc.total_running_rpm += Number(
        point.running_rpm ||
          (Number(point.closing_rpm || 0) -
            Number(point.starting_rpm || 0)) ||
          0
      );
      acc.total_amount += Number(point.total_amount || 0);
      return acc;
    },
    {
      total_points: 0,
      total_depth: 0,
      total_running_rpm: 0,
      total_amount: 0,
    }
  );


  // =====================================================
  // FORM
  // =====================================================

  const emptyForm = {
    point_date:
      new Date()
        .toISOString()
        .split("T")[0],

    broker_name: "",

    broker_location: "",

    broker_phone: "",

    party_name: "",

    party_location: "",

    party_mobile: "",

    total_depth: "",

    starting_rpm: "",

    closing_rpm: "",

    given_amount: "",

    depth_rates: [
      {
        from_depth: 0,

        to_depth: 200,

        rate_per_ft: "",
      },
    ],

    casing_details: [],
  };


  const [form, setForm] =
    useState(emptyForm);


  // =====================================================
  // FETCH LORRY
  // =====================================================

  useEffect(() => {

    const loadLorry = async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await api.get(
            `/lorry/${id}`
          );


        setLorry(
          response.data
        );

      } catch (err) {

        console.error(
          "Error fetching lorry:",
          err
        );


        setError(
          err.response?.data?.message ||
            "Unable to load rig details. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


    loadLorry();

  }, [id]);


  // =====================================================
  // FETCH POINTS
  // =====================================================

  useEffect(() => {

    const loadPoints = async () => {

      try {

        setPointsLoading(true);


        const response =
          await api.get(
            `/point/lorry/${id}`
          );


        setPoints(
          response.data.points || []
        );

      } catch (err) {

        console.error(
          "Error fetching points:",
          err
        );


        setPoints([]);


        setError(
          err.response?.data?.message ||
            "Unable to load point details."
        );

      } finally {

        setPointsLoading(false);

      }

    };


    loadPoints();

  }, [id]);


  // =====================================================
  // FETCH POINTS AGAIN
  // =====================================================

  const fetchPoints = async () => {

    try {

      setPointsLoading(true);


      const response =
        await api.get(
          `/point/lorry/${id}`
        );


      setPoints(
        response.data.points ||
          response.data ||
          []
      );

    } catch (err) {

      console.error(
        "Error fetching points:",
        err
      );


      setPoints([]);

    } finally {

      setPointsLoading(false);

    }

  };


  // =====================================================
  // FETCH SUMMARY
  // =====================================================

  const fetchSummary = async () => {

    try {

      if (!fromDate || !toDate) {

        setError(
          "Please select both dates."
        );

        return;
      }


      setError("");

      setSuccess("");


      const response =
        await api.get(
          "/point/summary",
          {
            params: {
              lorryId: Number(id),

              fromDate,

              toDate,
            },
          }
        );


      if (response.data.success) {

        setSummary(
          response.data.summary || {
            total_points: 0,

            total_depth: "0.00",

            total_running_rpm: "0.00",

            average_depth_per_rpm: null,

            total_drilling_amount:
              "0.00",

            total_casing_amount:
              "0.00",

            total_amount:
              "0.00",

            total_given_amount:
              "0.00",

            total_balance:
              "0.00",
          }
        );

      }

    } catch (err) {

      console.error(
        "Error fetching summary:",
        err
      );


      setError(
        err.response?.data?.message ||
          "Unable to generate summary."
      );

    }

  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));

  };


  // =====================================================
  // DEPTH RATE CHANGE
  // =====================================================

  const handleDepthRateChange = (
    index,
    field,
    value
  ) => {

    setForm((prev) => {

      const updated = [
        ...prev.depth_rates
      ];


      updated[index] = {

        ...updated[index],

        [field]: value,

      };


      return {

        ...prev,

        depth_rates: updated,

      };

    });

  };


  // =====================================================
  // ADD DEPTH RATE
  // =====================================================

  const addDepthRate = () => {

    setForm((prev) => {

      const rates = [
        ...prev.depth_rates
      ];


      const last =
        rates[rates.length - 1];


      const nextFrom =
        Number(
          last?.to_depth
        ) || 0;


      const nextTo =
        nextFrom + 100;


      rates.push({

        from_depth:
          nextFrom,

        to_depth:
          nextTo,

        rate_per_ft: "",

      });


      return {

        ...prev,

        depth_rates:
          rates,

      };

    });

  };


  // =====================================================
  // REMOVE DEPTH RATE
  // =====================================================

  const removeDepthRate = (
    index
  ) => {

    setForm((prev) => ({

      ...prev,

      depth_rates:
        prev.depth_rates.filter(
          (_, i) =>
            i !== index
        ),

    }));

  };


  // =====================================================
  // CASING CHANGE
  // =====================================================

  const handleCasingChange = (
    index,
    field,
    value
  ) => {

    setForm((prev) => {

      const updated = [
        ...prev.casing_details
      ];


      updated[index] = {

        ...updated[index],

        [field]: value,

      };


      return {

        ...prev,

        casing_details:
          updated,

      };

    });

  };


  // =====================================================
  // ADD CASING
  // =====================================================

  const addCasing = () => {

    setForm((prev) => ({

      ...prev,

      casing_details: [

        ...prev.casing_details,

        {
          pipe_size:
            "5 inch",

          casing_depth:
            "",

          rate_per_ft:
            "",
        },

      ],

    }));

  };


  // =====================================================
  // REMOVE CASING
  // =====================================================

  const removeCasing = (
    index
  ) => {

    setForm((prev) => ({

      ...prev,

      casing_details:
        prev.casing_details.filter(
          (_, i) =>
            i !== index
        ),

    }));

  };


  // =====================================================
  // RUNNING RPM
  // =====================================================

  const runningRPM =
    Number(
      form.closing_rpm || 0
    ) -
    Number(
      form.starting_rpm || 0
    );


  // =====================================================
  // AVG DEPTH / RPM
  // =====================================================

  const averageDepth =
    runningRPM > 0

      ? Number(
          form.total_depth || 0
        ) / runningRPM

      : 0;


  // =====================================================
  // DRILLING AMOUNT PREVIEW
  // =====================================================

  const calculateDrillingAmount =
    () => {

      const totalDepth =
        Number(
          form.total_depth
        ) || 0;


      let amount = 0;


      form.depth_rates.forEach(
        (rate) => {

          const from =
            Number(
              rate.from_depth
            ) || 0;


          const to =
            Number(
              rate.to_depth
            ) || 0;


          const ratePerFt =
            Number(
              rate.rate_per_ft
            ) || 0;


          if (
            totalDepth > from &&
            to > from
          ) {

            const applicableDepth =
              Math.min(
                totalDepth,
                to
              ) - from;


            if (
              applicableDepth > 0
            ) {

              amount +=
                applicableDepth *
                ratePerFt;

            }

          }

        }
      );


      return amount;

    };


  // =====================================================
  // CASING AMOUNT PREVIEW
  // =====================================================

  const calculateCasingAmount =
    () => {

      return form.casing_details.reduce(
        (
          total,
          casing
        ) => {

          const depth =
            Number(
              casing.casing_depth
            ) || 0;


          const rate =
            Number(
              casing.rate_per_ft
            ) || 0;


          return (
            total +
            depth * rate
          );

        },
        0
      );

    };


  // =====================================================
  // TOTAL AMOUNT PREVIEW
  // =====================================================

  const drillingAmount =
    calculateDrillingAmount();


  const casingAmount =
    calculateCasingAmount();


  const totalAmount =
    drillingAmount +
    casingAmount;


  const givenAmount =
    Number(
      form.given_amount
    ) || 0;


  const balance =
    totalAmount -
    givenAmount;


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setForm(emptyForm);

    setEditingPointId(null);

  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddPoint = () => {

    resetForm();

    setError("");

    setSuccess("");

    setShowForm(true);

  };


  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCloseForm = () => {

    resetForm();

    setShowForm(false);

  };


  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setError("");

      setSuccess("");


      // -------------------------------------------------
      // BASIC VALIDATION
      // -------------------------------------------------

      if (!form.point_date) {

        setError(
          "Please select point date."
        );

        return;

      }


      if (
        !form.broker_name.trim()
      ) {

        setError(
          "Please enter broker name."
        );

        return;

      }


      if (
        !form.broker_location.trim()
      ) {

        setError(
          "Please enter broker location."
        );

        return;

      }


      if (
        !form.broker_phone.trim()
      ) {

        setError(
          "Please enter broker phone."
        );

        return;

      }


      if (
        !form.party_name.trim()
      ) {

        setError(
          "Please enter party name."
        );

        return;

      }


      if (
        !form.party_location.trim()
      ) {

        setError(
          "Please enter party location."
        );

        return;

      }


      if (
        !form.party_mobile.trim()
      ) {

        setError(
          "Please enter party mobile."
        );

        return;

      }


      if (
        form.total_depth === "" ||
        Number(form.total_depth) <= 0
      ) {

        setError(
          "Please enter valid total depth."
        );

        return;

      }


      if (
        form.starting_rpm === "" ||
        form.closing_rpm === ""
      ) {

        setError(
          "Please enter starting and closing RPM."
        );

        return;

      }


      if (
        runningRPM < 0
      ) {

        setError(
          "Closing RPM cannot be less than starting RPM."
        );

        return;

      }


      // -------------------------------------------------
      // PREPARE PAYLOAD
      // -------------------------------------------------

      const payload = {

        lorry_id:
          Number(id),

        point_date:
          form.point_date,

        broker_name:
          form.broker_name,

        broker_location:
          form.broker_location,

        broker_phone:
          form.broker_phone,

        party_name:
          form.party_name,

        party_location:
          form.party_location,

        party_mobile:
          form.party_mobile,

        total_depth:
          Number(
            form.total_depth
          ),

        starting_rpm:
          Number(
            form.starting_rpm
          ),

        closing_rpm:
          Number(
            form.closing_rpm
          ),

        given_amount:
          Number(
            form.given_amount || 0
          ),

        depth_rates:
          form.depth_rates.map(
            (rate) => ({

              from_depth:
                Number(
                  rate.from_depth
                ),

              to_depth:
                Number(
                  rate.to_depth
                ),

              rate_per_ft:
                Number(
                  rate.rate_per_ft
                ),

            })
          ),

        casing_details:
          form.casing_details.map(
            (casing) => ({

              pipe_size:
                casing.pipe_size,

              casing_depth:
                Number(
                  casing.casing_depth
                ),

              rate_per_ft:
                Number(
                  casing.rate_per_ft
                ),

            })
          ),

      };


      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      if (editingPointId) {

        await api.put(
          `/point/${editingPointId}`,
          payload
        );


        setSuccess(
          "Point updated successfully."
        );

      }


      // -------------------------------------------------
      // ADD
      // -------------------------------------------------

      else {

        await api.post(
          "/point/add",
          payload
        );


        setSuccess(
          "Point added successfully."
        );

      }


      // -------------------------------------------------
      // REFRESH
      // -------------------------------------------------

      setShowForm(false);

      resetForm();

      await fetchPoints();


      if (
        fromDate &&
        toDate
      ) {

        await fetchSummary();

      }


    } catch (err) {

      console.error(
        "Error saving point:",
        err
      );


      setError(
        err.response?.data?.message ||
          "Unable to save point."
      );

    }

  };


  // =====================================================
  // EDIT POINT
  // =====================================================

  const handleEditPoint =
    async (point) => {

      try {

        setError("");

        setSuccess("");


        const response =
          await api.get(
            `/point/${point.id}`
          );


        const data =
          response.data.point ||
          response.data;


        if (
          Number(data.lorry_id) !==
          Number(id)
        ) {

          setError(
            "This point does not belong to the selected rig."
          );

          return;

        }


        setForm({

          point_date:
            data.point_date
              ?.substring(0, 10) ||
            "",


          broker_name:
            data.broker_name ||
            "",


          broker_location:
            data.broker_location ||
            "",


          broker_phone:
            data.broker_phone ||
            "",


          party_name:
            data.party_name ||
            "",


          party_location:
            data.party_location ||
            "",


          party_mobile:
            data.party_mobile ||
            "",


          total_depth:
            data.total_depth ??
            "",


          starting_rpm:
            data.starting_rpm ??
            "",


          closing_rpm:
            data.closing_rpm ??
            "",


          given_amount:
            data.given_amount ??
            "",


          depth_rates:
            data.depth_rates?.length

              ? data.depth_rates

              : [
                  {
                    from_depth:
                      0,

                    to_depth:
                      200,

                    rate_per_ft:
                      "",
                  },
                ],


          casing_details:
            data.casing_details ||
            [],

        });


        setEditingPointId(
          point.id
        );


        setShowForm(true);


        window.scrollTo({

          top: 0,

          behavior:
            "smooth",

        });


      } catch (err) {

        console.error(
          "Error loading point:",
          err
        );


        setError(
          err.response?.data?.message ||
            "Unable to load point details."
        );

      }

    };


  // =====================================================
  // VIEW COMPLETE POINT DETAILS
  // =====================================================

  const handleViewPoint =
    async (point) => {

      try {

        setError("");

        setSuccess("");


        const response =
          await api.get(
            `/point/${point.id}`
          );


        const data =
          response.data.point ||
          response.data;


        setSelectedPoint(data);


        setShowPointDetails(
          true
        );


      } catch (err) {

        console.error(
          "Error loading complete point details:",
          err
        );


        setError(
          err.response?.data?.message ||
            "Unable to load complete point details."
        );

      }

    };


  // =====================================================
  // CLOSE POINT DETAILS
  // =====================================================

  const handleClosePointDetails =
    () => {

      setShowPointDetails(
        false
      );

      setSelectedPoint(
        null
      );

    };


  // =====================================================
  // DELETE POINT
  // =====================================================

  const handleDeletePoint =
    async (pointId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this point?"
        );


      if (!confirmed)
        return;


      try {

        setError("");

        setSuccess("");


        await api.delete(
          `/point/${pointId}`
        );


        setSuccess(
          "Point deleted successfully."
        );


        await fetchPoints();


        if (
          fromDate &&
          toDate
        ) {

          await fetchSummary();

        }


      } catch (err) {

        console.error(
          "Error deleting point:",
          err
        );


        setError(
          err.response?.data?.message ||
            "Unable to delete point."
        );

      }

    };


  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleDashboard = () => {

    setMenuOpen(false);

    navigate(
      `/dashboard/${id}`
    );

  };


  const handleEmployeePage = () => {

    setMenuOpen(false);

    navigate(
      `/employee/${id}`
    );

  };


  const handleFuelPage = () => {

    setMenuOpen(false);

    navigate(
      `/fuel/${id}`
    );

  };


  const handleOwnerPage = () => {

    setMenuOpen(false);

    navigate(
      "/owner"
    );

  };


  const handleBack = () => {

    navigate(-1);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    setMenuOpen(false);


    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "userType"
    );


    navigate("/login");

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !lorry) {
    return (
      <LoadingContainer>
        <LoadingLogo>
          <Logo
            src={rigLogo}
            alt="Sri Murugan Rig Service"
          />
        </LoadingLogo>

        <LoadingTitle>
          Sri Murugan Rig Service
        </LoadingTitle>

        <LoadingText>
          Loading point details...
        </LoadingText>

        <LoadingSpinner />
      </LoadingContainer>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <PageContainer>

      {/* =================================================
          SIDEBAR OVERLAY
      ================================================= */}

      {menuOpen && (
        <SidebarOverlay
          onClick={() =>
            setMenuOpen(false)
          }
        />
      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar $open={menuOpen}>

        <SidebarHeader>

          <SidebarBrand>

            <SidebarLogo>

              <Logo
                src={rigLogo}
                alt="Sri Murugan Rig Service"
              />

            </SidebarLogo>


            <SidebarBrandText>

              <SidebarCompany>
                Sri Murugan
              </SidebarCompany>

              <SidebarService>
                RIG SERVICE
              </SidebarService>

            </SidebarBrandText>

          </SidebarBrand>


          <CloseButton
            type="button"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            ×
          </CloseButton>

        </SidebarHeader>


        <SidebarDivider />


        {/* =================================================
            CURRENT RIG
        ================================================= */}

        <CurrentRig>

          <CurrentRigLabel>
            CURRENT RIG
          </CurrentRigLabel>


          <CurrentRigNumber>
            {lorry?.registration_number ||
              "—"}
          </CurrentRigNumber>


          <CurrentRigStatus>

            <SmallStatusDot />

            Active

          </CurrentRigStatus>

        </CurrentRig>


        {/* =================================================
            MANAGEMENT
        ================================================= */}

        <MenuSection>

          <MenuSectionTitle>
            MANAGEMENT
          </MenuSectionTitle>


          <MenuItem
            type="button"
            onClick={
              handleDashboard
            }
          >

            <MenuIcon>
              ◈
            </MenuIcon>

            <MenuText>
              Rig Overview
            </MenuText>

          </MenuItem>


          <MenuItem
            type="button"
            onClick={
              handleEmployeePage
            }
          >

            <MenuIcon>
              👷
            </MenuIcon>

            <MenuText>
              Employees
            </MenuText>

          </MenuItem>


          <MenuItem
            type="button"
            onClick={
              handleFuelPage
            }
          >

            <MenuIcon>
              ⛽
            </MenuIcon>

            <MenuText>
              Fuel Management
            </MenuText>

          </MenuItem>


          <MenuItem
            type="button"
            $active
          >

            <MenuIcon>
              📍
            </MenuIcon>

            <MenuText>
              Point Details
            </MenuText>

          </MenuItem>

        </MenuSection>


        {/* =================================================
            BUSINESS
        ================================================= */}

        <MenuSection>

          <MenuSectionTitle>
            BUSINESS
          </MenuSectionTitle>


          <MenuItem
            type="button"
            onClick={
              handleOwnerPage
            }
          >

            <MenuIcon>
              ◫
            </MenuIcon>

            <MenuText>
              Rig Fleet
            </MenuText>

          </MenuItem>

        </MenuSection>


        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <SidebarBottom>

          <SidebarBackButton
            type="button"
            onClick={handleBack}
          >

            <span>
              ←
            </span>

            Back

          </SidebarBackButton>


          <LogoutButton
            type="button"
            onClick={handleLogout}
          >

            <LogoutIcon>
              ↪
            </LogoutIcon>

            Logout

          </LogoutButton>

        </SidebarBottom>

      </Sidebar>


      {/* =================================================
          HEADER
      ================================================= */}

      <Header>

        <HeaderInner>

          <HeaderLeft>

            <MenuButton
              type="button"
              onClick={() =>
                setMenuOpen(true)
              }
            >

              <HamburgerLine />
              <HamburgerLine />
              <HamburgerLine />

            </MenuButton>


            <Brand>

              <BrandLogo>

                <Logo
                  src={rigLogo}
                  alt="Sri Murugan Rig Service"
                />

              </BrandLogo>


              <BrandText>

                <CompanyName>
                  Sri Murugan Rig Service
                </CompanyName>


                <CompanyTagline>
                  Since 2001 — Reliability at Every Depth.
                </CompanyTagline>

              </BrandText>

            </Brand>

          </HeaderLeft>


          <HeaderRig>

            <HeaderRigLabel>
              CURRENT RIG
            </HeaderRigLabel>


            <HeaderRigNumber>
              {lorry?.registration_number ||
                "—"}
            </HeaderRigNumber>

          </HeaderRig>

        </HeaderInner>

      </Header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <MainContent>


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <PageHeading>

          <Eyebrow>
            DRILLING OPERATIONS
          </Eyebrow>


          <PageTitle>
            Point Details
          </PageTitle>


          <PageSubtitle>
            Manage drilling points, depth rates,
            casing details and payment information
            for this rig.
          </PageSubtitle>

        </PageHeading>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <Alert $type="error">

            <AlertIcon>
              !
            </AlertIcon>


            <AlertText>
              {error}
            </AlertText>


            <AlertClose
              type="button"
              onClick={() =>
                setError("")
              }
            >
              ×
            </AlertClose>

          </Alert>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (

          <Alert $type="success">

            <AlertIcon>
              ✓
            </AlertIcon>


            <AlertText>
              {success}
            </AlertText>


            <AlertClose
              type="button"
              onClick={() =>
                setSuccess("")
              }
            >
              ×
            </AlertClose>

          </Alert>

        )}


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <SummaryGrid>

          <SummaryCard>

            <SummaryIcon $type="points">
              📍
            </SummaryIcon>


            <SummaryContent>

              <SummaryLabel>
                TOTAL POINTS
              </SummaryLabel>


              <SummaryValue>
                {overallSummary.total_points}
              </SummaryValue>

            </SummaryContent>

          </SummaryCard>


          <SummaryCard>

            <SummaryIcon $type="depth">
              ⛏
            </SummaryIcon>


            <SummaryContent>

              <SummaryLabel>
                TOTAL DEPTH
              </SummaryLabel>


              <SummaryValue>

                {Number(
                  overallSummary.total_depth ||
                    0
                ).toLocaleString()}

                <SummaryUnit>
                  {" "}ft
                </SummaryUnit>

              </SummaryValue>

            </SummaryContent>

          </SummaryCard>


          <SummaryCard>

            <SummaryIcon $type="rpm">
              ◉
            </SummaryIcon>


            <SummaryContent>

              <SummaryLabel>
                RUNNING RPM
              </SummaryLabel>


              <SummaryValue>

                {Number(
                  overallSummary.total_running_rpm ||
                    0
                ).toFixed(2)}

              </SummaryValue>

            </SummaryContent>

          </SummaryCard>


          <SummaryCard>

            <SummaryIcon $type="amount">
              ₹
            </SummaryIcon>


            <SummaryContent>

              <SummaryLabel>
                TOTAL AMOUNT
              </SummaryLabel>


              <SummaryValue>

                ₹
                {Number(
                  overallSummary.total_amount ||
                    0
                ).toLocaleString()}

              </SummaryValue>

            </SummaryContent>

          </SummaryCard>

        </SummaryGrid>


        {/* =================================================
            DATE SUMMARY
        ================================================= */}

        <SummarySection>

          <SummarySectionHeader>

            <div>

              <SectionTitle>
                Monthly / Date Summary
              </SectionTitle>


              <SectionDescription>
                Select a date range to calculate
                drilling performance and amounts.
              </SectionDescription>

            </div>

          </SummarySectionHeader>


          <DateFilter>

            <DateField>

              <FieldLabel>
                FROM DATE
              </FieldLabel>


              <Input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(
                    e.target.value
                  )
                }
              />

            </DateField>


            <DateField>

              <FieldLabel>
                TO DATE
              </FieldLabel>


              <Input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(
                    e.target.value
                  )
                }
              />

            </DateField>


            <SummaryButton
              type="button"
              onClick={
                fetchSummary
              }
            >
              Generate Summary
            </SummaryButton>

          </DateFilter>


          <DetailedSummary>

            <DetailStat>

              <ModalDetailLabel>
                TOTAL POINTS
              </ModalDetailLabel>

              <ModalDetailValue>
                {summary.total_points}
              </ModalDetailValue>

            </DetailStat>


            <DetailStat>

              <DetailLabel>
                TOTAL DEPTH
              </DetailLabel>


              <DetailValue>

                {Number(
                  summary.total_depth ||
                    0
                ).toLocaleString()}

                {" "}ft

              </DetailValue>

            </DetailStat>


            <DetailStat>

              <DetailLabel>
                TOTAL RUNNING RPM
              </DetailLabel>


              <DetailValue>

                {Number(
                  summary.total_running_rpm ||
                    0
                ).toFixed(2)}

              </DetailValue>

            </DetailStat>


            <DetailStat>

              <DetailLabel>
                AVERAGE DEPTH / RPM
              </DetailLabel>


              <DetailValue>

                {summary.average_depth_per_rpm

                  ? Number(
                      summary.average_depth_per_rpm
                    ).toFixed(4)

                  : "—"}

              </DetailValue>

            </DetailStat>


            <DetailStat>

              <DetailLabel>
                DRILLING AMOUNT
              </DetailLabel>


              <DetailValue>

                ₹
                {Number(
                  summary.total_drilling_amount ||
                    0
                ).toLocaleString()}

              </DetailValue>

            </DetailStat>


            <DetailStat>

              <DetailLabel>
                CASING AMOUNT
              </DetailLabel>


              <DetailValue>

                ₹
                {Number(
                  summary.total_casing_amount ||
                    0
                ).toLocaleString()}

              </DetailValue>

            </DetailStat>


            <DetailStat>

              <DetailLabel>
                TOTAL AMOUNT
              </DetailLabel>


              <DetailValue>

                ₹
                {Number(
                  summary.total_amount ||
                    0
                ).toLocaleString()}

              </DetailValue>

            </DetailStat>


            <DetailStat>

              <DetailLabel>
                GIVEN AMOUNT
              </DetailLabel>


              <DetailValue>

                ₹
                {Number(
                  summary.total_given_amount ||
                    0
                ).toLocaleString()}

              </DetailValue>

            </DetailStat>


            <DetailStat $balance>

              <DetailLabel>
                BALANCE
              </DetailLabel>


              <DetailValue>

                ₹
                {Number(
                  summary.total_balance ||
                    0
                ).toLocaleString()}

              </DetailValue>

            </DetailStat>

          </DetailedSummary>

        </SummarySection>


        {/* =================================================
            ADD POINT BUTTON
        ================================================= */}

        {!showForm && (

          <ActionRow>

            <AddPointButton
              type="button"
              onClick={
                handleAddPoint
              }
            >

              <span>
                +
              </span>

              Add New Point

            </AddPointButton>

          </ActionRow>

        )}


        {/* =================================================
            POINT FORM
        ================================================= */}

        {showForm && (

          <FormCard>

            <FormHeader>

              <div>

                <FormTitle>

                  {editingPointId
                    ? "Edit Point"
                    : "Add New Point"}

                </FormTitle>


                <FormSubtitle>
                  Enter complete drilling point
                  information below.
                </FormSubtitle>

              </div>


              <CloseFormButton
                type="button"
                onClick={
                  handleCloseForm
                }
              >
                ×
              </CloseFormButton>

            </FormHeader>


            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <FormSection>

                <FormSectionTitle>
                  Point Information
                </FormSectionTitle>


                <FormGrid>

                  <FieldGroup>

                    <FieldLabel>
                      DATE
                    </FieldLabel>


                    <Input
                      type="date"
                      name="point_date"
                      value={
                        form.point_date
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </FieldGroup>

                </FormGrid>

              </FormSection>


              {/* =================================================
                  BROKER
              ================================================= */}

              <FormSection>

                <FormSectionTitle>
                  Broker Details
                </FormSectionTitle>


                <FormGrid>

                  <FieldGroup>

                    <FieldLabel>
                      BROKER NAME
                    </FieldLabel>


                    <Input
                      name="broker_name"
                      value={
                        form.broker_name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter broker name"
                      required
                    />

                  </FieldGroup>


                  <FieldGroup>

                    <FieldLabel>
                      BROKER LOCATION
                    </FieldLabel>


                    <Input
                      name="broker_location"
                      value={
                        form.broker_location
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter broker location"
                      required
                    />

                  </FieldGroup>


                  <FieldGroup>

                    <FieldLabel>
                      BROKER PHONE
                    </FieldLabel>


                    <Input
                      name="broker_phone"
                      value={
                        form.broker_phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter broker phone"
                      inputMode="numeric"
                      required
                    />

                  </FieldGroup>

                </FormGrid>

              </FormSection>


              {/* =================================================
                  PARTY
              ================================================= */}

              <FormSection>

                <FormSectionTitle>
                  Party Details
                </FormSectionTitle>


                <FormGrid>

                  <FieldGroup>

                    <FieldLabel>
                      PARTY NAME
                    </FieldLabel>


                    <Input
                      name="party_name"
                      value={
                        form.party_name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Party for whom drilling is done"
                      required
                    />

                  </FieldGroup>


                  <FieldGroup>

                    <FieldLabel>
                      PARTY LOCATION
                    </FieldLabel>


                    <Input
                      name="party_location"
                      value={
                        form.party_location
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Area / location"
                      required
                    />

                  </FieldGroup>


                  <FieldGroup>

                    <FieldLabel>
                      PARTY MOBILE
                    </FieldLabel>


                    <Input
                      name="party_mobile"
                      value={
                        form.party_mobile
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Party mobile number"
                      inputMode="numeric"
                      required
                    />

                  </FieldGroup>

                </FormGrid>

              </FormSection>


              {/* =================================================
                  DRILLING
              ================================================= */}

              <FormSection>

                <FormSectionTitle>
                  Drilling Details
                </FormSectionTitle>


                <FormGrid>

                  <FieldGroup>

                    <FieldLabel>
                      TOTAL DEPTH (FT)
                    </FieldLabel>


                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      name="total_depth"
                      value={
                        form.total_depth
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="00"
                      required
                    />

                  </FieldGroup>


                  <FieldGroup>

                    <FieldLabel>
                      STARTING RPM
                    </FieldLabel>


                    <Input
                      type="number"
                      step="0.01"
                      name="starting_rpm"
                      value={
                        form.starting_rpm
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="00.00"
                      required
                    />

                  </FieldGroup>


                  <FieldGroup>

                    <FieldLabel>
                      CLOSING RPM
                    </FieldLabel>


                    <Input
                      type="number"
                      step="0.01"
                      name="closing_rpm"
                      value={
                        form.closing_rpm
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="00.00"
                      required
                    />

                  </FieldGroup>

                </FormGrid>


                <CalculationBox>

                  <CalculationItem>

                    <CalculationLabel>
                      RUNNING RPM
                    </CalculationLabel>


                    <CalculationValue>
                      {runningRPM.toFixed(2)}
                    </CalculationValue>


                    <CalculationFormula>
                      Closing RPM − Starting RPM
                    </CalculationFormula>

                  </CalculationItem>


                  <CalculationDivider />


                  <CalculationItem>

                    <CalculationLabel>
                      AVG DEPTH / RPM
                    </CalculationLabel>


                    <CalculationValue>
                      {averageDepth.toFixed(4)}
                    </CalculationValue>


                    <CalculationFormula>
                      Total Depth ÷ Running RPM
                    </CalculationFormula>

                  </CalculationItem>

                </CalculationBox>

              </FormSection>


              {/* =================================================
                  DEPTH RATES
              ================================================= */}

              <FormSection>

                <SectionTitleRow>

                  <div>

                    <FormSectionTitle>
                      Depth Rate
                    </FormSectionTitle>


                    <FormSectionDescription>
                      Enter the rate manually for
                      each drilling depth range.
                    </FormSectionDescription>

                  </div>


                  <SmallAddButton
                    type="button"
                    onClick={
                      addDepthRate
                    }
                  >
                    + Add Rate
                  </SmallAddButton>

                </SectionTitleRow>


                <RateTable>

                  <RateHeader>

                    <RateHeaderCell>
                      FROM (FT)
                    </RateHeaderCell>


                    <RateHeaderCell>
                      TO (FT)
                    </RateHeaderCell>


                    <RateHeaderCell>
                      RATE / FT
                    </RateHeaderCell>


                    <RateHeaderCell>
                      AMOUNT
                    </RateHeaderCell>


                    <RateHeaderCell>
                      ACTION
                    </RateHeaderCell>

                  </RateHeader>


                  {form.depth_rates.map(
                    (rate, index) => {

                      const from =
                        Number(
                          rate.from_depth
                        ) || 0;


                      const to =
                        Number(
                          rate.to_depth
                        ) || 0;


                      const rateValue =
                        Number(
                          rate.rate_per_ft
                        ) || 0;


                      const applicableDepth =
                        Number(
                          form.total_depth
                        ) > from

                          ? Math.max(
                              0,
                              Math.min(
                                Number(
                                  form.total_depth
                                ),
                                to
                              ) - from
                            )

                          : 0;


                      const rowAmount =
                        applicableDepth *
                        rateValue;


                      return (

                        <RateRow
                          key={index}
                        >

                          <RateInput
                            type="number"
                            value={
                              rate.from_depth
                            }
                            onChange={(e) =>
                              handleDepthRateChange(
                                index,
                                "from_depth",
                                e.target.value
                              )
                            }
                          />


                          <RateInput
                            type="number"
                            value={
                              rate.to_depth
                            }
                            onChange={(e) =>
                              handleDepthRateChange(
                                index,
                                "to_depth",
                                e.target.value
                              )
                            }
                          />


                          <RateInput
                            type="number"
                            step="0.01"
                            value={
                              rate.rate_per_ft
                            }
                            onChange={(e) =>
                              handleDepthRateChange(
                                index,
                                "rate_per_ft",
                                e.target.value
                              )
                            }
                            placeholder="00"
                          />


                          <AmountCell>

                            ₹
                            {rowAmount.toLocaleString()}

                          </AmountCell>


                          <RemoveButton
                            type="button"
                            onClick={() =>
                              removeDepthRate(
                                index
                              )
                            }
                          >
                            ×
                          </RemoveButton>

                        </RateRow>

                      );

                    }
                  )}

                </RateTable>


                <CalculationTotal>

                  <span>
                    Drilling Amount
                  </span>


                  <strong>

                    ₹
                    {drillingAmount.toLocaleString()}

                  </strong>

                </CalculationTotal>

              </FormSection>


              {/* =================================================
                  CASING
              ================================================= */}

              <FormSection>

                <SectionTitleRow>

                  <div>

                    <FormSectionTitle>
                      Casing Details
                    </FormSectionTitle>


                    <FormSectionDescription>
                      Multiple casing pipe sizes can
                      be entered for one point.
                    </FormSectionDescription>

                  </div>


                  <SmallAddButton
                    type="button"
                    onClick={
                      addCasing
                    }
                  >
                    + Add Casing
                  </SmallAddButton>

                </SectionTitleRow>


                {form.casing_details.length ===
                0 ? (

                  <EmptyCasing>

                    No casing added.

                    <strong>
                      + Add Casing
                    </strong>

                    if this point has casing.

                  </EmptyCasing>

                ) : (

                  <RateTable>

                    <RateHeader>

                      <RateHeaderCell>
                        PIPE SIZE
                      </RateHeaderCell>


                      <RateHeaderCell>
                        DEPTH (FT)
                      </RateHeaderCell>


                      <RateHeaderCell>
                        RATE / FT
                      </RateHeaderCell>


                      <RateHeaderCell>
                        AMOUNT
                      </RateHeaderCell>


                      <RateHeaderCell>
                        ACTION
                      </RateHeaderCell>

                    </RateHeader>


                    {form.casing_details.map(
                      (
                        casing,
                        index
                      ) => {

                        const casingAmount =
                          (
                            Number(
                              casing.casing_depth
                            ) || 0
                          ) *
                          (
                            Number(
                              casing.rate_per_ft
                            ) || 0
                          );


                        return (

                          <RateRow
                            key={index}
                          >

                            <SelectInput
                              value={
                                casing.pipe_size
                              }
                              onChange={(e) =>
                                handleCasingChange(
                                  index,
                                  "pipe_size",
                                  e.target.value
                                )
                              }
                            >

                              <option value="5 inch">
                                5 inch
                              </option>

                              <option value="7 inch">
                                7 inch
                              </option>

                              <option value="8 inch">
                                8 inch
                              </option>

                              <option value="10 inch">
                                10 inch
                              </option>

                            </SelectInput>


                            <RateInput
                              type="number"
                              step="0.01"
                              value={
                                casing.casing_depth
                              }
                              onChange={(e) =>
                                handleCasingChange(
                                  index,
                                  "casing_depth",
                                  e.target.value
                                )
                              }
                              placeholder="00"
                            />


                            <RateInput
                              type="number"
                              step="0.01"
                              value={
                                casing.rate_per_ft
                              }
                              onChange={(e) =>
                                handleCasingChange(
                                  index,
                                  "rate_per_ft",
                                  e.target.value
                                )
                              }
                              placeholder="00"
                            />


                            <AmountCell>

                              ₹
                              {casingAmount.toLocaleString()}

                            </AmountCell>


                            <RemoveButton
                              type="button"
                              onClick={() =>
                                removeCasing(
                                  index
                                )
                              }
                            >
                              ×
                            </RemoveButton>

                          </RateRow>

                        );

                      }
                    )}

                  </RateTable>

                )}


                <CalculationTotal>

                  <span>
                    Casing Amount
                  </span>


                  <strong>

                    ₹
                    {casingAmount.toLocaleString()}

                  </strong>

                </CalculationTotal>

              </FormSection>


              {/* =================================================
                  PAYMENT
              ================================================= */}

              <FormSection>

                <FormSectionTitle>
                  Payment
                </FormSectionTitle>


                <FormGrid>

                  <FieldGroup>

                    <FieldLabel>
                      GIVEN AMOUNT
                    </FieldLabel>


                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      name="given_amount"
                      value={
                        form.given_amount
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="00"
                    />

                  </FieldGroup>

                </FormGrid>


                <PaymentPreview>

                  <PaymentRow>

                    <span>
                      Drilling Amount
                    </span>


                    <strong>
                      ₹
                      {drillingAmount.toLocaleString()}
                    </strong>

                  </PaymentRow>


                  <PaymentRow>

                    <span>
                      Casing Amount
                    </span>


                    <strong>
                      ₹
                      {casingAmount.toLocaleString()}
                    </strong>

                  </PaymentRow>


                  <PaymentRow $total>

                    <span>
                      Total Amount
                    </span>


                    <strong>
                      ₹
                      {totalAmount.toLocaleString()}
                    </strong>

                  </PaymentRow>


                  <PaymentRow>

                    <span>
                      Given Amount
                    </span>


                    <strong>
                      ₹
                      {givenAmount.toLocaleString()}
                    </strong>

                  </PaymentRow>


                  <PaymentRow $balance>

                    <span>
                      Balance
                    </span>


                    <strong>
                      ₹
                      {balance.toLocaleString()}
                    </strong>

                  </PaymentRow>

                </PaymentPreview>

              </FormSection>


              {/* =================================================
                  FORM ACTIONS
              ================================================= */}

              <FormActions>

                <CancelButton
                  type="button"
                  onClick={
                    handleCloseForm
                  }
                >
                  Cancel
                </CancelButton>


                <SaveButton
                  type="submit"
                >

                  {editingPointId
                    ? "Update Point"
                    : "Save Point"}

                </SaveButton>

              </FormActions>

            </form>

          </FormCard>

        )}


        {/* =================================================
            DRILLING POINTS
        ================================================= */}

        <PointsSection>

          <PointsHeader>

            <div>

              <SectionTitle>
                Drilling Points
              </SectionTitle>


              <SectionDescription>
                All drilling points recorded for
                this rig.
              </SectionDescription>

            </div>


            <PointCount>
              {points.length}{" "}

              {points.length === 1
                ? "Point"
                : "Points"}
            </PointCount>

          </PointsHeader>


          {/* =================================================
              LOADING
          ================================================= */}

          {pointsLoading ? (

            <LoadingPoints>
              Loading points...
            </LoadingPoints>

          ) : points.length === 0 ? (


            /* =================================================
               EMPTY
            ================================================= */

            <EmptyPoints>

              <EmptyPointsIcon>
                📍
              </EmptyPointsIcon>


              <EmptyPointsTitle>
                No drilling points yet
              </EmptyPointsTitle>


              <EmptyPointsText>
                Add your first drilling point
                using the button above.
              </EmptyPointsText>


              <AddPointButton
                type="button"
                onClick={
                  handleAddPoint
                }
              >

                <span>
                  +
                </span>

                Add Point

              </AddPointButton>

            </EmptyPoints>


          ) : (


            /* =================================================
               TABLE
            ================================================= */

            <PointsTableWrapper>

              <PointsTable>

                <thead>

                  <tr>

                    {/* DATE */}

                    <TableHeader>
                      DATE
                    </TableHeader>


                    {/* BROKER */}

                    <TableHeader>
                      BROKER NAME
                    </TableHeader>


                    {/* PARTY */}

                    <TableHeader>
                      PARTY NAME
                    </TableHeader>


                    {/* LOCATION */}

                    <TableHeader>
                      LOCATION
                    </TableHeader>


                    {/* DEPTH */}

                    <TableHeader>
                      DEPTH
                    </TableHeader>


                    {/* TOTAL */}

                    <TableHeader>
                      TOTAL
                    </TableHeader>


                    {/* GIVEN */}

                    <TableHeader>
                      GIVEN
                    </TableHeader>


                    {/* BALANCE */}

                    <TableHeader>
                      BALANCE
                    </TableHeader>


                    {/* ACTION */}

                    <TableHeader>
                      ACTION
                    </TableHeader>

                  </tr>

                </thead>


                <tbody>

                  {points.map(
                    (point) => (

                      <TableRow
                        key={point.id}
                      >


                        {/* =================================
                            DATE
                        ================================= */}

                        <TableCell>

                          <DateValue>

                            {point.point_date

                              ? new Date(
                                  point.point_date
                                ).toLocaleDateString(
                                  "en-IN"
                                )

                              : "—"}

                          </DateValue>

                        </TableCell>


                        {/* =================================
                            BROKER
                        ================================= */}

                        <TableCell>

                          <PersonCell>

                            <PersonName>

                              {point.broker_name ||
                                "—"}

                            </PersonName>


                            {point.broker_phone && (

                              <PersonPhone>

                                {point.broker_phone}

                              </PersonPhone>

                            )}

                          </PersonCell>

                        </TableCell>


                        {/* =================================
                            PARTY
                        ================================= */}

                        <TableCell>

                          <PersonCell>

                            <PersonName>

                              {point.party_name ||
                                "—"}

                            </PersonName>


                            {point.party_mobile && (

                              <PersonPhone>

                                {point.party_mobile}

                              </PersonPhone>

                            )}

                          </PersonCell>

                        </TableCell>


                        {/* =================================
                            LOCATION
                        ================================= */}

                        <TableCell>

                          <LocationValue>

                            {point.party_location ||
                              "—"}

                          </LocationValue>

                        </TableCell>


                        {/* =================================
                            DEPTH
                        ================================= */}

                        <TableCell>

                          <DepthValue>

                            {Number(
                              point.total_depth ||
                                0
                            ).toLocaleString()}

                            <DepthUnit>
                              {" "}ft
                            </DepthUnit>

                          </DepthValue>

                        </TableCell>


                        {/* =================================
                            TOTAL
                        ================================= */}

                        <TableCell>

                          <MoneyValue>

                            ₹
                            {Number(
                              point.total_amount ||
                                0
                            ).toLocaleString()}

                          </MoneyValue>

                        </TableCell>


                        {/* =================================
                            GIVEN
                        ================================= */}

                        <TableCell>

                          <MoneyValue>

                            ₹
                            {Number(
                              point.given_amount ||
                                0
                            ).toLocaleString()}

                          </MoneyValue>

                        </TableCell>


                        {/* =================================
                            BALANCE
                        ================================= */}

                        <TableCell>

                          <BalanceValue
                            $negative={
                              Number(
                                point.balance ||
                                  0
                              ) < 0
                            }
                          >

                            ₹
                            {Number(
                              point.balance ||
                                0
                            ).toLocaleString()}

                          </BalanceValue>

                        </TableCell>


                        {/* =================================
                            ACTION
                        ================================= */}

                        <TableCell>

                          <ActionButtons>


                            {/* VIEW */}

                            <ViewButton
                              type="button"
                              onClick={() =>
                                handleViewPoint(
                                  point
                                )
                              }
                            >

                              View

                            </ViewButton>


                            {/* EDIT */}

                            <EditButton
                              type="button"
                              onClick={() =>
                                handleEditPoint(
                                  point
                                )
                              }
                            >

                              Edit

                            </EditButton>


                            {/* DELETE */}

                            <DeleteButton
                              type="button"
                              onClick={() =>
                                handleDeletePoint(
                                  point.id
                                )
                              }
                            >

                              Delete

                            </DeleteButton>


                          </ActionButtons>

                        </TableCell>


                      </TableRow>

                    )
                  )}

                </tbody>

              </PointsTable>

            </PointsTableWrapper>

          )}

        </PointsSection>


      </MainContent>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer>

        ©{" "}
        {new Date().getFullYear()}{" "}
        Sri Murugan Rig Service

      </Footer>


      {/* =================================================
          COMPLETE POINT DETAILS MODAL
      ================================================= */}

      {showPointDetails &&
        selectedPoint && (

          <DetailsOverlay
            onClick={
              handleClosePointDetails
            }
          >

            <DetailsModal
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <DetailsHeader>

                <div>

                  <DetailsEyebrow>
                    DRILLING POINT
                  </DetailsEyebrow>


                  <DetailsTitle>
                    Complete Point Details
                  </DetailsTitle>


                  <DetailsSubtitle>
                    Complete information recorded
                    for this drilling point.
                  </DetailsSubtitle>

                </div>


                <DetailsCloseButton
                  type="button"
                  onClick={
                    handleClosePointDetails
                  }
                >
                  ×
                </DetailsCloseButton>

              </DetailsHeader>


              {/* =================================================
                  POINT INFORMATION
              ================================================= */}

              <DetailsSection>

                <DetailsSectionTitle>
                  Point Information
                </DetailsSectionTitle>


                <DetailsGrid>

                  <DetailBox>

                    <DetailLabel>
                      DATE
                    </DetailLabel>


                    <DetailValue>

                      {selectedPoint.point_date

                        ? new Date(
                            selectedPoint.point_date
                          ).toLocaleDateString(
                            "en-IN"
                          )

                        : "—"}

                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      POINT ID
                    </DetailLabel>


                    <DetailValue>
                      #{selectedPoint.id}
                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      RIG
                    </DetailLabel>


                    <DetailValue>
                      {lorry?.registration_number ||
                        "—"}
                    </DetailValue>

                  </DetailBox>

                </DetailsGrid>

              </DetailsSection>


              {/* =================================================
                  BROKER DETAILS
              ================================================= */}

              <DetailsSection>

                <DetailsSectionTitle>
                  Broker Details
                </DetailsSectionTitle>


                <DetailsGrid>

                  <DetailBox>

                    <DetailLabel>
                      BROKER NAME
                    </DetailLabel>


                    <DetailValue>
                      {
                        selectedPoint.broker_name ||
                        "—"
                      }
                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      BROKER LOCATION
                    </DetailLabel>


                    <DetailValue>
                      {
                        selectedPoint.broker_location ||
                        "—"
                      }
                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      BROKER PHONE
                    </DetailLabel>


                    <DetailValue>
                      {
                        selectedPoint.broker_phone ||
                        "—"
                      }
                    </DetailValue>

                  </DetailBox>

                </DetailsGrid>

              </DetailsSection>


              {/* =================================================
                  PARTY DETAILS
              ================================================= */}

              <DetailsSection>

                <DetailsSectionTitle>
                  Party Details
                </DetailsSectionTitle>


                <DetailsGrid>

                  <DetailBox>

                    <DetailLabel>
                      PARTY NAME
                    </DetailLabel>


                    <DetailValue>
                      {
                        selectedPoint.party_name ||
                        "—"
                      }
                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      PARTY LOCATION
                    </DetailLabel>


                    <DetailValue>
                      {
                        selectedPoint.party_location ||
                        "—"
                      }
                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      PARTY MOBILE
                    </DetailLabel>


                    <DetailValue>
                      {
                        selectedPoint.party_mobile ||
                        "—"
                      }
                    </DetailValue>

                  </DetailBox>

                </DetailsGrid>

              </DetailsSection>


              {/* =================================================
                  DRILLING DETAILS
              ================================================= */}

              <DetailsSection>

                <DetailsSectionTitle>
                  Drilling Details
                </DetailsSectionTitle>


                <DetailsGrid>

                  <DetailBox>

                    <DetailLabel>
                      TOTAL DEPTH
                    </DetailLabel>


                    <DetailValue>

                      {Number(
                        selectedPoint.total_depth ||
                          0
                      ).toLocaleString()}

                      {" "}ft

                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      STARTING RPM
                    </DetailLabel>


                    <DetailValue>

                      {Number(
                        selectedPoint.starting_rpm ||
                          0
                      ).toFixed(2)}

                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      CLOSING RPM
                    </DetailLabel>


                    <DetailValue>

                      {Number(
                        selectedPoint.closing_rpm ||
                          0
                      ).toFixed(2)}

                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      RUNNING RPM
                    </DetailLabel>


                    <DetailValue>

                      {Number(
                        selectedPoint.running_rpm ||
                          (
                            Number(
                              selectedPoint.closing_rpm ||
                                0
                            ) -
                            Number(
                              selectedPoint.starting_rpm ||
                                0
                            )
                          )
                      ).toFixed(2)}

                    </DetailValue>

                  </DetailBox>


                  <DetailBox>

                    <DetailLabel>
                      AVG DEPTH / RPM
                    </DetailLabel>


                    <DetailValue>

                      {selectedPoint.running_rpm > 0

                        ? (
                            Number(
                              selectedPoint.total_depth ||
                                0
                            ) /
                            Number(
                              selectedPoint.running_rpm
                            )
                          ).toFixed(4)

                        : "—"}

                    </DetailValue>

                  </DetailBox>

                </DetailsGrid>

              </DetailsSection>


              {/* =================================================
                  DEPTH RATES
              ================================================= */}

              <DetailsSection>

                <DetailsSectionTitle>
                  Depth Rate Details
                </DetailsSectionTitle>


                {selectedPoint.depth_rates &&
                selectedPoint.depth_rates.length > 0 ? (

                  <DetailsTableWrapper>

                    <DetailsTable>

                      <thead>

                        <tr>

                          <DetailsTableHeader>
                            FROM
                          </DetailsTableHeader>


                          <DetailsTableHeader>
                            TO
                          </DetailsTableHeader>


                          <DetailsTableHeader>
                            RATE / FT
                          </DetailsTableHeader>


                          <DetailsTableHeader>
                            DEPTH
                          </DetailsTableHeader>


                          <DetailsTableHeader>
                            AMOUNT
                          </DetailsTableHeader>

                        </tr>

                      </thead>


                      <tbody>

                        {selectedPoint.depth_rates.map(
                          (
                            rate,
                            index
                          ) => {

                            const from =
                              Number(
                                rate.from_depth
                              ) || 0;


                            const to =
                              Number(
                                rate.to_depth
                              ) || 0;


                            const ratePerFt =
                              Number(
                                rate.rate_per_ft
                              ) || 0;


                            const totalDepth =
                              Number(
                                selectedPoint.total_depth
                              ) || 0;


                            const applicableDepth =
                              totalDepth > from

                                ? Math.max(
                                    0,
                                    Math.min(
                                      totalDepth,
                                      to
                                    ) - from
                                  )

                                : 0;


                            const amount =
                              applicableDepth *
                              ratePerFt;


                            return (

                              <tr
                                key={index}
                              >

                                <DetailsTableCell>
                                  {from} ft
                                </DetailsTableCell>


                                <DetailsTableCell>
                                  {to} ft
                                </DetailsTableCell>


                                <DetailsTableCell>
                                  ₹
                                  {ratePerFt.toLocaleString()}
                                </DetailsTableCell>


                                <DetailsTableCell>
                                  {applicableDepth.toLocaleString()} ft
                                </DetailsTableCell>


                                <DetailsTableCell>
                                  ₹
                                  {amount.toLocaleString()}
                                </DetailsTableCell>

                              </tr>

                            );

                          }
                        )}

                      </tbody>

                    </DetailsTable>

                  </DetailsTableWrapper>

                ) : (

                  <NoDetails>
                    No depth rate details available.
                  </NoDetails>

                )}

              </DetailsSection>


              {/* =================================================
                  CASING DETAILS
              ================================================= */}

              <DetailsSection>

                <DetailsSectionTitle>
                  Casing Details
                </DetailsSectionTitle>


                {selectedPoint.casing_details &&
                selectedPoint.casing_details.length > 0 ? (

                  <DetailsTableWrapper>

                    <DetailsTable>

                      <thead>

                        <tr>

                          <DetailsTableHeader>
                            PIPE SIZE
                          </DetailsTableHeader>


                          <DetailsTableHeader>
                            DEPTH
                          </DetailsTableHeader>


                          <DetailsTableHeader>
                            RATE / FT
                          </DetailsTableHeader>


                          <DetailsTableHeader>
                            AMOUNT
                          </DetailsTableHeader>

                        </tr>

                      </thead>


                      <tbody>

                        {selectedPoint.casing_details.map(
                          (
                            casing,
                            index
                          ) => {

                            const depth =
                              Number(
                                casing.casing_depth ||
                                  casing.depth
                              ) || 0;


                            const rate =
                              Number(
                                casing.rate_per_ft
                              ) || 0;


                            const amount =
                              Number(
                                casing.amount
                              ) ||
                              depth * rate;


                            return (

                              <tr
                                key={index}
                              >

                                <DetailsTableCell>
                                  {
                                    casing.pipe_size ||
                                    "—"
                                  }
                                </DetailsTableCell>


                                <DetailsTableCell>
                                  {depth} ft
                                </DetailsTableCell>


                                <DetailsTableCell>
                                  ₹
                                  {rate.toLocaleString()}
                                </DetailsTableCell>


                                <DetailsTableCell>
                                  ₹
                                  {amount.toLocaleString()}
                                </DetailsTableCell>

                              </tr>

                            );

                          }
                        )}

                      </tbody>

                    </DetailsTable>

                  </DetailsTableWrapper>

                ) : (

                  <NoDetails>
                    No casing details available.
                  </NoDetails>

                )}

              </DetailsSection>


              {/* =================================================
                  PAYMENT DETAILS
              ================================================= */}

              <DetailsSection>

                <DetailsSectionTitle>
                  Payment Details
                </DetailsSectionTitle>


                <PaymentDetailsGrid>

                  <PaymentDetailBox>

                    <PaymentDetailLabel>
                      TOTAL AMOUNT
                    </PaymentDetailLabel>


                    <PaymentDetailValue>

                      ₹
                      {Number(
                        selectedPoint.total_amount ||
                          0
                      ).toLocaleString()}

                    </PaymentDetailValue>

                  </PaymentDetailBox>


                  <PaymentDetailBox>

                    <PaymentDetailLabel>
                      GIVEN AMOUNT
                    </PaymentDetailLabel>


                    <PaymentDetailValue>

                      ₹
                      {Number(
                        selectedPoint.given_amount ||
                          0
                      ).toLocaleString()}

                    </PaymentDetailValue>

                  </PaymentDetailBox>


                  <PaymentDetailBox
                    $balance
                  >

                    <PaymentDetailLabel>
                      BALANCE
                    </PaymentDetailLabel>


                    <PaymentDetailValue>

                      ₹
                      {Number(
                        selectedPoint.balance ||
                          (
                            Number(
                              selectedPoint.total_amount ||
                                0
                            ) -
                            Number(
                              selectedPoint.given_amount ||
                                0
                            )
                          )
                      ).toLocaleString()}

                    </PaymentDetailValue>

                  </PaymentDetailBox>

                </PaymentDetailsGrid>

              </DetailsSection>


              {/* =================================================
                  MODAL FOOTER
              ================================================= */}

              <DetailsFooter>

                <CloseDetailsButton
                  type="button"
                  onClick={
                    handleClosePointDetails
                  }
                >
                  Close
                </CloseDetailsButton>

              </DetailsFooter>

            </DetailsModal>

          </DetailsOverlay>

        )}

    </PageContainer>
  );
};


// =====================================================
// STYLED COMPONENTS
// =====================================================

// =====================================================
// PAGE CONTAINER
// =====================================================

const PageContainer = styled.div`
  min-height: 100vh;

  width: 100%;

  background: #f6f8fa;

  color: #0b263d;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
`;


// =====================================================
// SIDEBAR OVERLAY
// =====================================================

const SidebarOverlay = styled.div`
  position: fixed;

  inset: 0;

  z-index: 999;

  background: rgba(7, 25, 40, 0.35);

  backdrop-filter: blur(2px);
`;


// =====================================================
// SIDEBAR
// =====================================================

const Sidebar = styled.aside`
  position: fixed;

  top: 0;

  left: 0;

  bottom: 0;

  z-index: 1000;

  width: 280px;

  display: flex;

  flex-direction: column;

  padding: 28px 20px;

  box-sizing: border-box;

  background: #ffffff;

  border-right: 1px solid #e5eaf0;

  box-shadow:
    10px 0 35px rgba(15, 23, 42, 0.08);

  transform: translateX(
    ${(props) =>
      props.$open
        ? "0"
        : "-105%"}
  );

  transition:
    transform 0.25s ease;
`;


// =====================================================
// SIDEBAR HEADER
// =====================================================

const SidebarHeader = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;
`;


// =====================================================
// SIDEBAR BRAND
// =====================================================

const SidebarBrand = styled.div`
  display: flex;

  align-items: center;

  gap: 12px;

  min-width: 0;
`;


// =====================================================
// SIDEBAR LOGO
// =====================================================

const SidebarLogo = styled.div`
  width: 48px;

  height: 48px;

  flex-shrink: 0;

  overflow: hidden;

  border-radius: 12px;

  border: 1px solid #e5eaf0;

  background: #ffffff;
`;


// =====================================================
// LOGO
// =====================================================

const Logo = styled.img`
  width: 100%;

  height: 100%;

  object-fit: cover;

  display: block;
`;


// =====================================================
// SIDEBAR BRAND TEXT
// =====================================================

const SidebarBrandText = styled.div`
  min-width: 0;
`;


// =====================================================
// SIDEBAR COMPANY
// =====================================================

const SidebarCompany = styled.div`
  color: #0b263d;

  font-size: 15px;

  font-weight: 850;

  line-height: 1.2;
`;


// =====================================================
// SIDEBAR SERVICE
// =====================================================

const SidebarService = styled.div`
  margin-top: 4px;

  color: #7c8b98;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.5px;
`;


// =====================================================
// CLOSE BUTTON
// =====================================================

const CloseButton = styled.button`
  display: block;

  width: 36px;

  height: 36px;

  border: none;

  border-radius: 9px;

  background: #f3f6f8;

  color: #536574;

  font-size: 22px;

  cursor: pointer;

  &:hover {
    background: #e8edf1;
  }
`;


// =====================================================
// SIDEBAR DIVIDER
// =====================================================

const SidebarDivider = styled.div`
  height: 1px;

  margin: 25px 0;

  background: #e8edf1;
`;


// =====================================================
// CURRENT RIG
// =====================================================

const CurrentRig = styled.div`
  padding: 18px;

  border-radius: 14px;

  background: #f7fafb;

  border: 1px solid #e8edf1;
`;


// =====================================================
// CURRENT RIG LABEL
// =====================================================

const CurrentRigLabel = styled.div`
  color: #94a3b8;

  font-size: 9px;

  font-weight: 850;

  letter-spacing: 1.2px;
`;


// =====================================================
// CURRENT RIG NUMBER
// =====================================================

const CurrentRigNumber = styled.div`
  margin-top: 7px;

  color: #0b263d;

  font-size: 18px;

  font-weight: 850;
`;


// =====================================================
// CURRENT RIG STATUS
// =====================================================

const CurrentRigStatus = styled.div`
  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 8px;

  color: #5f7484;

  font-size: 11px;

  font-weight: 700;
`;


// =====================================================
// SMALL STATUS DOT
// =====================================================

const SmallStatusDot = styled.span`
  width: 7px;

  height: 7px;

  border-radius: 50%;

  background: #4e8f22;

  box-shadow:
    0 0 0 4px rgba(
      78,
      143,
      34,
      0.1
    );
`;


// =====================================================
// MENU SECTION
// =====================================================

const MenuSection = styled.div`
  margin-top: 28px;
`;


// =====================================================
// MENU SECTION TITLE
// =====================================================

const MenuSectionTitle = styled.div`
  padding: 0 12px;

  margin-bottom: 9px;

  color: #a0acb6;

  font-size: 9px;

  font-weight: 850;

  letter-spacing: 1.3px;
`;


// =====================================================
// MENU ITEM
// =====================================================

const MenuItem = styled.button`
  width: 100%;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 13px 12px;

  margin-bottom: 4px;

  border: none;

  border-radius: 10px;

  background: ${(props) =>
    props.$active
      ? "#edf7e8"
      : "transparent"};

  color: ${(props) =>
    props.$active
      ? "#4e8f22"
      : "#5f7180"};

  font-size: 13px;

  font-weight: 700;

  text-align: left;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: #f2f6f8;

    color: #0b263d;
  }
`;


// =====================================================
// MENU ICON
// =====================================================

const MenuIcon = styled.span`
  width: 22px;

  text-align: center;

  font-size: 15px;
`;


// =====================================================
// MENU TEXT
// =====================================================

const MenuText = styled.span`
  flex: 1;
`;


// =====================================================
// SIDEBAR BOTTOM
// =====================================================

const SidebarBottom = styled.div`
  margin-top: auto;

  padding-top: 20px;

  border-top: 1px solid #e8edf1;
`;


// =====================================================
// SIDEBAR BACK BUTTON
// =====================================================

const SidebarBackButton = styled.button`
  width: 100%;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 12px;

  border: none;

  background: transparent;

  color: #5f7180;

  font-size: 13px;

  font-weight: 700;

  text-align: left;

  cursor: pointer;

  border-radius: 9px;

  &:hover {
    background: #f4f7f9;

    color: #0b263d;
  }
`;


// =====================================================
// LOGOUT BUTTON
// =====================================================

const LogoutButton = styled.button`
  width: 100%;

  display: flex;

  align-items: center;

  gap: 10px;

  margin-top: 4px;

  padding: 12px;

  border: none;

  border-radius: 9px;

  background: transparent;

  color: #b34b4b;

  font-size: 13px;

  font-weight: 700;

  text-align: left;

  cursor: pointer;

  &:hover {
    background: #fff2f2;
  }
`;


// =====================================================
// LOGOUT ICON
// =====================================================

const LogoutIcon = styled.span`
  font-size: 16px;
`;


// =====================================================
// HEADER
// =====================================================

const Header = styled.header`
  position: sticky;

  top: 0;

  z-index: 500;

  width: 100%;

  background: rgba(
    255,
    255,
    255,
    0.96
  );

  border-bottom: 1px solid #e5eaf0;

  backdrop-filter: blur(12px);
`;


// =====================================================
// HEADER INNER
// =====================================================

const HeaderInner = styled.div`
  width: 100%;

  max-width: 1800px;

  margin: 0 auto;

  min-height: 86px;

  padding: 0 48px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;

  @media (max-width: 700px) {
    padding: 0 20px;

    min-height: 75px;
  }
`;


// =====================================================
// HEADER LEFT
// =====================================================

const HeaderLeft = styled.div`
  display: flex;

  align-items: center;

  gap: 18px;
`;


// =====================================================
// MENU BUTTON
// =====================================================

const MenuButton = styled.button`
  display: flex;

  flex-direction: column;

  justify-content: center;

  gap: 5px;

  width: 42px;

  height: 42px;

  padding: 9px;

  border: 1px solid #e0e7ec;

  border-radius: 10px;

  background: #ffffff;

  cursor: pointer;
`;


// =====================================================
// HAMBURGER LINE
// =====================================================

const HamburgerLine = styled.span`
  display: block;

  width: 100%;

  height: 2px;

  border-radius: 2px;

  background: #0b263d;
`;


// =====================================================
// BRAND
// =====================================================

const Brand = styled.div`
  display: flex;

  align-items: center;

  gap: 13px;
`;


// =====================================================
// BRAND LOGO
// =====================================================

const BrandLogo = styled.div`
  width: 50px;

  height: 50px;

  overflow: hidden;

  border-radius: 12px;

  border: 1px solid #e2e8ed;

  background: #ffffff;

  @media (max-width: 600px) {
    width: 42px;

    height: 42px;
  }
`;


// =====================================================
// BRAND TEXT
// =====================================================

const BrandText = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;


// =====================================================
// COMPANY NAME
// =====================================================

const CompanyName = styled.div`
  color: #0b263d;

  font-size: 18px;

  font-weight: 850;

  line-height: 1.2;
`;


// =====================================================
// COMPANY TAGLINE
// =====================================================

const CompanyTagline = styled.div`
  margin-top: 4px;

  color: #8796a2;

  font-size: 10px;

  font-weight: 600;
`;


// =====================================================
// HEADER RIG
// =====================================================

const HeaderRig = styled.div`
  padding: 10px 15px;

  border-radius: 10px;

  background: #f5f8fa;

  border: 1px solid #e7edf1;

  text-align: right;
`;


// =====================================================
// HEADER RIG LABEL
// =====================================================

const HeaderRigLabel = styled.div`
  color: #9aa8b3;

  font-size: 8px;

  font-weight: 850;

  letter-spacing: 1px;
`;


// =====================================================
// HEADER RIG NUMBER
// =====================================================

const HeaderRigNumber = styled.div`
  margin-top: 3px;

  color: #0b263d;

  font-size: 14px;

  font-weight: 850;
`;


// =====================================================
// MAIN CONTENT
// =====================================================

const MainContent = styled.main`
  width: 100%;

  max-width: 1800px;

  margin-left: 0;

  padding: 55px 48px 70px;

  box-sizing: border-box;

  @media (max-width: 1099px) {
    padding: 45px 30px 60px;
  }

  @media (max-width: 700px) {
    padding: 35px 18px 50px;
  }
`;


// =====================================================
// PAGE HEADING
// =====================================================

const PageHeading = styled.div`
  margin-bottom: 34px;
`;


// =====================================================
// EYEBROW
// =====================================================

const Eyebrow = styled.div`
  margin-bottom: 9px;

  color: #4e8f22;

  font-size: 10px;

  font-weight: 850;

  letter-spacing: 1.7px;
`;


// =====================================================
// PAGE TITLE
// =====================================================

const PageTitle = styled.h1`
  margin: 0;

  color: #0b263d;

  font-size: 36px;

  line-height: 1.1;

  font-weight: 850;

  letter-spacing: -0.8px;

  @media (max-width: 700px) {
    font-size: 29px;
  }
`;


// =====================================================
// PAGE SUBTITLE
// =====================================================

const PageSubtitle = styled.p`
  max-width: 760px;

  margin: 12px 0 0;

  color: #71818e;

  font-size: 14px;

  line-height: 1.65;
`;


// =====================================================
// ALERT
// =====================================================

const Alert = styled.div`
  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 25px;

  padding: 15px 17px;

  border-radius: 11px;

  background: ${(props) =>
    props.$type === "success"
      ? "#eff9eb"
      : "#fff2f2"};

  border: 1px solid
    ${(props) =>
      props.$type === "success"
        ? "#d1e8c7"
        : "#f0d0d0"};

  color: ${(props) =>
    props.$type === "success"
      ? "#4e7d3c"
      : "#a54d4d"};
`;


// =====================================================
// ALERT ICON
// =====================================================

const AlertIcon = styled.div`
  width: 28px;

  height: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background: currentColor;

  color: #ffffff;

  font-size: 13px;

  font-weight: 850;
`;


// =====================================================
// ALERT TEXT
// =====================================================

const AlertText = styled.div`
  flex: 1;

  font-size: 13px;

  font-weight: 650;
`;


// =====================================================
// ALERT CLOSE
// =====================================================

const AlertClose = styled.button`
  border: none;

  background: transparent;

  color: currentColor;

  font-size: 20px;

  cursor: pointer;
`;


// =====================================================
// SUMMARY GRID
// =====================================================

const SummaryGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 18px;

  margin-bottom: 25px;

  @media (max-width: 1200px) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;


// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = styled.div`
  min-height: 118px;

  display: flex;

  align-items: center;

  gap: 16px;

  padding: 23px;

  box-sizing: border-box;

  border: 1px solid #e3e9ee;

  border-radius: 16px;

  background: #ffffff;

  box-shadow:
    0 7px 25px
      rgba(
        15,
        23,
        42,
        0.045
      );
`;


// =====================================================
// SUMMARY ICON
// =====================================================

const SummaryIcon = styled.div`
  width: 52px;

  height: 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 14px;

  background: ${(props) =>
    props.$type === "points"
      ? "#edf7fb"
      : props.$type === "depth"
      ? "#f3f7eb"
      : props.$type === "rpm"
      ? "#f4effa"
      : "#fff5e8"};

  color: ${(props) =>
    props.$type === "points"
      ? "#187ba8"
      : props.$type === "depth"
      ? "#5c8c32"
      : props.$type === "rpm"
      ? "#7a5aa6"
      : "#b47a27"};

  font-size: 22px;

  font-weight: 850;
`;


// =====================================================
// SUMMARY CONTENT
// =====================================================

const SummaryContent = styled.div`
  min-width: 0;
`;


// =====================================================
// SUMMARY LABEL
// =====================================================

const SummaryLabel = styled.div`
  color: #8c9aa5;

  font-size: 9px;

  font-weight: 850;

  letter-spacing: 1px;
`;


// =====================================================
// SUMMARY VALUE
// =====================================================

const SummaryValue = styled.div`
  margin-top: 7px;

  color: #0b263d;

  font-size: 23px;

  font-weight: 850;
`;


// =====================================================
// SUMMARY UNIT
// =====================================================

const SummaryUnit = styled.span`
  color: #8a98a3;

  font-size: 12px;

  font-weight: 700;
`;


// =====================================================
// SUMMARY SECTION
// =====================================================

const SummarySection = styled.section`
  margin-bottom: 28px;

  padding: 29px;

  border: 1px solid #e3e9ee;

  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 7px 28px
      rgba(
        15,
        23,
        42,
        0.04
      );
`;


// =====================================================
// SUMMARY SECTION HEADER
// =====================================================

const SummarySectionHeader = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 20px;

  margin-bottom: 23px;
`;


// =====================================================
// SECTION TITLE
// =====================================================

const SectionTitle = styled.h2`
  margin: 0;

  color: #0b263d;

  font-size: 20px;

  font-weight: 850;
`;


// =====================================================
// SECTION DESCRIPTION
// =====================================================

const SectionDescription = styled.p`
  margin: 7px 0 0;

  color: #8997a2;

  font-size: 12px;

  line-height: 1.5;
`;


// =====================================================
// DATE FILTER
// =====================================================

const DateFilter = styled.div`
  display: grid;

  grid-template-columns:
    minmax(180px, 250px)
    minmax(180px, 250px)
    auto;

  align-items: end;

  gap: 15px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;


// =====================================================
// DATE FIELD
// =====================================================

const DateField = styled.div`
  min-width: 0;
`;


// =====================================================
// FIELD LABEL
// =====================================================

const FieldLabel = styled.label`
  display: block;

  margin-bottom: 7px;

  color: #71818d;

  font-size: 9px;

  font-weight: 850;

  letter-spacing: 0.9px;
`;


// =====================================================
// INPUT
// =====================================================

const Input = styled.input`
  width: 100%;

  height: 48px;

  padding: 0 14px;

  box-sizing: border-box;

  border: 1px solid #dce4e9;

  border-radius: 9px;

  outline: none;

  background: #ffffff;

  color: #0b263d;

  font-size: 13px;

  font-weight: 600;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: #76a55d;

    box-shadow:
      0 0 0 3px
        rgba(
          78,
          143,
          34,
          0.1
        );
  }

  &::placeholder {
    color: #a8b3bb;
  }
`;


// =====================================================
// SUMMARY BUTTON
// =====================================================

const SummaryButton = styled.button`
  height: 48px;

  padding: 0 22px;

  border: none;

  border-radius: 9px;

  background: #0b263d;

  color: #ffffff;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  white-space: nowrap;

  &:hover {
    background: #153b59;
  }
`;


// =====================================================
// DETAILED SUMMARY
// =====================================================

const DetailedSummary = styled.div`
  display: grid;

  grid-template-columns:
    repeat(5, 1fr);

  gap: 12px;

  margin-top: 23px;

  padding-top: 23px;

  border-top: 1px solid #e8edf1;

  @media (max-width: 1200px) {
    grid-template-columns:
      repeat(3, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;


// =====================================================
// DETAIL STAT
// =====================================================

const DetailStat = styled.div`
  padding: 15px;

  border-radius: 11px;

  background: ${(props) =>
    props.$balance
      ? "#eff8e9"
      : "#f8fafb"};

  border: 1px solid
    ${(props) =>
      props.$balance
        ? "#d4e8c9"
        : "#edf1f4"};
`;


// =====================================================
// MODAL DETAIL LABEL / VALUE
// =====================================================

const ModalDetailLabel = styled.div`
  margin-bottom: 7px;

  color: #9aa7b0;

  font-size: 8px;

  font-weight: 850;

  letter-spacing: 1px;
`;

const ModalDetailValue = styled.div`
  overflow-wrap: anywhere;

  color: #0b263d;

  font-size: 15px;

  font-weight: 800;

  line-height: 1.4;
`;

// =====================================================
// ACTION ROW
// =====================================================

const ActionRow = styled.div`
  display: flex;

  justify-content: flex-end;

  margin-bottom: 20px;
`;


// =====================================================
// ADD POINT BUTTON
// =====================================================

const AddPointButton = styled.button`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  min-height: 46px;

  padding: 0 20px;

  border: none;

  border-radius: 10px;

  background: #4e8f22;

  color: #ffffff;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 7px 18px
      rgba(
        78,
        143,
        34,
        0.18
      );

  transition:
    transform 0.2s ease,
    background 0.2s ease;

  span {
    font-size: 19px;

    line-height: 1;
  }

  &:hover {
    background: #41791c;

    transform:
      translateY(-1px);
  }
`;


// =====================================================
// FORM CARD
// =====================================================

const FormCard = styled.section`
  margin-bottom: 28px;

  padding: 32px;

  border: 1px solid #e0e7ec;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 35px
      rgba(
        15,
        23,
        42,
        0.06
      );

  @media (max-width: 700px) {
    padding: 22px 18px;
  }
`;


// =====================================================
// FORM HEADER
// =====================================================

const FormHeader = styled.div`
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  padding-bottom: 25px;

  margin-bottom: 5px;

  border-bottom: 1px solid #e8edf1;
`;


// =====================================================
// FORM TITLE
// =====================================================

const FormTitle = styled.h2`
  margin: 0;

  color: #0b263d;

  font-size: 23px;

  font-weight: 850;
`;


// =====================================================
// FORM SUBTITLE
// =====================================================

const FormSubtitle = styled.p`
  margin: 6px 0 0;

  color: #8b99a4;

  font-size: 12px;
`;


// =====================================================
// CLOSE FORM BUTTON
// =====================================================

const CloseFormButton = styled.button`
  width: 40px;

  height: 40px;

  flex-shrink: 0;

  border: none;

  border-radius: 9px;

  background: #f2f5f7;

  color: #5f7180;

  font-size: 23px;

  cursor: pointer;

  &:hover {
    background: #e9eef1;
  }
`;


// =====================================================
// FORM SECTION
// =====================================================

const FormSection = styled.div`
  padding: 26px 0;

  border-bottom: 1px solid #edf1f4;

  &:last-of-type {
    border-bottom: none;
  }
`;


// =====================================================
// FORM SECTION TITLE
// =====================================================

const FormSectionTitle = styled.h3`
  margin: 0 0 18px;

  color: #0b263d;

  font-size: 16px;

  font-weight: 850;
`;


// =====================================================
// FORM SECTION DESCRIPTION
// =====================================================

const FormSectionDescription = styled.p`
  margin: -10px 0 18px;

  color: #8b99a4;

  font-size: 11px;
`;


// =====================================================
// FORM GRID
// =====================================================

const FormGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 18px;

  @media (max-width: 950px) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;


// =====================================================
// FIELD GROUP
// =====================================================

const FieldGroup = styled.div`
  min-width: 0;
`;


// =====================================================
// CALCULATION BOX
// =====================================================

const CalculationBox = styled.div`
  display: grid;

  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  margin-top: 20px;

  padding: 18px 20px;

  border-radius: 13px;

  background: #f5f8f3;

  border: 1px solid #e0ebd9;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    gap: 18px;
  }
`;


// =====================================================
// CALCULATION ITEM
// =====================================================

const CalculationItem = styled.div`
  text-align: center;
`;


// =====================================================
// CALCULATION LABEL
// =====================================================

const CalculationLabel = styled.div`
  color: #80908a;

  font-size: 9px;

  font-weight: 850;

  letter-spacing: 1px;
`;


// =====================================================
// CALCULATION VALUE
// =====================================================

const CalculationValue = styled.div`
  margin-top: 5px;

  color: #4e8f22;

  font-size: 23px;

  font-weight: 850;
`;


// =====================================================
// CALCULATION FORMULA
// =====================================================

const CalculationFormula = styled.div`
  margin-top: 3px;

  color: #98a49f;

  font-size: 9px;
`;


// =====================================================
// CALCULATION DIVIDER
// =====================================================

const CalculationDivider = styled.div`
  width: 1px;

  height: 48px;

  background: #dce7d6;

  @media (max-width: 600px) {
    width: 100%;

    height: 1px;
  }
`;


// =====================================================
// SECTION TITLE ROW
// =====================================================

const SectionTitleRow = styled.div`
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 18px;
`;


// =====================================================
// SMALL ADD BUTTON
// =====================================================

const SmallAddButton = styled.button`
  min-height: 38px;

  padding: 0 14px;

  border: 1px solid #cfe2c5;

  border-radius: 8px;

  background: #f3f9ef;

  color: #4e8f22;

  font-size: 11px;

  font-weight: 800;

  cursor: pointer;

  white-space: nowrap;

  &:hover {
    background: #eaf5e5;
  }
`;


// =====================================================
// RATE TABLE
// =====================================================

const RateTable = styled.div`
  width: 100%;

  overflow-x: auto;

  border: 1px solid #e5ebef;

  border-radius: 12px;

  background: #ffffff;
`;


// =====================================================
// RATE HEADER
// =====================================================

const RateHeader = styled.div`
  display: grid;

  grid-template-columns:
    1fr
    1fr
    1.2fr
    1.3fr
    80px;

  min-width: 650px;

  background: #f5f8fa;

  border-bottom: 1px solid #e5ebef;
`;


// =====================================================
// RATE HEADER CELL
// =====================================================

const RateHeaderCell = styled.div`
  padding: 13px 14px;

  color: #8796a1;

  font-size: 8px;

  font-weight: 850;

  letter-spacing: 0.9px;
`;


// =====================================================
// RATE ROW
// =====================================================

const RateRow = styled.div`
  display: grid;

  grid-template-columns:
    1fr
    1fr
    1.2fr
    1.3fr
    80px;

  min-width: 650px;

  align-items: center;

  border-bottom: 1px solid #edf1f4;

  &:last-child {
    border-bottom: none;
  }
`;


// =====================================================
// RATE INPUT
// =====================================================

const RateInput = styled.input`
  width: calc(
    100% - 20px
  );

  height: 40px;

  margin: 8px 10px;

  padding: 0 10px;

  box-sizing: border-box;

  border: 1px solid #dce4e9;

  border-radius: 7px;

  outline: none;

  color: #0b263d;

  font-size: 12px;

  font-weight: 650;

  &:focus {
    border-color: #76a55d;

    box-shadow:
      0 0 0 3px
        rgba(
          78,
          143,
          34,
          0.08
        );
  }
`;


// =====================================================
// SELECT INPUT
// =====================================================

const SelectInput = styled.select`
  width: calc(
    100% - 20px
  );

  height: 40px;

  margin: 8px 10px;

  padding: 0 10px;

  box-sizing: border-box;

  border: 1px solid #dce4e9;

  border-radius: 7px;

  outline: none;

  background: #ffffff;

  color: #0b263d;

  font-size: 12px;

  font-weight: 650;

  &:focus {
    border-color: #76a55d;
  }
`;


// =====================================================
// AMOUNT CELL
// =====================================================

const AmountCell = styled.div`
  padding: 0 14px;

  color: #0b263d;

  font-size: 13px;

  font-weight: 800;
`;


// =====================================================
// REMOVE BUTTON
// =====================================================

const RemoveButton = styled.button`
  width: 30px;

  height: 30px;

  margin-left: 12px;

  border: none;

  border-radius: 7px;

  background: #fff1f1;

  color: #b34f4f;

  font-size: 18px;

  cursor: pointer;

  &:hover {
    background: #ffe5e5;
  }
`;


// =====================================================
// CALCULATION TOTAL
// =====================================================

const CalculationTotal = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-top: 14px;

  padding: 15px 18px;

  border-radius: 10px;

  background: #f7fafb;

  color: #657784;

  font-size: 12px;

  font-weight: 700;

  strong {
    color: #0b263d;

    font-size: 16px;

    font-weight: 850;
  }
`;


// =====================================================
// EMPTY CASING
// =====================================================

const EmptyCasing = styled.div`
  padding: 28px;

  border: 1px dashed #d6dfe5;

  border-radius: 11px;

  color: #8d9ba5;

  font-size: 12px;

  text-align: center;

  strong {
    margin-left: 4px;

    color: #4e8f22;
  }
`;


// =====================================================
// PAYMENT PREVIEW
// =====================================================

const PaymentPreview = styled.div`
  max-width: 620px;

  margin-top: 20px;

  margin-left: auto;

  padding: 18px 20px;

  border-radius: 13px;

  background: #f7fafb;

  border: 1px solid #e4eaee;
`;


// =====================================================
// PAYMENT ROW
// =====================================================

const PaymentRow = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 12px 0;

  border-bottom: 1px solid #e7edf1;

  color: #71818d;

  font-size: 12px;

  font-weight: 650;

  &:last-child {
    border-bottom: none;
  }

  strong {
    color: #0b263d;

    font-size: 14px;

    font-weight: 850;
  }

  ${(props) =>
    props.$total &&
    `
      padding-top: 17px;

      strong {
        font-size: 17px;
      }

      span {
        color: #0b263d;

        font-weight: 850;
      }
    `}

  ${(props) =>
    props.$balance &&
    `
      margin-top: 5px;

      padding: 15px;

      border: none;

      border-radius: 9px;

      background: #edf7e8;

      color: #4e8f22;

      strong {
        color: #4e8f22;

        font-size: 18px;
      }

      span {
        color: #4e8f22;

        font-weight: 850;
      }
    `}
`;


// =====================================================
// FORM ACTIONS
// =====================================================

const FormActions = styled.div`
  display: flex;

  justify-content: flex-end;

  gap: 12px;

  padding-top: 25px;
`;


// =====================================================
// CANCEL BUTTON
// =====================================================

const CancelButton = styled.button`
  min-height: 45px;

  padding: 0 20px;

  border: 1px solid #d8e0e5;

  border-radius: 9px;

  background: #ffffff;

  color: #60727f;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  &:hover {
    background: #f5f7f9;
  }
`;


// =====================================================
// SAVE BUTTON
// =====================================================

const SaveButton = styled.button`
  min-height: 45px;

  padding: 0 24px;

  border: none;

  border-radius: 9px;

  background: #4e8f22;

  color: #ffffff;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  &:hover {
    background: #41791c;
  }
`;


// =====================================================
// POINTS SECTION
// =====================================================

const PointsSection = styled.section`
  width: 100%;

  padding: 32px;

  box-sizing: border-box;

  border: 1px solid #e0e7ec;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 35px
      rgba(
        15,
        23,
        42,
        0.055
      );

  @media (max-width: 700px) {
    padding: 22px 16px;
  }
`;


// =====================================================
// POINTS HEADER
// =====================================================

const PointsHeader = styled.div`
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 25px;
`;


// =====================================================
// POINT COUNT
// =====================================================

const PointCount = styled.div`
  padding: 8px 13px;

  border-radius: 20px;

  background: #f1f6ee;

  color: #4e8f22;

  font-size: 10px;

  font-weight: 850;

  white-space: nowrap;
`;


// =====================================================
// TABLE WRAPPER
// =====================================================

const PointsTableWrapper = styled.div`
  width: 100%;

  overflow-x: auto;

  border: 1px solid #e1e8ed;

  border-radius: 14px;

  background: #ffffff;

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 9px;
  }

  &::-webkit-scrollbar-track {
    background: #f4f7f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5dc;

    border-radius: 10px;
  }
`;


// =====================================================
// POINTS TABLE
// =====================================================

const PointsTable = styled.table`
  width: 100%;

  min-width: 1450px;

  border-collapse: collapse;

  table-layout: auto;
`;


// =====================================================
// TABLE HEADER
// =====================================================

const TableHeader = styled.th`
  padding: 18px 18px;

  background: #f5f8fa;

  border-bottom: 1px solid #e0e7ec;

  color: #7d8d99;

  font-size: 10px;

  font-weight: 850;

  letter-spacing: 0.8px;

  text-align: left;

  white-space: nowrap;
`;


// =====================================================
// TABLE ROW
// =====================================================

const TableRow = styled.tr`
  transition:
    background 0.15s ease;

  &:hover {
    background: #fbfcfd;
  }

  &:last-child td {
    border-bottom: none;
  }
`;


// =====================================================
// TABLE CELL
// =====================================================

const TableCell = styled.td`
  padding: 20px 18px;

  border-bottom: 1px solid #edf1f4;

  color: #536574;

  font-size: 14px;

  font-weight: 600;

  vertical-align: middle;

  white-space: nowrap;
`;


// =====================================================
// DATE VALUE
// =====================================================

const DateValue = styled.div`
  color: #0b263d;

  font-size: 14px;

  font-weight: 750;
`;


// =====================================================
// PERSON CELL
// =====================================================

const PersonCell = styled.div`
  min-width: 150px;
`;


// =====================================================
// PERSON NAME
// =====================================================

const PersonName = styled.div`
  color: #0b263d;

  font-size: 14px;

  font-weight: 800;

  line-height: 1.3;
`;


// =====================================================
// PERSON PHONE
// =====================================================

const PersonPhone = styled.div`
  margin-top: 5px;

  color: #94a2ac;

  font-size: 11px;

  font-weight: 600;
`;


// =====================================================
// LOCATION VALUE
// =====================================================

const LocationValue = styled.div`
  max-width: 220px;

  overflow: hidden;

  color: #536574;

  font-size: 13px;

  font-weight: 600;

  text-overflow: ellipsis;
`;


// =====================================================
// DEPTH VALUE
// =====================================================

const DepthValue = styled.div`
  color: #0b263d;

  font-size: 15px;

  font-weight: 850;
`;


// =====================================================
// DEPTH UNIT
// =====================================================

const DepthUnit = styled.span`
  color: #94a2ac;

  font-size: 10px;

  font-weight: 700;
`;


// =====================================================
// MONEY VALUE
// =====================================================

const MoneyValue = styled.div`
  color: #0b263d;

  font-size: 14px;

  font-weight: 800;
`;


// =====================================================
// BALANCE VALUE
// =====================================================

const BalanceValue = styled.div`
  color: ${(props) =>
    props.$negative
      ? "#b34f4f"
      : "#4e8f22"};

  font-size: 14px;

  font-weight: 850;
`;


// =====================================================
// ACTION BUTTONS
// =====================================================

const ActionButtons = styled.div`
  display: flex;

  align-items: center;

  gap: 8px;
`;


// =====================================================
// VIEW BUTTON
// =====================================================

const ViewButton = styled.button`
  min-width: 58px;

  height: 35px;

  padding: 0 12px;

  border: 1px solid #cce2ed;

  border-radius: 8px;

  background: #edf7fb;

  color: #177ba8;

  font-size: 10px;

  font-weight: 850;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #dceff7;

    transform:
      translateY(-1px);
  }
`;


// =====================================================
// EDIT BUTTON
// =====================================================

const EditButton = styled.button`
  min-width: 58px;

  height: 35px;

  padding: 0 12px;

  border: 1px solid #d7e3cf;

  border-radius: 8px;

  background: #f2f8ee;

  color: #5a8a3c;

  font-size: 10px;

  font-weight: 850;

  cursor: pointer;

  &:hover {
    background: #e8f3e2;
  }
`;


// =====================================================
// DELETE BUTTON
// =====================================================

const DeleteButton = styled.button`
  min-width: 65px;

  height: 35px;

  padding: 0 12px;

  border: 1px solid #efd1d1;

  border-radius: 8px;

  background: #fff4f4;

  color: #b34f4f;

  font-size: 10px;

  font-weight: 850;

  cursor: pointer;

  &:hover {
    background: #ffeaea;
  }
`;


// =====================================================
// LOADING POINTS
// =====================================================

const LoadingPoints = styled.div`
  padding: 70px 20px;

  text-align: center;

  color: #8796a1;

  font-size: 13px;

  font-weight: 650;
`;


// =====================================================
// EMPTY POINTS
// =====================================================

const EmptyPoints = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 75px 25px;

  text-align: center;

  border: 1px dashed #d8e1e6;

  border-radius: 14px;

  background: #fafcfd;
`;


// =====================================================
// EMPTY POINTS ICON
// =====================================================

const EmptyPointsIcon = styled.div`
  width: 64px;

  height: 64px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 18px;

  border-radius: 18px;

  background: #f0f6ed;

  color: #4e8f22;

  font-size: 28px;
`;


// =====================================================
// EMPTY POINTS TITLE
// =====================================================

const EmptyPointsTitle = styled.h3`
  margin: 0;

  color: #0b263d;

  font-size: 18px;

  font-weight: 850;
`;


// =====================================================
// EMPTY POINTS TEXT
// =====================================================

const EmptyPointsText = styled.p`
  max-width: 430px;

  margin: 8px 0 20px;

  color: #8998a3;

  font-size: 12px;

  line-height: 1.6;
`;


// =====================================================
// FOOTER
// =====================================================

const Footer = styled.footer`
  width: 100%;

  margin-left: 0;

  padding: 25px 48px;

  box-sizing: border-box;

  border-top: 1px solid #e3e9ee;

  background: #ffffff;

  color: #98a5ae;

  font-size: 10px;

  text-align: center;
`;


// =====================================================
// LOADING CONTAINER
// =====================================================

const LoadingContainer = styled.div`
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  background: #f6f8fa;
`;


// =====================================================
// LOADING LOGO
// =====================================================

const LoadingLogo = styled.div`
  width: 82px;

  height: 82px;

  overflow: hidden;

  margin-bottom: 18px;

  border-radius: 20px;

  background: #ffffff;

  border: 1px solid #e2e8ed;

  box-shadow:
    0 10px 30px
      rgba(
        15,
        23,
        42,
        0.08
      );
`;


// =====================================================
// LOADING TITLE
// =====================================================

const LoadingTitle = styled.div`
  color: #0b263d;

  font-size: 18px;

  font-weight: 850;
`;


// =====================================================
// LOADING TEXT
// =====================================================

const LoadingText = styled.div`
  margin-top: 7px;

  color: #8998a3;

  font-size: 12px;
`;


// =====================================================
// LOADING SPINNER
// =====================================================

const LoadingSpinner = styled.div`
  width: 30px;

  height: 30px;

  margin-top: 22px;

  border: 3px solid #dfe9da;

  border-top-color: #4e8f22;

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform:
        rotate(360deg);
    }
  }
`;


// =====================================================
// =====================================================
// COMPLETE POINT DETAILS MODAL
// =====================================================
// =====================================================


// =====================================================
// DETAILS OVERLAY
// =====================================================

const DetailsOverlay = styled.div`
  position: fixed;

  inset: 0;

  z-index: 2000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 30px;

  box-sizing: border-box;

  background:
    rgba(
      8,
      25,
      40,
      0.62
    );

  backdrop-filter:
    blur(7px);

  animation:
    modalFadeIn
    0.2s ease;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    padding: 12px;
  }
`;


// =====================================================
// DETAILS MODAL
// =====================================================

const DetailsModal = styled.div`
  width: min(
    1180px,
    100%
  );

  max-height: 92vh;

  overflow-y: auto;

  padding: 38px;

  box-sizing: border-box;

  border-radius: 24px;

  background: #ffffff;

  box-shadow:
    0 35px 100px
      rgba(
        15,
        23,
        42,
        0.3
      );

  animation:
    modalSlideUp
    0.25s ease;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7f8;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5dc;

    border-radius: 10px;
  }

  @keyframes modalSlideUp {
    from {
      opacity: 0;

      transform:
        translateY(18px)
        scale(0.985);
    }

    to {
      opacity: 1;

      transform:
        translateY(0)
        scale(1);
    }
  }

  @media (max-width: 700px) {
    padding: 23px 18px;

    border-radius: 18px;
  }
`;


// =====================================================
// DETAILS HEADER
// =====================================================

const DetailsHeader = styled.div`
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 25px;

  padding-bottom: 27px;

  border-bottom: 1px solid #e6ebef;
`;


// =====================================================
// DETAILS EYEBROW
// =====================================================

const DetailsEyebrow = styled.div`
  margin-bottom: 8px;

  color: #4e8f22;

  font-size: 10px;

  font-weight: 850;

  letter-spacing: 1.6px;
`;


// =====================================================
// DETAILS TITLE
// =====================================================

const DetailsTitle = styled.h2`
  margin: 0;

  color: #0b263d;

  font-size: 30px;

  font-weight: 850;

  letter-spacing: -0.4px;

  @media (max-width: 600px) {
    font-size: 23px;
  }
`;


// =====================================================
// DETAILS SUBTITLE
// =====================================================

const DetailsSubtitle = styled.p`
  max-width: 650px;

  margin: 8px 0 0;

  color: #7f8f9b;

  font-size: 13px;

  line-height: 1.55;
`;


// =====================================================
// DETAILS CLOSE BUTTON
// =====================================================

const DetailsCloseButton = styled.button`
  width: 44px;

  height: 44px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border: none;

  border-radius: 11px;

  background: #f2f5f7;

  color: #5d6f7c;

  font-size: 26px;

  cursor: pointer;

  transition:
    background 0.2s ease;

  &:hover {
    background: #e7ecef;
  }
`;


// =====================================================
// DETAILS SECTION
// =====================================================

const DetailsSection = styled.section`
  margin-top: 27px;

  padding: 24px;

  border: 1px solid #e3e9ed;

  border-radius: 16px;

  background: #fbfcfd;
`;


// =====================================================
// DETAILS SECTION TITLE
// =====================================================

const DetailsSectionTitle = styled.h3`
  margin: 0 0 18px;

  color: #0b263d;

  font-size: 16px;

  font-weight: 850;
`;


// =====================================================
// DETAILS GRID
// =====================================================

const DetailsGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 14px;

  @media (max-width: 850px) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
`;


// =====================================================
// DETAIL BOX
// =====================================================

const DetailBox = styled.div`
  min-width: 0;

  padding: 17px;

  border: 1px solid #e5ebef;

  border-radius: 11px;

  background: #ffffff;
`;


// =====================================================
// DETAIL LABEL
// =====================================================

const DetailLabel = styled.div`
  margin-bottom: 7px;

  color: #9aa7b0;

  font-size: 8px;

  font-weight: 850;

  letter-spacing: 1px;
`;


// =====================================================
// DETAIL VALUE
// =====================================================

const DetailValue = styled.div`
  overflow-wrap: anywhere;

  color: #0b263d;

  font-size: 15px;

  font-weight: 800;

  line-height: 1.4;
`;


// =====================================================
// DETAILS TABLE WRAPPER
// =====================================================

const DetailsTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #e3e9ed;
  border-radius: 12px;
  background: #ffffff;
  margin-top: 10px;

  &::-webkit-scrollbar {
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #f4f7f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5dc;
    border-radius: 6px;
  }
`;


// =====================================================
// DETAILS TABLE
// =====================================================

const DetailsTable = styled.table`
  width: 100%;
  min-width: 480px;
  border-collapse: collapse;
  background: #ffffff;
`;


// =====================================================
// DETAILS TABLE HEADER
// =====================================================

const DetailsTableHeader = styled.th`
  padding: 12px 14px;
  background: #f2f6f8;
  border-bottom: 1px solid #e2e8ec;
  color: #7d8c98;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.9px;
  text-align: left;
  white-space: nowrap;

  @media (max-width: 600px) {
    padding: 10px 10px;
    font-size: 8px;
  }
`;


// =====================================================
// DETAILS TABLE CELL
// =====================================================

const DetailsTableCell = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid #edf1f4;
  color: #536574;
  font-size: 13px;
  font-weight: 650;
  white-space: nowrap;

  @media (max-width: 600px) {
    padding: 10px 10px;
    font-size: 12px;
  }

  &:last-child {
    color: #0b263d;
    font-weight: 800;
  }
`;


// =====================================================
// NO DETAILS
// =====================================================

const NoDetails = styled.div`
  padding: 24px;

  border: 1px dashed #d7e0e5;

  border-radius: 10px;

  background: #ffffff;

  color: #96a3ad;

  font-size: 12px;

  text-align: center;
`;


// =====================================================
// PAYMENT DETAILS GRID
// =====================================================

const PaymentDetailsGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 15px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;


// =====================================================
// PAYMENT DETAIL BOX
// =====================================================

const PaymentDetailBox = styled.div`
  padding: 22px;

  border: 1px solid
    ${(props) =>
      props.$balance
        ? "#cfe4c4"
        : "#e3e9ed"};

  border-radius: 14px;

  background:
    ${(props) =>
      props.$balance
        ? "#eff8e9"
        : "#ffffff"};
`;


// =====================================================
// PAYMENT DETAIL LABEL
// =====================================================

const PaymentDetailLabel = styled.div`
  color: #95a2ac;

  font-size: 8px;

  font-weight: 850;

  letter-spacing: 1px;
`;


// =====================================================
// PAYMENT DETAIL VALUE
// =====================================================

const PaymentDetailValue = styled.div`
  margin-top: 8px;

  color:
    ${(props) =>
      props.$balance
        ? "#4e8f22"
        : "#0b263d"};

  font-size: 25px;

  font-weight: 850;

  @media (max-width: 600px) {
    font-size: 21px;
  }
`;


// =====================================================
// DETAILS FOOTER
// =====================================================

const DetailsFooter = styled.div`
  display: flex;

  justify-content: flex-end;

  margin-top: 26px;

  padding-top: 22px;

  border-top: 1px solid #e7ecef;
`;


// =====================================================
// CLOSE DETAILS BUTTON
// =====================================================

const CloseDetailsButton = styled.button`
  min-height: 44px;

  padding: 0 23px;

  border: none;

  border-radius: 9px;

  background: #0b263d;

  color: #ffffff;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  &:hover {
    background: #153b59;
  }
`;


// =====================================================
// EXPORT
// =====================================================

export default PointDetails;
