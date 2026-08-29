import React, {
  useState,
  useEffect
} from "react";

import styled, { createGlobalStyle } from "styled-components";

import {
  useNavigate
} from "react-router-dom";

import api from "../utils/api";

import LorryImage from "../assets/images/TN34K3749.jpeg";


// =====================================================
// HOME PAGE
// =====================================================

const HomePage = () => {

  const navigate = useNavigate();


  // =====================================================
  // USER INFORMATION
  // =====================================================

  const userType =
    localStorage.getItem("userType");

  const userName =
    localStorage.getItem("userName");


  // =====================================================
  // STATES
  // =====================================================

  const [lorries, setLorries] =
    useState([]);


  const [managers, setManagers] =
    useState([]);


  const [selectedManagers, setSelectedManagers] =
    useState({});


  const [isFormVisible, setIsFormVisible] =
    useState(false);


  const [loading, setLoading] =
    useState(false);


  const [pageLoading, setPageLoading] =
    useState(true);


  // =====================================================
  // ADD LORRY FORM
  // =====================================================

  const [registrationNumber, setRegistrationNumber] =
    useState("");


  const [ownerPhone, setOwnerPhone] =
    useState("");


  const [model, setModel] =
    useState("");


  const [yearBuilt, setYearBuilt] =
    useState("");


  const [ownerName, setOwnerName] =
    useState("");


  // =====================================================
  // FETCH LORRIES
  // =====================================================

  const fetchLorries = async () => {

    try {

      setLoading(true);


      const response =
        await api.get("/lorry");


      setLorries(
        Array.isArray(
          response.data
        )
          ? response.data
          : []
      );


    } catch (error) {

      console.error(
        "Error fetching lorries:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        localStorage.removeItem(
          "authToken"
        );

        localStorage.removeItem(
          "userType"
        );

        localStorage.removeItem(
          "userName"
        );

        localStorage.removeItem(
          "userId"
        );

        navigate("/login");

        return;

      }


      alert(
        error.response?.data?.message ||
        "Error fetching lorries."
      );


    } finally {

      setLoading(false);
      setPageLoading(false);

    }

  };


  // =====================================================
  // FETCH LORRY MANAGERS
  // OWNER ONLY
  // =====================================================

  const fetchManagers = async () => {

    if (
      userType !== "owner"
    ) {

      return;

    }


    try {

      const response =
        await api.get(
          "/lorry/managers"
        );


      setManagers(
        Array.isArray(
          response.data
        )
          ? response.data
          : []
      );


    } catch (error) {

      console.error(
        "Error fetching lorry managers:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to fetch lorry managers."
      );

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    const loadPage = async () => {

      await fetchLorries();

      if (
        userType === "owner"
      ) {

        await fetchManagers();

      }

    };


    loadPage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // =====================================================
  // SHOW / HIDE ADD LORRY
  // =====================================================

  const handleAddLorry = () => {

    setIsFormVisible(
      previous =>
        !previous
    );

  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setRegistrationNumber("");
    setOwnerPhone("");
    setModel("");
    setYearBuilt("");
    setOwnerName("");

  };


  // =====================================================
  // ADD LORRY
  // =====================================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();


    if (
      !registrationNumber.trim() ||
      !ownerPhone.trim() ||
      !model.trim() ||
      !yearBuilt ||
      !ownerName.trim()
    ) {

      alert(
        "Please fill in all lorry details."
      );

      return;

    }


    try {

      setLoading(true);


      const newLorry = {

        registration_number:
          registrationNumber.trim(),

        owner_phone:
          ownerPhone.trim(),

        model:
          model.trim(),

        year_built:
          yearBuilt,

        owner_name:
          ownerName.trim()

      };


      await api.post(
        "/lorry/add",
        newLorry
      );


      alert(
        "Lorry added successfully."
      );


      resetForm();


      setIsFormVisible(
        false
      );


      await fetchLorries();


    } catch (error) {

      console.error(
        "Error adding lorry:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        localStorage.removeItem(
          "authToken"
        );

        localStorage.removeItem(
          "userType"
        );

        localStorage.removeItem(
          "userName"
        );

        navigate("/login");

        return;

      }


      alert(
        error.response?.data?.message ||
        "Failed to add lorry."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // DELETE LORRY
  // =====================================================

  const handleDeleteLorry =
    async (
      lorryId,
      registration
    ) => {

      const confirmed =
        window.confirm(
          `Are you sure you want to delete lorry ${registration}?`
        );


      if (!confirmed) {

        return;

      }


      try {

        setLoading(true);


        await api.delete(
          `/lorry/${lorryId}`
        );


        alert(
          "Lorry deleted successfully."
        );


        setLorries(
          previousLorries =>
            previousLorries.filter(
              lorry =>
                lorry.id !==
                lorryId
            )
        );


      } catch (error) {

        console.error(
          "Error deleting lorry:",
          error
        );


        alert(
          error.response?.data?.message ||
          "Failed to delete lorry."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // SELECT MANAGER
  // =====================================================

  const handleManagerChange =
    (
      lorryId,
      managerId
    ) => {

      setSelectedManagers(
        previous => ({
          ...previous,
          [lorryId]:
            managerId
        })
      );

    };


  // =====================================================
  // ASSIGN MANAGER
  // =====================================================

  const handleAssignManager =
    async (
      lorryId
    ) => {

      const managerId =
        selectedManagers[
          lorryId
        ];


      if (!managerId) {

        alert(
          "Please select a lorry manager."
        );

        return;

      }


      const confirmed =
        window.confirm(
          "Are you sure you want to assign this lorry manager?\n\nIf the manager is currently assigned to another lorry, they will be moved to this lorry."
        );


      if (!confirmed) {

        return;

      }


      try {

        setLoading(true);


        await api.put(
          `/lorry/${lorryId}/manager`,
          {
            managerId:
              Number(
                managerId
              )
          }
        );


        alert(
          "Lorry manager assigned successfully."
        );


        await fetchLorries();


        setSelectedManagers(
          previous => {

            const updated = {
              ...previous
            };


            delete updated[
              lorryId
            ];


            return updated;

          }
        );


      } catch (error) {

        console.error(
          "Error assigning manager:",
          error
        );


        alert(
          error.response?.data?.message ||
          "Failed to assign lorry manager."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // REMOVE MANAGER
  // =====================================================

  const handleRemoveManager =
    async (
      lorryId
    ) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to remove the lorry manager?"
        );


      if (!confirmed) {

        return;

      }


      try {

        setLoading(true);


        await api.delete(
          `/lorry/${lorryId}/manager`
        );


        alert(
          "Lorry manager removed successfully."
        );


        await fetchLorries();


      } catch (error) {

        console.error(
          "Error removing manager:",
          error
        );


        alert(
          error.response?.data?.message ||
          "Failed to remove lorry manager."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // OPEN LORRY DASHBOARD
  // =====================================================

  const handleLorryClick =
    (
      lorryId
    ) => {

      navigate(
        `/dashboard/${lorryId}`
      );

    };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "authToken"
    );

    localStorage.removeItem(
      "userType"
    );

    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userId"
    );


    navigate(
      "/login"
    );

  };


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalLorries =
    lorries.length;


  const assignedLorries =
    lorries.filter(
      lorry =>
        lorry.lorry_manager_id
    ).length;


  const unassignedLorries =
    totalLorries -
    assignedLorries;


  const totalManagers =
    managers.length;


  // =====================================================
  // LOADING
  // =====================================================

  if (pageLoading) {

    return (

      <LoadingScreen>

        <LoadingCard>

          <LoadingLogo>
            🚛
          </LoadingLogo>


          <LoadingTitle>
            Sri Murugan Rig Service
          </LoadingTitle>


          <LoadingCardSubtitle>
            Loading your fleet...
          </LoadingCardSubtitle>

        </LoadingCard>

      </LoadingScreen>

    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <Page>


      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <TopBar>

        <BrandArea>

          <BrandMark>
            SM
          </BrandMark>


          <div>

            <BrandName>
              Sri Murugan Rig Service
            </BrandName>


            <BrandSmall>
              Drilling • Borewell • Rig Operations
            </BrandSmall>

          </div>

        </BrandArea>


        <TopActions>

          <UserBox>

            <UserAvatar>

              {
                (
                  userName ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()
              }

            </UserAvatar>


            <div>

              <UserName>
                {
                  userName ||
                  "User"
                }
              </UserName>


              <UserRole>
                {
                  userType
                    ?.replace(
                      "_",
                      " "
                    )
                    .toUpperCase()
                }
              </UserRole>

            </div>

          </UserBox>


          <LogoutButton
            onClick={
              handleLogout
            }
          >

            Logout

          </LogoutButton>

        </TopActions>

      </TopBar>


      {/* =================================================
          HERO
      ================================================= */}

      <Hero>

        <HeroImage>

          <img
            src={LorryImage}
            alt="Sri Murugan Rig Service drilling rig"
          />

        </HeroImage>


        <HeroOverlay />


        <HeroContent>

          <HeroEyebrow>
            SRI MURUGAN RIG SERVICE
          </HeroEyebrow>


          <HeroTitle>
            Built on Experience.
            <br />
            Driven by the Ground.
          </HeroTitle>


          <HeroDescription>

            <strong>
              25 Years of Experience.
              Built on Trust.
              Driven by Service.
            </strong>

            <br />

            Since 2001, delivering reliable
            borewell drilling and rig services
            across India and international
            markets.

          </HeroDescription>


          <HeroQuote>
            “Since 2001 — Reliability at Every Depth.”
          </HeroQuote>


          <LocationBanner>

            <LocationTitle>
              OPERATING ACROSS
            </LocationTitle>


            <LocationList>

              <Location>
                Tamil Nadu
              </Location>

              <Location>
                Maharashtra
              </Location>

              <Location>
                Madhya Pradesh
              </Location>

              <Location>
                South Africa
              </Location>

              <Location>
                Burkina Faso
              </Location>

            </LocationList>

          </LocationBanner>

        </HeroContent>

      </Hero>


      {/* =================================================
          PAGE INTRO
      ================================================= */}

      <PageIntro>

        <div>

          <IntroEyebrow>
            FLEET MANAGEMENT
          </IntroEyebrow>


          <IntroTitle>
            Your Rig Fleet
          </IntroTitle>


          <IntroDescription>
            Select a lorry to manage its
            employees, fuel, expenses and
            operational details.
          </IntroDescription>

        </div>


        {
          userType ===
          "owner" && (

            <AddLorryButton
              onClick={
                handleAddLorry
              }
            >

              <span>
                +
              </span>

              {
                isFormVisible
                  ? "Close Form"
                  : "Add New Lorry"
              }

            </AddLorryButton>

          )
        }

      </PageIntro>


      {/* =================================================
          FLEET STATS
      ================================================= */}

      <StatsGrid>


        <StatCard>

          <StatIcon>
            🚛
          </StatIcon>


          <div>

            <StatLabel>
              TOTAL FLEET
            </StatLabel>


            <StatValue>
              {
                totalLorries
              }
            </StatValue>


            <StatHint>
              Registered lorries
            </StatHint>

          </div>

        </StatCard>


        <StatCard>

          <StatIcon $green>
            ✓
          </StatIcon>


          <div>

            <StatLabel>
              ASSIGNED
            </StatLabel>


            <StatValue>
              {
                assignedLorries
              }
            </StatValue>


            <StatHint>
              With lorry managers
            </StatHint>

          </div>

        </StatCard>


        <StatCard>

          <StatIcon $orange>
            !
          </StatIcon>


          <div>

            <StatLabel>
              UNASSIGNED
            </StatLabel>


            <StatValue>
              {
                unassignedLorries
              }
            </StatValue>


            <StatHint>
              Awaiting assignment
            </StatHint>

          </div>

        </StatCard>


        {
          userType ===
          "owner" && (

            <StatCard>

              <StatIcon $blue>
                👥
              </StatIcon>


              <div>

                <StatLabel>
                  LORRY MANAGERS
                </StatLabel>


                <StatValue>
                  {
                    totalManagers
                  }
                </StatValue>


                <StatHint>
                  Available managers
                </StatHint>

              </div>

            </StatCard>

          )
        }

      </StatsGrid>


      {/* =================================================
          ADD LORRY FORM
      ================================================= */}

      {
        userType ===
        "owner" &&
        isFormVisible && (

          <AddLorrySection>

            <FormHeader>

              <div>

                <FormEyebrow>
                  FLEET REGISTRATION
                </FormEyebrow>


                <FormTitle>
                  Add a New Lorry
                </FormTitle>


                <FormDescription>
                  Register a rig in the fleet
                  before assigning a manager
                  and starting operations.
                </FormDescription>

              </div>


              <FormClose
                type="button"
                onClick={
                  handleAddLorry
                }
              >
                ×
              </FormClose>

            </FormHeader>


            <AddLorryForm
              onSubmit={
                handleSubmit
              }
            >


              <FormField>

                <FormLabel>
                  Registration Number
                </FormLabel>


                <Input
                  type="text"
                  placeholder="e.g. TN 34 K 3749"
                  value={
                    registrationNumber
                  }
                  onChange={
                    e =>
                      setRegistrationNumber(
                        e.target.value
                      )
                  }
                  required
                />

              </FormField>


              <FormField>

                <FormLabel>
                  Owner Name
                </FormLabel>


                <Input
                  type="text"
                  placeholder="Owner name"
                  value={
                    ownerName
                  }
                  onChange={
                    e =>
                      setOwnerName(
                        e.target.value
                      )
                  }
                  required
                />

              </FormField>


              <FormField>

                <FormLabel>
                  Owner Phone
                </FormLabel>


                <Input
                  type="text"
                  placeholder="Owner phone number"
                  value={
                    ownerPhone
                  }
                  onChange={
                    e =>
                      setOwnerPhone(
                        e.target.value
                      )
                  }
                  required
                />

              </FormField>


              <FormField>

                <FormLabel>
                  Rig / Lorry Model
                </FormLabel>


                <Input
                  type="text"
                  placeholder="e.g. Ashok Leyland"
                  value={
                    model
                  }
                  onChange={
                    e =>
                      setModel(
                        e.target.value
                      )
                  }
                  required
                />

              </FormField>


              <FormField>

                <FormLabel>
                  Year Built
                </FormLabel>


                <Input
                  type="number"
                  placeholder="e.g. 2018"
                  value={
                    yearBuilt
                  }
                  onChange={
                    e =>
                      setYearBuilt(
                        e.target.value
                      )
                  }
                  required
                />

              </FormField>


              <FormSubmitButton
                type="submit"
                disabled={
                  loading
                }
              >

                {
                  loading
                    ? "Adding..."
                    : "Register Lorry"
                }


                <span>
                  →
                </span>

              </FormSubmitButton>

            </AddLorryForm>

          </AddLorrySection>

        )
      }


      {/* =================================================
          LORRY LIST HEADER
      ================================================= */}

      <FleetHeader>

        <div>

          <FleetEyebrow>
            ACTIVE FLEET
          </FleetEyebrow>


          <FleetTitle>
            Lorries & Rigs
          </FleetTitle>

        </div>


        {
          lorries.length > 0 && (

            <FleetCount>

              {
                lorries.length
              }

              {" "}

              {
                lorries.length === 1
                  ? "Lorry"
                  : "Lorries"
              }

            </FleetCount>

          )
        }

      </FleetHeader>


      {/* =================================================
          LORRY LIST
      ================================================= */}

      <LorryListContainer>


        {
          loading &&
          lorries.length === 0 ? (

            <LoadingText>
              Loading fleet...
            </LoadingText>

          ) : lorries.length === 0 ? (

            <NoLorries>

              <NoLorriesIcon>
                🚛
              </NoLorriesIcon>


              <NoLorriesTitle>
                No lorries available
              </NoLorriesTitle>


              <NoLorriesText>

                {
                  userType ===
                  "lorry_manager"
                    ? "No lorry has been assigned to you yet."
                    : "Your fleet is currently empty."
                }

              </NoLorriesText>


              {
                userType ===
                "owner" && (

                  <NoLorriesButton
                    onClick={
                      handleAddLorry
                    }
                  >

                    Add Your First Lorry

                  </NoLorriesButton>

                )
              }

            </NoLorries>

          ) : (

            lorries.map(
              lorry => (

                <LorryCard
                  key={
                    lorry.id
                  }
                >


                  {/* =====================================
                      IMAGE
                  ===================================== */}

                  <ImageContainer
                    onClick={() =>
                      handleLorryClick(
                        lorry.id
                      )
                    }
                  >

                    <img
                      src={
                        LorryImage
                      }
                      alt="Drilling rig"
                    />


                    <ImageOverlay />


                    <FleetStatus>
                      ACTIVE FLEET
                    </FleetStatus>


                    <RegistrationBadge>

                      {
                        lorry.registration_number
                      }

                    </RegistrationBadge>

                  </ImageContainer>


                  {/* =====================================
                      CARD CONTENT
                  ===================================== */}

                  <LorryCardContent>


                    <CardTop>

                      <div>

                        <CardEyebrow>
                          DRILLING RIG
                        </CardEyebrow>


                        <CardTitle>
                          {
                            lorry.model ||
                            "Rig Vehicle"
                          }
                        </CardTitle>

                      </div>


                      <OpenArrow
                        onClick={() =>
                          handleLorryClick(
                            lorry.id
                          )
                        }
                      >
                        →
                      </OpenArrow>

                    </CardTop>


                    {/* =================================
                        DETAILS
                    ================================= */}

                    <DetailsGrid>


                      <DetailItem>

                        <DetailLabel>
                          OWNER
                        </DetailLabel>


                        <DetailValue>
                          {
                            lorry.owner_name ||
                            "Not Available"
                          }
                        </DetailValue>

                      </DetailItem>


                      <DetailItem>

                        <DetailLabel>
                          PHONE
                        </DetailLabel>


                        <DetailValue>
                          {
                            lorry.owner_phone ||
                            "Not Available"
                          }
                        </DetailValue>

                      </DetailItem>


                      <DetailItem>

                        <DetailLabel>
                          MODEL
                        </DetailLabel>


                        <DetailValue>
                          {
                            lorry.model ||
                            "Not Available"
                          }
                        </DetailValue>

                      </DetailItem>


                      <DetailItem>

                        <DetailLabel>
                          YEAR BUILT
                        </DetailLabel>


                        <DetailValue>
                          {
                            lorry.year_built ||
                            "—"
                          }
                        </DetailValue>

                      </DetailItem>

                    </DetailsGrid>


                    {/* =================================
                        MANAGER
                    ================================= */}

                    <ManagerInfo>

                      <ManagerIcon>
                        👤
                      </ManagerIcon>


                      <div>

                        <ManagerLabel>
                          LORRY MANAGER
                        </ManagerLabel>


                        <ManagerName>

                          {
                            lorry.lorry_manager_name
                              ? lorry.lorry_manager_name
                              : "Not Assigned"
                          }

                        </ManagerName>


                        {
                          lorry.lorry_manager_phone && (

                            <ManagerPhone>

                              {
                                lorry.lorry_manager_phone
                              }

                            </ManagerPhone>

                          )
                        }

                      </div>

                    </ManagerInfo>


                    {/* =================================
                        OWNER CONTROLS
                    ================================= */}

                    {
                      userType ===
                      "owner" && (

                        <ManagerSection
                          onClick={
                            e =>
                              e.stopPropagation()
                          }
                        >

                          <ManagerSectionTitle>
                            Manager Assignment
                          </ManagerSectionTitle>


                          <ManagerRow>

                            <ManagerSelect
                              value={
                                selectedManagers[
                                  lorry.id
                                ] || ""
                              }
                              onChange={
                                e =>
                                  handleManagerChange(
                                    lorry.id,
                                    e.target.value
                                  )
                              }
                            >

                              <option value="">
                                Select Lorry Manager
                              </option>


                              {
                                managers.map(
                                  manager => (

                                    <option
                                      key={
                                        manager.id
                                      }
                                      value={
                                        manager.id
                                      }
                                    >

                                      {
                                        manager.name
                                      }

                                      {" — "}

                                      {
                                        manager.phone
                                      }

                                    </option>

                                  )
                                )
                              }

                            </ManagerSelect>


                            <ManagerButton
                              onClick={() =>
                                handleAssignManager(
                                  lorry.id
                                )
                              }
                              disabled={
                                loading
                              }
                            >

                              Assign

                            </ManagerButton>

                          </ManagerRow>


                          {
                            lorry.lorry_manager_id && (

                              <RemoveManagerButton
                                onClick={() =>
                                  handleRemoveManager(
                                    lorry.id
                                  )
                                }
                                disabled={
                                  loading
                                }
                              >

                                Remove Current Manager

                              </RemoveManagerButton>

                            )
                          }

                        </ManagerSection>

                      )
                    }


                    {/* =================================
                        DELETE
                    ================================= */}

                    {
                      userType ===
                      "owner" && (

                        <DeleteButton
                          onClick={
                            e => {

                              e.stopPropagation();


                              handleDeleteLorry(
                                lorry.id,
                                lorry.registration_number
                              );

                            }
                          }
                          disabled={
                            loading
                          }
                        >

                          Delete Lorry

                        </DeleteButton>

                      )
                    }


                    {/* =================================
                        OPEN DASHBOARD
                    ================================= */}

                    <OpenDashboardButton
                      onClick={() =>
                        handleLorryClick(
                          lorry.id
                        )
                      }
                    >

                      Open Lorry Dashboard

                      <span>
                        →
                      </span>

                    </OpenDashboardButton>

                  </LorryCardContent>

                </LorryCard>

              )
            )

          )
        }

      </LorryListContainer>


      {/* =================================================
          COMPANY FOOTER
      ================================================= */}

      <Footer>

        <FooterBrand>
          Sri Murugan Rig Service
        </FooterBrand>


        <FooterQuote>
          “25 Years of Experience.
          Built on Trust.
          Driven by Service.”
        </FooterQuote>


        <FooterSince>
          Since 2001
        </FooterSince>

      </Footer>

    </Page>

  );

};


export default HomePage;


// =====================================================
// STYLED COMPONENTS
// =====================================================


// =====================================================
// PAGE
// =====================================================

const Page = styled.div`

  min-height: 100vh;

  padding:
    22px 45px 60px;

  background:

    radial-gradient(
      circle at 5% 8%,
      rgba(22, 101, 52, 0.06),
      transparent 25%
    ),

    radial-gradient(
      circle at 95% 25%,
      rgba(180, 83, 9, 0.04),
      transparent 22%
    ),

    linear-gradient(
      135deg,
      #f8faf9 0%,
      #eef4f0 100%
    );

`;


// =====================================================
// TOP BAR
// =====================================================

const TopBar = styled.header`

  max-width:
    1500px;

  margin:
    0 auto 25px;

  min-height:
    65px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    25px;

`;


// =====================================================
// BRAND AREA
// =====================================================

const BrandArea = styled.div`

  display:
    flex;

  align-items:
    center;

  gap:
    12px;

`;


// =====================================================
// BRAND MARK
// =====================================================

const BrandMark = styled.div`

  width:
    46px;

  height:
    46px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    13px;

  background:
    #14532d;

  color:
    #ffffff;

  font-size:
    13px;

  font-weight:
    900;

  letter-spacing:
    1px;

  box-shadow:
    0 7px 17px
    rgba(20,83,45,0.16);

`;


// =====================================================
// BRAND NAME
// =====================================================

const BrandName = styled.div`

  color:
    #172554;

  font-size:
    16px;

  font-weight:
    900;

`;


// =====================================================
// BRAND SMALL
// =====================================================

const BrandSmall = styled.div`

  margin-top:
    3px;

  color:
    #94a3b8;

  font-size:
    9px;

  font-weight:
    700;

`;


// =====================================================
// TOP ACTIONS
// =====================================================

const TopActions = styled.div`

  display:
    flex;

  align-items:
    center;

  gap:
    15px;

`;


// =====================================================
// USER BOX
// =====================================================

const UserBox = styled.div`

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  padding:
    7px 12px;

  border:
    1px solid #dce7e1;

  border-radius:
    13px;

  background:
    rgba(255,255,255,0.88);

`;


// =====================================================
// USER AVATAR
// =====================================================

const UserAvatar = styled.div`

  width:
    36px;

  height:
    36px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    10px;

  background:
    #ecfdf5;

  color:
    #166534;

  font-size:
    13px;

  font-weight:
    900;

`;


// =====================================================
// USER NAME
// =====================================================

const UserName = styled.div`

  color:
    #172554;

  font-size:
    12px;

  font-weight:
    900;

`;


// =====================================================
// USER ROLE
// =====================================================

const UserRole = styled.div`

  margin-top:
    2px;

  color:
    #94a3b8;

  font-size:
    8px;

  font-weight:
    900;

  letter-spacing:
    0.8px;

`;


// =====================================================
// LOGOUT
// =====================================================

const LogoutButton = styled.button`

  min-height:
    40px;

  padding:
    0 15px;

  border:
    1px solid #fecaca;

  border-radius:
    10px;

  background:
    #fffafa;

  color:
    #b91c1c;

  font-size:
    11px;

  font-weight:
    900;

  cursor:
    pointer;

  transition:
    all 0.2s ease;


  &:hover {

    background:
      #fef2f2;

    border-color:
      #fca5a5;

  }

`;


// =====================================================
// HERO
// =====================================================

const Hero = styled.section`

  position:
    relative;

  max-width:
    1500px;

  min-height:
    470px;

  margin:
    0 auto 42px;

  overflow:
    hidden;

  border-radius:
    28px;

  background:
    #173b2a;

  box-shadow:
    0 25px 55px
    rgba(15,23,42,0.14);

`;


// =====================================================
// HERO IMAGE
// =====================================================

const HeroImage = styled.div`

  position:
    absolute;

  inset:
    0;

  width:
    100%;

  height:
    100%;

  img {

    width:
      100%;

    height:
      100%;

    object-fit:
      cover;

    object-position:
      center;

  }

`;


// =====================================================
// HERO OVERLAY
// =====================================================

const HeroOverlay = styled.div`

  position:
    absolute;

  inset:
    0;

  background:
    linear-gradient(
      90deg,
      rgba(10,31,21,0.96) 0%,
      rgba(15,48,32,0.88) 42%,
      rgba(15,48,32,0.45) 70%,
      rgba(15,48,32,0.18) 100%
    );

`;


// =====================================================
// HERO CONTENT
// =====================================================

const HeroContent = styled.div`

  position:
    relative;

  z-index:
    2;

  max-width:
    760px;

  padding:
    58px;

`;


// =====================================================
// HERO EYEBROW
// =====================================================

const HeroEyebrow = styled.div`

  color:
    #bbf7d0;

  font-size:
    10px;

  font-weight:
    900;

  letter-spacing:
    2px;

`;


// =====================================================
// HERO TITLE
// =====================================================

const HeroTitle = styled.h1`

  margin:
    12px 0 0;

  color:
    #ffffff;

  font-size:
    clamp(38px, 5vw, 62px);

  line-height:
    1.05;

  font-weight:
    900;

  letter-spacing:
    -1.8px;

`;


// =====================================================
// HERO DESCRIPTION
// =====================================================

const HeroDescription = styled.p`

  max-width:
    690px;

  margin:
    20px 0 0;

  color:
    #dbece2;

  font-size:
    15px;

  line-height:
    1.75;

  strong {

    color:
      #ffffff;

    font-weight:
      800;

  }

`;


// =====================================================
// HERO QUOTE
// =====================================================

const HeroQuote = styled.div`

  margin-top:
    18px;

  padding-left:
    14px;

  border-left:
    3px solid #86efac;

  color:
    #dcfce7;

  font-size:
    13px;

  font-weight:
    700;

  font-style:
    italic;

`;


// =====================================================
// LOCATION BANNER
// =====================================================

const LocationBanner = styled.div`

  margin-top:
    27px;

  padding:
    14px 17px;

  border:
    1px solid
    rgba(255,255,255,0.14);

  border-radius:
    14px;

  background:
    rgba(255,255,255,0.07);

  backdrop-filter:
    blur(8px);

`;


// =====================================================
// LOCATION TITLE
// =====================================================

const LocationTitle = styled.div`

  margin-bottom:
    8px;

  color:
    #a7f3d0;

  font-size:
    8px;

  font-weight:
    900;

  letter-spacing:
    1.5px;

`;


// =====================================================
// LOCATION LIST
// =====================================================

const LocationList = styled.div`

  display:
    flex;

  flex-wrap:
    wrap;

  gap:
    7px;

`;


// =====================================================
// LOCATION
// =====================================================

const Location = styled.span`

  padding:
    6px 9px;

  border:
    1px solid
    rgba(255,255,255,0.12);

  border-radius:
    7px;

  color:
    #f0fdf4;

  background:
    rgba(255,255,255,0.06);

  font-size:
    9px;

  font-weight:
    700;

`;


// =====================================================
// PAGE INTRO
// =====================================================

const PageIntro = styled.div`

  max-width:
    1500px;

  margin:
    0 auto 20px;

  display:
    flex;

  align-items:
    flex-end;

  justify-content:
    space-between;

  gap:
    20px;

`;


// =====================================================
// INTRO EYEBROW
// =====================================================

const IntroEyebrow = styled.div`

  color:
    #3f6f5a;

  font-size:
    9px;

  font-weight:
    900;

  letter-spacing:
    1.8px;

`;


// =====================================================
// INTRO TITLE
// =====================================================

const IntroTitle = styled.h2`

  margin:
    4px 0 0;

  color:
    #172554;

  font-size:
    30px;

  font-weight:
    900;

  letter-spacing:
    -0.7px;

`;


// =====================================================
// INTRO DESCRIPTION
// =====================================================

const IntroDescription = styled.div`

  margin-top:
    6px;

  color:
    #64748b;

  font-size:
    13px;

`;


// =====================================================
// ADD LORRY BUTTON
// =====================================================

const AddLorryButton = styled.button`

  min-height:
    49px;

  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  padding:
    0 18px;

  border:
    none;

  border-radius:
    11px;

  background:
    #166534;

  color:
    #ffffff;

  font-size:
    12px;

  font-weight:
    900;

  cursor:
    pointer;

  box-shadow:
    0 8px 20px
    rgba(22,101,52,0.15);

  transition:
    all 0.2s ease;


  span {

    font-size:
      21px;

    font-weight:
      400;

  }


  &:hover {

    transform:
      translateY(-2px);

    background:
      #14532d;

  }

`;


// =====================================================
// STATS GRID
// =====================================================

const StatsGrid = styled.div`

  max-width:
    1500px;

  margin:
    0 auto 38px;

  display:
    grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap:
    16px;

`;


// =====================================================
// STAT CARD
// =====================================================

const StatCard = styled.div`

  min-height:
    120px;

  display:
    flex;

  align-items:
    center;

  gap:
    15px;

  padding:
    20px;

  border:
    1px solid #dce7e1;

  border-radius:
    17px;

  background:
    #ffffff;

  box-shadow:
    0 7px 22px
    rgba(15,23,42,0.045);

`;


// =====================================================
// STAT ICON
// =====================================================

const StatIcon = styled.div`

  width:
    49px;

  height:
    49px;

  flex-shrink:
    0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    14px;

  background:
    ${({ $green, $orange, $blue }) => {

      if ($green) {
        return "#ecfdf5";
      }

      if ($orange) {
        return "#fff7ed";
      }

      if ($blue) {
        return "#eff6ff";
      }

      return "#f1f5f9";

    }};

  color:
    ${({ $green, $orange, $blue }) => {

      if ($green) {
        return "#166534";
      }

      if ($orange) {
        return "#c2410c";
      }

      if ($blue) {
        return "#1d4ed8";
      }

      return "#475569";

    }};

  font-size:
    19px;

  font-weight:
    900;

`;


// =====================================================
// STAT LABEL
// =====================================================

const StatLabel = styled.div`

  color:
    #94a3b8;

  font-size:
    8px;

  font-weight:
    900;

  letter-spacing:
    1px;

`;


// =====================================================
// STAT VALUE
// =====================================================

const StatValue = styled.div`

  margin-top:
    3px;

  color:
    #172554;

  font-size:
    26px;

  font-weight:
    900;

`;


// =====================================================
// STAT HINT
// =====================================================

const StatHint = styled.div`

  margin-top:
    2px;

  color:
    #94a3b8;

  font-size:
    9px;

`;


// =====================================================
// ADD LORRY SECTION
// =====================================================

const AddLorrySection = styled.section`

  max-width:
    1500px;

  margin:
    0 auto 35px;

  padding:
    25px;

  border:
    1px solid #bbf7d0;

  border-radius:
    20px;

  background:
    linear-gradient(
      135deg,
      #f0fdf4,
      #ffffff
    );

  box-shadow:
    0 9px 25px
    rgba(15,23,42,0.045);

`;


// =====================================================
// FORM HEADER
// =====================================================

const FormHeader = styled.div`

  display:
    flex;

  align-items:
    flex-start;

  justify-content:
    space-between;

  gap:
    20px;

  margin-bottom:
    22px;

`;


// =====================================================
// FORM EYEBROW
// =====================================================

const FormEyebrow = styled.div`

  color:
    #3f6f5a;

  font-size:
    9px;

  font-weight:
    900;

  letter-spacing:
    1.5px;

`;


// =====================================================
// FORM TITLE
// =====================================================

const FormTitle = styled.h3`

  margin:
    5px 0 0;

  color:
    #172554;

  font-size:
    23px;

  font-weight:
    900;

`;


// =====================================================
// FORM DESCRIPTION
// =====================================================

const FormDescription = styled.div`

  margin-top:
    5px;

  color:
    #64748b;

  font-size:
    11px;

`;


// =====================================================
// FORM CLOSE
// =====================================================

const FormClose = styled.button`

  width:
    36px;

  height:
    36px;

  border:
    1px solid #dce7e1;

  border-radius:
    9px;

  background:
    #ffffff;

  color:
    #64748b;

  font-size:
    20px;

  cursor:
    pointer;

`;


// =====================================================
// ADD FORM
// =====================================================

const AddLorryForm = styled.form`

  display:
    grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap:
    17px;

`;


// =====================================================
// FORM FIELD
// =====================================================

const FormField = styled.div`

  min-width:
    0;

`;


// =====================================================
// FORM LABEL
// =====================================================

const FormLabel = styled.label`

  display:
    block;

  margin-bottom:
    7px;

  color:
    #334155;

  font-size:
    10px;

  font-weight:
    900;

`;


// =====================================================
// INPUT
// =====================================================

const Input = styled.input`

  width:
    100%;

  min-height:
    50px;

  box-sizing:
    border-box;

  padding:
    0 14px;

  border:
    1px solid #cbd5e1;

  border-radius:
    10px;

  outline:
    none;

  background:
    #ffffff;

  color:
    #172554;

  font-family:
    inherit;

  font-size:
    13px;

  font-weight:
    600;

  transition:
    all 0.2s ease;


  &::placeholder {

    color:
      #94a3b8;

  }


  &:focus {

    border-color:
      #22c55e;

    box-shadow:
      0 0 0 3px
      rgba(34,197,94,0.09);

  }

`;


// =====================================================
// FORM SUBMIT
// =====================================================

const FormSubmitButton = styled.button`

  min-height:
    50px;

  align-self:
    end;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    12px;

  border:
    none;

  border-radius:
    10px;

  background:
    #166534;

  color:
    #ffffff;

  font-size:
    12px;

  font-weight:
    900;

  cursor:
    pointer;


  span {

    font-size:
      17px;

  }


  &:hover {

    background:
      #14532d;

  }


  &:disabled {

    opacity:
      0.55;

    cursor:
      not-allowed;

  }

`;


// =====================================================
// FLEET HEADER
// =====================================================

const FleetHeader = styled.div`

  max-width:
    1500px;

  margin:
    0 auto 17px;

  display:
    flex;

  align-items:
    flex-end;

  justify-content:
    space-between;

`;


// =====================================================
// FLEET EYEBROW
// =====================================================

const FleetEyebrow = styled.div`

  color:
    #3f6f5a;

  font-size:
    9px;

  font-weight:
    900;

  letter-spacing:
    1.7px;

`;


// =====================================================
// FLEET TITLE
// =====================================================

const FleetTitle = styled.h2`

  margin:
    4px 0 0;

  color:
    #172554;

  font-size:
    28px;

  font-weight:
    900;

`;


// =====================================================
// FLEET COUNT
// =====================================================

const FleetCount = styled.div`

  padding:
    8px 12px;

  border-radius:
    9px;

  background:
    #ffffff;

  border:
    1px solid #dce7e1;

  color:
    #475569;

  font-size:
    10px;

  font-weight:
    900;

`;


// =====================================================
// LORRY LIST
// =====================================================

const LorryListContainer = styled.div`

  max-width:
    1500px;

  margin:
    0 auto;

  display:
    grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap:
    20px;

`;


// =====================================================
// LORRY CARD
// =====================================================

const LorryCard = styled.article`

  overflow:
    hidden;

  border:
    1px solid #dce7e1;

  border-radius:
    20px;

  background:
    #ffffff;

  box-shadow:
    0 9px 28px
    rgba(15,23,42,0.055);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;


  &:hover {

    transform:
      translateY(-4px);

    box-shadow:
      0 16px 35px
      rgba(15,23,42,0.09);

  }

`;


// =====================================================
// IMAGE CONTAINER
// =====================================================

const ImageContainer = styled.div`

  position:
    relative;

  height:
    235px;

  overflow:
    hidden;

  cursor:
    pointer;

  img {

    width:
      100%;

    height:
      100%;

    object-fit:
      cover;

    transition:
      transform 0.4s ease;

  }


  &:hover img {

    transform:
      scale(1.035);

  }

`;


// =====================================================
// IMAGE OVERLAY
// =====================================================

const ImageOverlay = styled.div`

  position:
    absolute;

  inset:
    0;

  background:
    linear-gradient(
      to top,
      rgba(8,25,17,0.75),
      rgba(8,25,17,0.04) 55%
    );

`;


// =====================================================
// FLEET STATUS
// =====================================================

const FleetStatus = styled.div`

  position:
    absolute;

  top:
    14px;

  left:
    14px;

  padding:
    6px 9px;

  border:
    1px solid
    rgba(255,255,255,0.2);

  border-radius:
    7px;

  background:
    rgba(22,101,52,0.85);

  color:
    #ffffff;

  font-size:
    8px;

  font-weight:
    900;

  letter-spacing:
    1px;

`;


// =====================================================
// REGISTRATION BADGE
// =====================================================

const RegistrationBadge = styled.div`

  position:
    absolute;

  bottom:
    14px;

  left:
    14px;

  padding:
    8px 11px;

  border-radius:
    8px;

  background:
    #ffffff;

  color:
    #172554;

  font-size:
    13px;

  font-weight:
    900;

  letter-spacing:
    0.6px;

  box-shadow:
    0 5px 15px
    rgba(0,0,0,0.12);

`;


// =====================================================
// CARD CONTENT
// =====================================================

const LorryCardContent = styled.div`

  padding:
    20px;

`;


// =====================================================
// CARD TOP
// =====================================================

const CardTop = styled.div`

  display:
    flex;

  align-items:
    flex-start;

  justify-content:
    space-between;

  gap:
    15px;

  margin-bottom:
    17px;

`;


// =====================================================
// CARD EYEBROW
// =====================================================

const CardEyebrow = styled.div`

  color:
    #3f6f5a;

  font-size:
    8px;

  font-weight:
    900;

  letter-spacing:
    1.3px;

`;


// =====================================================
// CARD TITLE
// =====================================================

const CardTitle = styled.h3`

  margin:
    4px 0 0;

  color:
    #172554;

  font-size:
    21px;

  font-weight:
    900;

`;


// =====================================================
// OPEN ARROW
// =====================================================

const OpenArrow = styled.button`

  width:
    37px;

  height:
    37px;

  flex-shrink:
    0;

  border:
    1px solid #dce7e1;

  border-radius:
    10px;

  background:
    #f8faf9;

  color:
    #166534;

  font-size:
    18px;

  cursor:
    pointer;


  &:hover {

    background:
      #ecfdf5;

  }

`;


// =====================================================
// DETAILS GRID
// =====================================================

const DetailsGrid = styled.div`

  display:
    grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap:
    12px;

  padding:
    15px 0;

  border-top:
    1px solid #eef2f7;

  border-bottom:
    1px solid #eef2f7;

`;


// =====================================================
// DETAIL ITEM
// =====================================================

const DetailItem = styled.div`

  min-width:
    0;

`;


// =====================================================
// DETAIL LABEL
// =====================================================

const DetailLabel = styled.div`

  color:
    #94a3b8;

  font-size:
    7px;

  font-weight:
    900;

  letter-spacing:
    0.9px;

`;


// =====================================================
// DETAIL VALUE
// =====================================================

const DetailValue = styled.div`

  margin-top:
    3px;

  overflow:
    hidden;

  color:
    #334155;

  font-size:
    11px;

  font-weight:
    800;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;

`;


// =====================================================
// MANAGER INFO
// =====================================================

const ManagerInfo = styled.div`

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  margin-top:
    16px;

  padding:
    12px;

  border-radius:
    11px;

  background:
    #f8faf9;

`;


// =====================================================
// MANAGER ICON
// =====================================================

const ManagerIcon = styled.div`

  width:
    35px;

  height:
    35px;

  flex-shrink:
    0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    9px;

  background:
    #ecfdf5;

  font-size:
    14px;

`;


// =====================================================
// MANAGER LABEL
// =====================================================

const ManagerLabel = styled.div`

  color:
    #94a3b8;

  font-size:
    7px;

  font-weight:
    900;

  letter-spacing:
    0.9px;

`;


// =====================================================
// MANAGER NAME
// =====================================================

const ManagerName = styled.div`

  margin-top:
    2px;

  color:
    #172554;

  font-size:
    11px;

  font-weight:
    900;

`;


// =====================================================
// MANAGER PHONE
// =====================================================

const ManagerPhone = styled.div`

  margin-top:
    2px;

  color:
    #64748b;

  font-size:
    9px;

`;


// =====================================================
// MANAGER SECTION
// =====================================================

const ManagerSection = styled.div`

  margin-top:
    15px;

  padding-top:
    15px;

  border-top:
    1px solid #eef2f7;

`;


// =====================================================
// MANAGER SECTION TITLE
// =====================================================

const ManagerSectionTitle = styled.div`

  margin-bottom:
    8px;

  color:
    #475569;

  font-size:
    9px;

  font-weight:
    900;

`;


// =====================================================
// MANAGER ROW
// =====================================================

const ManagerRow = styled.div`

  display:
    flex;

  gap:
    8px;

`;


// =====================================================
// MANAGER SELECT
// =====================================================

const ManagerSelect = styled.select`

  flex:
    1;

  min-width:
    0;

  height:
    42px;

  padding:
    0 10px;

  border:
    1px solid #cbd5e1;

  border-radius:
    8px;

  outline:
    none;

  background:
    #ffffff;

  color:
    #334155;

  font-family:
    inherit;

  font-size:
    10px;

  font-weight:
    700;

  &:focus {

    border-color:
      #22c55e;

  }

`;


// =====================================================
// MANAGER BUTTON
// =====================================================

const ManagerButton = styled.button`

  min-width:
    72px;

  height:
    42px;

  border:
    none;

  border-radius:
    8px;

  background:
    #166534;

  color:
    #ffffff;

  font-size:
    9px;

  font-weight:
    900;

  cursor:
    pointer;


  &:hover {

    background:
      #14532d;

  }


  &:disabled {

    opacity:
      0.55;

    cursor:
      not-allowed;

  }

`;


// =====================================================
// REMOVE MANAGER
// =====================================================

const RemoveManagerButton = styled.button`

  width:
    100%;

  height:
    38px;

  margin-top:
    8px;

  border:
    1px solid #fed7aa;

  border-radius:
    8px;

  background:
    #fff7ed;

  color:
    #c2410c;

  font-size:
    9px;

  font-weight:
    900;

  cursor:
    pointer;


  &:hover {

    background:
      #ffedd5;

  }


  &:disabled {

    opacity:
      0.55;

    cursor:
      not-allowed;

  }

`;


// =====================================================
// DELETE BUTTON
// =====================================================

const DeleteButton = styled.button`

  width:
    100%;

  height:
    36px;

  margin-top:
    10px;

  border:
    1px solid #fecaca;

  border-radius:
    8px;

  background:
    #fffafa;

  color:
    #b91c1c;

  font-size:
    9px;

  font-weight:
    900;

  cursor:
    pointer;


  &:hover {

    background:
      #fef2f2;

  }


  &:disabled {

    opacity:
      0.55;

    cursor:
      not-allowed;

  }

`;


// =====================================================
// OPEN DASHBOARD BUTTON
// =====================================================

const OpenDashboardButton = styled.button`

  width:
    100%;

  height:
    46px;

  margin-top:
    13px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    12px;

  border:
    none;

  border-radius:
    10px;

  background:
    #172554;

  color:
    #ffffff;

  font-size:
    10px;

  font-weight:
    900;

  cursor:
    pointer;

  transition:
    all 0.2s ease;


  span {

    font-size:
      17px;

  }


  &:hover {

    background:
      #1e3a8a;

    transform:
      translateY(-1px);

  }

`;


// =====================================================
// LOADING TEXT
// =====================================================

const LoadingText = styled.div`

  grid-column:
    1 / -1;

  min-height:
    250px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  color:
    #64748b;

  font-size:
    15px;

  font-weight:
    700;

`;


// =====================================================
// NO LORRIES
// =====================================================

const NoLorries = styled.div`

  grid-column:
    1 / -1;

  min-height:
    380px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  padding:
    40px;

  border:
    1px dashed #cbd5e1;

  border-radius:
    20px;

  background:
    rgba(255,255,255,0.6);

  text-align:
    center;

`;


// =====================================================
// NO LORRIES ICON
// =====================================================

const NoLorriesIcon = styled.div`

  width:
    68px;

  height:
    68px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    19px;

  background:
    #ecfdf5;

  font-size:
    29px;

`;


// =====================================================
// NO LORRIES TITLE
// =====================================================

const NoLorriesTitle = styled.h3`

  margin:
    17px 0 0;

  color:
    #172554;

  font-size:
    21px;

  font-weight:
    900;

`;


// =====================================================
// NO LORRIES TEXT
// =====================================================

const NoLorriesText = styled.p`

  margin:
    7px 0 0;

  color:
    #94a3b8;

  font-size:
    12px;

`;


// =====================================================
// NO LORRIES BUTTON
// =====================================================

const NoLorriesButton = styled.button`

  margin-top:
    18px;

  min-height:
    43px;

  padding:
    0 16px;

  border:
    none;

  border-radius:
    9px;

  background:
    #166534;

  color:
    #ffffff;

  font-size:
    10px;

  font-weight:
    900;

  cursor:
    pointer;

`;


// =====================================================
// FOOTER
// =====================================================

const Footer = styled.footer`

  max-width:
    1500px;

  margin:
    48px auto 0;

  padding:
    23px 0 0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    20px;

  border-top:
    1px solid #dce7e1;

`;


// =====================================================
// FOOTER BRAND
// =====================================================

const FooterBrand = styled.div`

  color:
    #166534;

  font-size:
    12px;

  font-weight:
    900;

`;


// =====================================================
// FOOTER QUOTE
// =====================================================

const FooterQuote = styled.div`

  color:
    #64748b;

  font-size:
    10px;

  font-style:
    italic;

`;


// =====================================================
// FOOTER SINCE
// =====================================================

const FooterSince = styled.div`

  color:
    #94a3b8;

  font-size:
    10px;

  font-weight:
    800;

`;


// =====================================================
// LOADING SCREEN
// =====================================================

const LoadingScreen = styled.div`

  min-height:
    100vh;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  background:
    linear-gradient(
      135deg,
      #f8faf9,
      #eef4f0
    );

`;


// =====================================================
// LOADING CARD
// =====================================================

const LoadingCard = styled.div`

  width:
    min(430px, 90%);

  padding:
    40px;

  border:
    1px solid #dce7e1;

  border-radius:
    22px;

  background:
    #ffffff;

  text-align:
    center;

  box-shadow:
    0 20px 50px
    rgba(15,23,42,0.08);

`;


// =====================================================
// LOADING LOGO
// =====================================================

const LoadingLogo = styled.div`

  width:
    70px;

  height:
    70px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  margin:
    0 auto 17px;

  border-radius:
    20px;

  background:
    #ecfdf5;

  font-size:
    32px;

`;


// =====================================================
// LOADING TITLE
// =====================================================

const LoadingTitle = styled.div`

  color:
    #172554;

  font-size:
    20px;

  font-weight:
    900;

`;


// =====================================================
// LOADING CARD SUBTITLE
// =====================================================

const LoadingCardSubtitle = styled.div`

  margin-top:
    7px;

  color:
    #94a3b8;

  font-size:
    11px;

`;


// =====================================================
// RESPONSIVE
// =====================================================

const ResponsiveStyles = createGlobalStyle`

  @media (max-width: 1200px) {

    ${LorryListContainer} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

    }


    ${StatsGrid} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

    }


    ${AddLorryForm} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

    }

  }


  @media (max-width: 850px) {

    ${Page} {

      padding:
        18px 22px 45px;

    }


    ${HeroContent} {

      padding:
        45px 35px;

    }


    ${Hero} {

      min-height:
        500px;

    }


    ${TopBar} {

      align-items:
        flex-start;

    }


    ${UserBox} {

      display:
        none;

    }

  }


  @media (max-width: 680px) {

    ${Page} {

      padding:
        14px 14px 40px;

    }


    ${TopBar} {

      margin-bottom:
        17px;

    }


    ${BrandName} {

      font-size:
        14px;

    }


    ${BrandSmall} {

      display:
        none;

    }


    ${Hero} {

      min-height:
        550px;

      border-radius:
        21px;

    }


    ${HeroContent} {

      padding:
        35px 24px;

    }


    ${HeroTitle} {

      font-size:
        38px;

    }


    ${HeroDescription} {

      font-size:
        13px;

    }


    ${PageIntro} {

      align-items:
        flex-start;

      flex-direction:
        column;

    }


    ${AddLorryButton} {

      width:
        100%;

    }


    ${StatsGrid} {

      grid-template-columns:
        1fr;

    }


    ${LorryListContainer} {

      grid-template-columns:
        1fr;

    }


    ${AddLorryForm} {

      grid-template-columns:
        1fr;

    }


    ${ManagerRow} {

      flex-direction:
        column;

    }


    ${ManagerButton} {

      width:
        100%;

    }


    ${Footer} {

      align-items:
        flex-start;

      flex-direction:
        column;

    }

  }


  @media (max-width: 420px) {

    ${TopActions} {

      gap:
        7px;

    }


    ${LogoutButton} {

      padding:
        0 10px;

    }


    ${BrandMark} {

      width:
        40px;

      height:
        40px;

    }


    ${HeroTitle} {

      font-size:
        33px;

    }


    ${Hero} {

      min-height:
        570px;

    }


    ${DetailsGrid} {

      grid-template-columns:
        1fr;

    }

  }

`;


// =====================================================
// RESPONSIVE STYLE MOUNT
// =====================================================

const ResponsiveStyleMount = () => (
  <ResponsiveStyles />
);