import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import styled from "styled-components";

import api from "../utils/api";

import LorryImage from "../assets/images/TN34K3749.jpeg";

import rigLogo from "../assets/images/rig_logo.jpg";

import {
  Menu,
  X,
  LayoutDashboard,
  Truck,
  Users,
  Fuel,
  MapPin,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";


// =====================================================
// OWNER PAGE
// =====================================================

const OwnerPage = () => {

  const navigate = useNavigate();


  // =====================================================
  // USER
  // =====================================================

  const userName =
    localStorage.getItem("userName");


  // =====================================================
  // STATE
  // =====================================================

  const [lorries, setLorries] =
    useState([]);

  const [managers, setManagers] =
    useState([]);

  const [selectedManagers, setSelectedManagers] =
    useState({});

  const [selectedLorryId, setSelectedLorryId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [isFormVisible, setIsFormVisible] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);


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
  // LOGOUT
  // =====================================================

  const logout = useCallback(() => {

    localStorage.removeItem(
      "authToken"
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

    navigate("/login");

  }, [navigate]);


  // =====================================================
  // FETCH LORRIES
  // =====================================================

  const fetchLorries = useCallback(
    async () => {

      try {

        setLoading(true);

        const response =
          await api.get("/lorry");

        setLorries(
          response.data
        );

      } catch (error) {

        console.error(
          "Error fetching lorries:",
          error
        );

        if (
          error.response?.status === 401
        ) {

          logout();

          return;

        }

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error fetching lorries."
        );

      } finally {

        setLoading(false);

      }

    },
    [logout]
  );


  // =====================================================
  // FETCH MANAGERS
  // =====================================================

  const fetchManagers = useCallback(
    async () => {

      try {

        const response =
          await api.get(
            "/lorry/managers"
          );

        setManagers(
          response.data
        );

      } catch (error) {

        console.error(
          "Error fetching managers:",
          error
        );

        if (
          error.response?.status === 401
        ) {

          logout();

          return;

        }

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch lorry managers."
        );

      }

    },
    [logout]
  );


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchLorries();

    fetchManagers();

  }, [
    fetchLorries,
    fetchManagers,
  ]);


  // =====================================================
  // MENU NAVIGATION
  // =====================================================

  const handleNavigation = (
    path
  ) => {

    setIsMenuOpen(false);

    navigate(path);

  };


  // =====================================================
  // SELECT LORRY
  // =====================================================

  const handleSelectLorry = (
    lorryId
  ) => {

    setSelectedLorryId(
      lorryId
    );

  };


  // =====================================================
  // OPEN LORRY DASHBOARD
  // =====================================================

  const handleLorryClick = (
    lorryId
  ) => {

    setSelectedLorryId(
      lorryId
    );

    navigate(
      `/dashboard/${lorryId}`
    );

  };


  // =====================================================
  // EMPLOYEE PAGE
  // =====================================================

  const handleEmployeesNavigation = () => {

    if (!selectedLorryId) {

      alert(
        "Please select a rig first."
      );

      setIsMenuOpen(false);

      return;

    }

    setIsMenuOpen(false);

    navigate(
      `/employee/${selectedLorryId}`
    );

  };


  // =====================================================
  // FUEL PAGE
  // =====================================================

  const handleFuelNavigation = () => {

    if (!selectedLorryId) {

      alert(
        "Please select a rig first."
      );

      setIsMenuOpen(false);

      return;

    }

    setIsMenuOpen(false);

    navigate(
      `/fuel/${selectedLorryId}`
    );

  };


  // =====================================================
  // POINT DETAILS PAGE
  // =====================================================

  const handlePointDetailsNavigation = () => {

    if (!selectedLorryId) {

      alert(
        "Please select a rig first."
      );

      setIsMenuOpen(false);

      return;

    }

    setIsMenuOpen(false);

    navigate(
      `/point-details/${selectedLorryId}`
    );

  };


  // =====================================================
  // ADD LORRY FORM
  // =====================================================

  const handleAddLorry = () => {

    setIsFormVisible(
      !isFormVisible
    );

  };


  // =====================================================
  // SUBMIT LORRY
  // =====================================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      const newLorry = {

        registration_number:
          registrationNumber,

        owner_phone:
          ownerPhone,

        model,

        year_built:
          yearBuilt,

        owner_name:
          ownerName,

      };


      await api.post(
        "/lorry/add",
        newLorry
      );


      alert(
        "Lorry added successfully."
      );


      setRegistrationNumber("");

      setOwnerPhone("");

      setModel("");

      setYearBuilt("");

      setOwnerName("");

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

        logout();

        return;

      }


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add lorry."
      );

    }

  };


  // =====================================================
  // DELETE LORRY
  // =====================================================

  const handleDeleteLorry = async (
    lorryId,
    registrationNumber
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete lorry ${registrationNumber}?`
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
        (previousLorries) =>
          previousLorries.filter(
            (lorry) =>
              lorry.id !== lorryId
          )
      );


      if (
        selectedLorryId === lorryId
      ) {

        setSelectedLorryId(
          null
        );

      }

    } catch (error) {

      console.error(
        "Error deleting lorry:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        logout();

        return;

      }


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete lorry."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // MANAGER SELECT
  // =====================================================

  const handleManagerChange = (
    lorryId,
    managerId
  ) => {

    setSelectedManagers(
      (previous) => ({

        ...previous,

        [lorryId]:
          managerId,

      })
    );

  };


  // =====================================================
  // ASSIGN MANAGER
  // =====================================================

  const handleAssignManager = async (
    lorryId
  ) => {

    const managerId =
      selectedManagers[lorryId];


    if (!managerId) {

      alert(
        "Please select a lorry manager."
      );

      return;

    }


    const confirmed =
      window.confirm(
        "Are you sure you want to assign this lorry manager?\n\n" +
        "If the manager is currently assigned to another lorry, " +
        "they will be moved to this lorry."
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
            Number(managerId),
        }
      );


      alert(
        "Lorry manager assigned successfully."
      );


      await fetchLorries();


      setSelectedManagers(
        (previous) => {

          const updated = {
            ...previous,
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


      if (
        error.response?.status === 401
      ) {

        logout();

        return;

      }


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to assign lorry manager."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // REMOVE MANAGER
  // =====================================================

  const handleRemoveManager = async (
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


      if (
        error.response?.status === 401
      ) {

        logout();

        return;

      }


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to remove lorry manager."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <Container>


      {/* =================================================
          HEADER
      ================================================= */}

      <Header>

        <HeaderInner>


          {/* MENU BUTTON */}

          <MenuButton
            onClick={() =>
              setIsMenuOpen(true)
            }
            aria-label="Open navigation menu"
          >

            <Menu
              size={25}
              strokeWidth={2}
            />

          </MenuButton>


          {/* BRAND */}

          <Brand>

            <LogoContainer>

              <Logo
                src={rigLogo}
                alt="Sri Murugan Rig Service"
              />

            </LogoContainer>


            <BrandText>

              <CompanyName>
                Sri Murugan Rig Service
              </CompanyName>

              <Tagline>
                25 Years of Experience.
                Built on Trust. Driven by Service.
              </Tagline>

              <Established>
                Since 2001 — Reliability at Every Depth.
              </Established>

            </BrandText>

          </Brand>


          {/* USER */}

          <UserSection>

            <UserInfo>

              <UserName>
                {userName || "Owner"}
              </UserName>

              <UserRole>
                OWNER
              </UserRole>

            </UserInfo>

          </UserSection>

        </HeaderInner>

      </Header>


      {/* =================================================
          MENU OVERLAY
      ================================================= */}

      {isMenuOpen && (

        <MenuOverlay
          onClick={() =>
            setIsMenuOpen(false)
          }
        />

      )}


      {/* =================================================
          SIDE MENU
      ================================================= */}

      <SideMenu
        $open={isMenuOpen}
      >


        {/* MENU HEADER */}

        <SideMenuHeader>

          <SideBrand>

            <SideLogo
              src={rigLogo}
              alt="Sri Murugan Rig Service"
            />

            <SideBrandText>

              <SideCompanyName>
                Sri Murugan
              </SideCompanyName>

              <SideCompanySub>
                Rig Service
              </SideCompanySub>

            </SideBrandText>

          </SideBrand>


          <CloseButton
            onClick={() =>
              setIsMenuOpen(false)
            }
          >

            <X size={22} />

          </CloseButton>

        </SideMenuHeader>


        {/* USER */}

        <MenuUser>

          <MenuAvatar>

            {(userName || "O")
              .charAt(0)
              .toUpperCase()}

          </MenuAvatar>


          <div>

            <MenuUserName>
              {userName || "Owner"}
            </MenuUserName>

            <MenuUserRole>
              OWNER ACCOUNT
            </MenuUserRole>

          </div>

        </MenuUser>


        {/* NAVIGATION */}

        <NavigationMenu>


          <MenuSectionTitle>
            MANAGEMENT
          </MenuSectionTitle>


          {/* OVERVIEW */}

          <MenuItem
            onClick={() =>
              handleNavigation(
                "/owner"
              )
            }
          >

            <MenuIcon>
              <LayoutDashboard
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Overview
            </MenuItemText>

            <ChevronRight
              size={16}
              className="arrow"
            />

          </MenuItem>


          {/* RIG FLEET */}

          <MenuItem
            onClick={() =>
              handleNavigation(
                "/owner"
              )
            }
          >

            <MenuIcon>
              <Truck
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Rig Fleet
            </MenuItemText>

            <ChevronRight
              size={16}
              className="arrow"
            />

          </MenuItem>


          {/* EMPLOYEES */}

          <MenuItem
            onClick={
              handleEmployeesNavigation
            }
          >

            <MenuIcon>
              <Users
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Employees
            </MenuItemText>

            <ChevronRight
              size={16}
              className="arrow"
            />

          </MenuItem>


          {/* FUEL */}

          <MenuItem
            onClick={
              handleFuelNavigation
            }
          >

            <MenuIcon>
              <Fuel
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Fuel Management
            </MenuItemText>

            <ChevronRight
              size={16}
              className="arrow"
            />

          </MenuItem>


          {/* POINT DETAILS */}

          <MenuItem
            onClick={
              handlePointDetailsNavigation
            }
          >

            <MenuIcon>
              <MapPin
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Point Details
            </MenuItemText>

            <ChevronRight
              size={16}
              className="arrow"
            />

          </MenuItem>


          {/* MANAGERS */}

          <MenuItem
            onClick={() =>
              alert(
                "Lorry Managers page can be connected here."
              )
            }
          >

            <MenuIcon>
              <UserCog
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Lorry Managers
            </MenuItemText>

            <ChevronRight
              size={16}
              className="arrow"
            />

          </MenuItem>


          <MenuSectionTitle>
            BUSINESS
          </MenuSectionTitle>


          {/* REPORTS */}

          <MenuItem
            onClick={() =>
              alert(
                "Reports page can be connected here."
              )
            }
          >

            <MenuIcon>
              <BarChart3
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Reports
            </MenuItemText>

            <ChevronRight
              size={16}
              className="arrow"
            />

          </MenuItem>


          {/* SETTINGS */}

          <MenuItem
            onClick={() =>
              alert(
                "Settings page can be connected here."
              )
            }
          >

            <MenuIcon>
              <Settings
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Settings
            </MenuItemText>

            <ChevronRight
              size={16}
              className="arrow"
            />

          </MenuItem>

        </NavigationMenu>


        {/* MENU FOOTER */}

        <SideMenuFooter>

          <MenuLogout
            onClick={() => {

              setIsMenuOpen(false);

              logout();

            }}
          >

            <MenuIcon>
              <LogOut
                size={19}
              />
            </MenuIcon>

            <MenuItemText>
              Logout
            </MenuItemText>

          </MenuLogout>


          <MenuFooterText>

            Sri Murugan Rig Service
            <br />

            Since 2001

          </MenuFooterText>

        </SideMenuFooter>

      </SideMenu>


      {/* =================================================
          HERO
      ================================================= */}

      <HeroSection>

        <BackgroundWord>
          BOREWELL
        </BackgroundWord>

        <BackgroundWordTwo>
          DRILLING
        </BackgroundWordTwo>


        <HeroContent>

          <HeroEyebrow>
            BOREWELL & RIG DRILLING SERVICES
          </HeroEyebrow>


          <HeroTitle>

            Experience That Goes

            <br />

            <HeroAccent>
              Deeper.
            </HeroAccent>

          </HeroTitle>


          <HeroDescription>

            With more than 25 years of experience,
            Sri Murugan Rig Service delivers
            dependable drilling solutions built
            around precision, reliability and
            service.

          </HeroDescription>


          <HeroStats>


            <HeroStat>

              <HeroStatNumber>
                25+
              </HeroStatNumber>

              <HeroStatLabel>
                YEARS OF EXPERIENCE
              </HeroStatLabel>

            </HeroStat>


            <StatDivider />


            <HeroStat>

              <HeroStatNumber>
                3
              </HeroStatNumber>

              <HeroStatLabel>
                INDIAN STATES
              </HeroStatLabel>

            </HeroStat>


            <StatDivider />


            <HeroStat>

              <HeroStatNumber>
                2
              </HeroStatNumber>

              <HeroStatLabel>
                INTERNATIONAL MARKETS
              </HeroStatLabel>

            </HeroStat>

          </HeroStats>

        </HeroContent>


        <HeroVisual>

          <DrillingCircle>

            <DrillingInner>

              <DrillingIcon>
                ◉
              </DrillingIcon>

              <DrillingText>

                PRECISION
                <br />

                DRILLING

              </DrillingText>

            </DrillingInner>

          </DrillingCircle>

        </HeroVisual>

      </HeroSection>


      {/* =================================================
          REGIONS
      ================================================= */}

      <RegionBanner>

        <RegionHeader>

          <RegionEyebrow>
            OUR REACH
          </RegionEyebrow>

          <RegionTitle>

            Operating Across India.
            Expanding Beyond Borders.

          </RegionTitle>


          <RegionDescription>

            From established drilling operations
            across India to our growing
            international presence.

          </RegionDescription>

        </RegionHeader>


        <RegionGrid>


          <RegionCard>

            <RegionNumber>
              01
            </RegionNumber>

            <RegionIcon>
              🇮🇳
            </RegionIcon>

            <RegionName>
              Maharashtra
            </RegionName>

            <RegionStatus>
              ACTIVE OPERATIONS
            </RegionStatus>

          </RegionCard>


          <RegionCard>

            <RegionNumber>
              02
            </RegionNumber>

            <RegionIcon>
              🇮🇳
            </RegionIcon>

            <RegionName>
              Tamil Nadu
            </RegionName>

            <RegionStatus>
              HOME OPERATIONS
            </RegionStatus>

          </RegionCard>


          <RegionCard>

            <RegionNumber>
              03
            </RegionNumber>

            <RegionIcon>
              🇮🇳
            </RegionIcon>

            <RegionName>
              Madhya Pradesh
            </RegionName>

            <RegionStatus>
              ACTIVE OPERATIONS
            </RegionStatus>

          </RegionCard>


          <RegionCard $international>

            <RegionNumber>
              04
            </RegionNumber>

            <RegionIcon>
              🌍
            </RegionIcon>

            <RegionName>
              South Africa
            </RegionName>

            <RegionStatus>
              INTERNATIONAL
            </RegionStatus>

          </RegionCard>


          <RegionCard $international>

            <RegionNumber>
              05
            </RegionNumber>

            <RegionIcon>
              🌍
            </RegionIcon>

            <RegionName>
              Burkina Faso
            </RegionName>

            <RegionStatus>
              EXPANDING
            </RegionStatus>

          </RegionCard>

        </RegionGrid>


        <ExpansionLine>

          <ExpansionDot />

          <ExpansionText>

            Expanding our drilling expertise
            from India to international markets
            across Africa.

          </ExpansionText>

        </ExpansionLine>

      </RegionBanner>


      {/* =================================================
          MANAGEMENT HEADER
      ================================================= */}

      <ManagementHeader>

        <ManagementTitle>
          Rig Fleet Management
        </ManagementTitle>

        <ManagementDescription>
          Manage your drilling fleet,
          operators and rig assignments.
        </ManagementDescription>


        <AddLorryButton
          onClick={handleAddLorry}
        >

          {isFormVisible
            ? "✕  Close Form"
            : "+  Add New Lorry"}

        </AddLorryButton>

      </ManagementHeader>


      {/* =================================================
          ADD LORRY FORM
      ================================================= */}

      {isFormVisible && (

        <AddLorryForm
          onSubmit={handleSubmit}
        >

          <FormHeader>

            <FormIcon>
              🚛
            </FormIcon>


            <FormHeaderText>

              <FormTitle>
                Add New Lorry
              </FormTitle>

              <FormSubtitle>
                Enter the details of your drilling rig.
              </FormSubtitle>

            </FormHeaderText>

          </FormHeader>


          <FormGrid>


            <FormField>

              <FormLabel>
                Registration Number
              </FormLabel>

              <Input
                type="text"
                placeholder="TN 34 K 3749"
                value={
                  registrationNumber
                }
                onChange={(e) =>
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
                onChange={(e) =>
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
                placeholder="10 digit phone number"
                value={
                  ownerPhone
                }
                onChange={(e) =>
                  setOwnerPhone(
                    e.target.value
                  )
                }
                required
              />

            </FormField>


            <FormField>

              <FormLabel>
                Rig Model
              </FormLabel>

              <Input
                type="text"
                placeholder="Rig / drilling model"
                value={
                  model
                }
                onChange={(e) =>
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
                placeholder="2001"
                value={
                  yearBuilt
                }
                onChange={(e) =>
                  setYearBuilt(
                    e.target.value
                  )
                }
                required
              />

            </FormField>

          </FormGrid>


          <SubmitButton
            type="submit"
          >
            Add Lorry to Fleet
          </SubmitButton>

        </AddLorryForm>

      )}


      {/* =================================================
          FLEET
      ================================================= */}

      <LorrySection>

        <LorrySectionHeader>

          <div>

            <LorrySectionTitle>
              Your Rig Fleet
            </LorrySectionTitle>

            <LorrySectionDescription>
              Select a rig to open its management dashboard.
            </LorrySectionDescription>

          </div>


          <FleetCount>

            {lorries.length}

            {" "}

            {lorries.length === 1
              ? "RIG"
              : "RIGS"}

          </FleetCount>

        </LorrySectionHeader>


        <LorryList>


          {loading &&
          lorries.length === 0 ? (

            <LoadingText>
              Loading your rig fleet...
            </LoadingText>

          ) : lorries.length === 0 ? (

            <NoLorries>

              <NoLorriesIcon>
                🚛
              </NoLorriesIcon>

              <NoLorriesTitle>
                No Lorries Added
              </NoLorriesTitle>

              <NoLorriesText>

                Add your first drilling rig
                to begin managing your fleet.

              </NoLorriesText>

            </NoLorries>

          ) : (

            lorries.map(
              (lorry) => (

                <LorryCard
                  key={
                    lorry.id
                  }
                  $selected={
                    selectedLorryId ===
                    lorry.id
                  }
                >


                  {/* CARD CONTENT */}

                  <CardContent
                    onClick={() => {

                      handleSelectLorry(
                        lorry.id
                      );

                      handleLorryClick(
                        lorry.id
                      );

                    }}
                  >


                    <CardTop>

                      <RegistrationBadge>

                        {lorry.registration_number}

                      </RegistrationBadge>


                      <OwnerPhone>

                        {lorry.owner_phone ||
                          "Unknown Owner"}

                      </OwnerPhone>

                    </CardTop>


                    <ImageContainer>

                      <img
                        src={
                          LorryImage
                        }
                        alt="Sri Murugan drilling rig"
                      />


                      <ImageOverlay>

                        <ViewDashboard>

                          Open Dashboard →

                        </ViewDashboard>

                      </ImageOverlay>

                    </ImageContainer>


                    <Details>


                      <DetailRow>

                        <DetailLabel>
                          Owner
                        </DetailLabel>

                        <DetailValue>

                          {lorry.owner_name ||
                            "—"}

                        </DetailValue>

                      </DetailRow>


                      <DetailRow>

                        <DetailLabel>
                          Registration
                        </DetailLabel>

                        <DetailValue>

                          {lorry.registration_number ||
                            "—"}

                        </DetailValue>

                      </DetailRow>


                      <DetailRow>

                        <DetailLabel>
                          Model
                        </DetailLabel>

                        <DetailValue>

                          {lorry.model ||
                            "—"}

                        </DetailValue>

                      </DetailRow>


                      <DetailRow>

                        <DetailLabel>
                          Year Built
                        </DetailLabel>

                        <DetailValue>

                          {lorry.year_built ||
                            "—"}

                        </DetailValue>

                      </DetailRow>


                      <ManagerInfo>

                        <ManagerInfoTop>

                          <ManagerLabel>
                            Lorry Manager
                          </ManagerLabel>


                          <ManagerStatus>

                            {lorry.lorry_manager_name
                              ? "ASSIGNED"
                              : "NOT ASSIGNED"}

                          </ManagerStatus>

                        </ManagerInfoTop>


                        <ManagerValue>

                          {lorry.lorry_manager_name
                            ? `${lorry.lorry_manager_name} (${lorry.lorry_manager_phone})`
                            : "No manager assigned"}

                        </ManagerValue>

                      </ManagerInfo>

                    </Details>

                  </CardContent>


                  {/* MANAGER */}

                  <ManagerSection
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <ManagerSectionTitle>
                      Manager Assignment
                    </ManagerSectionTitle>


                    <ManagerSelect

                      value={
                        selectedManagers[
                          lorry.id
                        ] || ""
                      }

                      onChange={(e) =>
                        handleManagerChange(
                          lorry.id,
                          e.target.value
                        )
                      }

                    >

                      <option value="">
                        Select Lorry Manager
                      </option>


                      {managers.map(
                        (manager) => (

                          <option
                            key={
                              manager.id
                            }
                            value={
                              manager.id
                            }
                          >

                            {manager.name}
                            {" - "}
                            {manager.phone}

                          </option>

                        )
                      )}

                    </ManagerSelect>


                    <ManagerActions>

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
                        Assign Manager

                      </ManagerButton>


                      {lorry.lorry_manager_id && (

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
                          Remove
                        </RemoveManagerButton>

                      )}

                    </ManagerActions>

                  </ManagerSection>


                  {/* DELETE */}

                  <DeleteButton

                    onClick={(e) => {

                      e.stopPropagation();

                      handleDeleteLorry(
                        lorry.id,
                        lorry.registration_number
                      );

                    }}

                  >

                    Delete Lorry

                  </DeleteButton>

                </LorryCard>

              )
            )

          )}

        </LorryList>

      </LorrySection>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer>

        <FooterLogo>

          <Logo
            src={rigLogo}
            alt="Sri Murugan Rig Service"
          />

        </FooterLogo>


        <FooterCompany>
          Sri Murugan Rig Service
        </FooterCompany>


        <FooterTagline>

          25 Years of Experience.
          Built on Trust. Driven by Service.

        </FooterTagline>


        <FooterCopy>

          © {new Date().getFullYear()}
          {" "}
          Sri Murugan Rig Service.
          All rights reserved.

        </FooterCopy>

      </Footer>

    </Container>

  );

};


// =====================================================
// MAIN CONTAINER
// =====================================================

const Container = styled.div`

  min-height: 100vh;

  width: 100%;

  box-sizing: border-box;

  color: #0B263D;

  overflow-x: hidden;

  background:

    radial-gradient(
      circle at 0% 0%,
      rgba(
        0,
        120,
        184,
        0.08
      ),
      transparent 30%
    ),

    radial-gradient(
      circle at 100% 15%,
      rgba(
        98,
        197,
        28,
        0.06
      ),
      transparent 25%
    ),

    #F6F9FB;

`;


// =====================================================
// HEADER
// =====================================================

const Header = styled.header`

  position: sticky;

  top: 0;

  z-index: 100;

  width: 100%;

  background:
    rgba(
      255,
      255,
      255,
      0.94
    );

  backdrop-filter:
    blur(18px);

  -webkit-backdrop-filter:
    blur(18px);

  border-bottom:
    1px solid
    rgba(
      203,
      213,
      225,
      0.75
    );

  box-shadow:
    0 5px 25px
    rgba(
      15,
      23,
      42,
      0.04
    );

`;


// =====================================================
// HEADER INNER
// =====================================================

const HeaderInner = styled.div`

  width: 100%;

  max-width: 1450px;

  margin: 0 auto;

  padding:
    17px 45px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  gap: 20px;

  @media (max-width: 700px) {

    padding:
      14px 20px;

  }

`;


// =====================================================
// MENU BUTTON
// =====================================================

const MenuButton = styled.button`

  width: 46px;

  height: 46px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border:
    1px solid
    #DCE5EC;

  border-radius: 10px;

  background:
    #FFFFFF;

  color:
    #0B263D;

  cursor: pointer;

  transition:
    all 0.2s ease;

  &:hover {

    background:
      #F1F6F9;

    border-color:
      #C7D7E0;

    color:
      #0078B8;

    transform:
      translateY(-1px);

  }

`;


// =====================================================
// BRAND
// =====================================================

const Brand = styled.div`

  display: flex;

  align-items: center;

  gap: 17px;

  min-width: 0;

  flex: 1;

`;


// =====================================================
// LOGO CONTAINER
// =====================================================

const LogoContainer = styled.div`

  width: 76px;

  height: 58px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 11px;

  background:
    #FFFFFF;

  border:
    1px solid
    #DCE5EC;

  box-shadow:
    0 4px 12px
    rgba(
      15,
      23,
      42,
      0.05
    );

  @media (max-width: 550px) {

    width: 60px;

    height: 48px;

  }

`;


// =====================================================
// LOGO
// =====================================================

const Logo = styled.img`

  width: 100%;

  height: 100%;

  object-fit: contain;

  display: block;

`;


// =====================================================
// BRAND TEXT
// =====================================================

const BrandText = styled.div`

  min-width: 0;

`;


// =====================================================
// COMPANY NAME
// =====================================================

const CompanyName = styled.div`

  font-size: 22px;

  font-weight: 800;

  color:
    #0B263D;

  line-height: 1.2;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  @media (max-width: 700px) {

    font-size: 17px;

  }

  @media (max-width: 480px) {

    font-size: 14px;

  }

`;


// =====================================================
// TAGLINE
// =====================================================

const Tagline = styled.div`

  margin-top: 5px;

  font-size: 12px;

  font-weight: 700;

  color:
    #4E8F22;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  @media (max-width: 550px) {

    font-size: 9px;

  }

`;


// =====================================================
// ESTABLISHED
// =====================================================

const Established = styled.div`

  margin-top: 3px;

  font-size: 10px;

  color:
    #718096;

  @media (max-width: 550px) {

    display: none;

  }

`;


// =====================================================
// USER
// =====================================================

const UserSection = styled.div`

  display: flex;

  align-items: center;

  flex-shrink: 0;

`;


// =====================================================
// USER INFO
// =====================================================

const UserInfo = styled.div`

  text-align: right;

`;


// =====================================================
// USER NAME
// =====================================================

const UserName = styled.div`

  color:
    #0B263D;

  font-size: 14px;

  font-weight: 800;

  @media (max-width: 550px) {

    font-size: 11px;

  }

`;


// =====================================================
// USER ROLE
// =====================================================

const UserRole = styled.div`

  margin-top: 3px;

  color:
    #4E8F22;

  font-size: 8px;

  font-weight: 800;

  letter-spacing:
    1.2px;

`;


// =====================================================
// OVERLAY
// =====================================================

const MenuOverlay = styled.div`

  position: fixed;

  inset: 0;

  z-index: 999;

  background:
    rgba(
      5,
      20,
      30,
      0.42
    );

  backdrop-filter:
    blur(2px);

`;


// =====================================================
// SIDE MENU
// =====================================================

const SideMenu = styled.aside`

  position: fixed;

  top: 0;

  left: 0;

  z-index: 1000;

  width: 330px;

  max-width: 88vw;

  height: 100vh;

  display: flex;

  flex-direction: column;

  box-sizing: border-box;

  background:
    #FFFFFF;

  box-shadow:
    15px 0 50px
    rgba(
      15,
      23,
      42,
      0.15
    );

  transform:
    translateX(
      ${(props) =>
        props.$open
          ? "0"
          : "-105%"}
    );

  transition:
    transform 0.28s
    cubic-bezier(
      0.4,
      0,
      0.2,
      1
    );

`;


// =====================================================
// SIDE HEADER
// =====================================================

const SideMenuHeader = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    23px 22px;

  border-bottom:
    1px solid
    #E8EEF2;

`;


// =====================================================
// SIDE BRAND
// =====================================================

const SideBrand = styled.div`

  display: flex;

  align-items: center;

  gap: 12px;

`;


// =====================================================
// SIDE LOGO
// =====================================================

const SideLogo = styled.img`

  width: 50px;

  height: 42px;

  object-fit: contain;

  border-radius: 7px;

`;


// =====================================================
// SIDE BRAND TEXT
// =====================================================

const SideBrandText = styled.div``;


// =====================================================
// SIDE COMPANY NAME
// =====================================================

const SideCompanyName = styled.div`

  color:
    #0B263D;

  font-size: 15px;

  font-weight: 800;

`;


// =====================================================
// SIDE COMPANY SUB
// =====================================================

const SideCompanySub = styled.div`

  margin-top: 2px;

  color:
    #4E8F22;

  font-size: 10px;

  font-weight: 700;

  letter-spacing:
    0.7px;

`;


// =====================================================
// CLOSE
// =====================================================

const CloseButton = styled.button`

  width: 38px;

  height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: none;

  border-radius: 8px;

  background:
    #F4F7F9;

  color:
    #64748B;

  cursor: pointer;

  transition:
    all 0.2s ease;

  &:hover {

    background:
      #EAF0F3;

    color:
      #0B263D;

  }

`;


// =====================================================
// MENU USER
// =====================================================

const MenuUser = styled.div`

  display: flex;

  align-items: center;

  gap: 12px;

  margin:
    20px 18px;

  padding:
    14px;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #F3F8FB,
      #F8FBF5
    );

  border:
    1px solid
    #E2EBEF;

`;


// =====================================================
// AVATAR
// =====================================================

const MenuAvatar = styled.div`

  width: 40px;

  height: 40px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    #0B263D;

  color:
    #FFFFFF;

  font-size: 15px;

  font-weight: 800;

`;


// =====================================================
// MENU USER NAME
// =====================================================

const MenuUserName = styled.div`

  color:
    #0B263D;

  font-size: 13px;

  font-weight: 800;

`;


// =====================================================
// MENU USER ROLE
// =====================================================

const MenuUserRole = styled.div`

  margin-top: 3px;

  color:
    #4E8F22;

  font-size: 8px;

  font-weight: 800;

  letter-spacing:
    1px;

`;


// =====================================================
// NAVIGATION
// =====================================================

const NavigationMenu = styled.nav`

  flex: 1;

  overflow-y: auto;

  padding:
    0 12px;

`;


// =====================================================
// SECTION TITLE
// =====================================================

const MenuSectionTitle = styled.div`

  padding:
    12px 12px 7px;

  color:
    #A0AEB8;

  font-size: 8px;

  font-weight: 800;

  letter-spacing:
    1.5px;

`;


// =====================================================
// MENU ITEM
// =====================================================

const MenuItem = styled.button`

  width: 100%;

  display: flex;

  align-items: center;

  gap: 12px;

  padding:
    12px 13px;

  margin-bottom: 3px;

  border: none;

  border-radius: 9px;

  background:
    transparent;

  color:
    #526273;

  text-align: left;

  cursor: pointer;

  transition:
    all 0.18s ease;

  .arrow {

    margin-left: auto;

    opacity: 0;

    transition:
      opacity 0.18s ease;

  }

  &:hover {

    background:
      #F1F7FA;

    color:
      #0078B8;

  }

  &:hover .arrow {

    opacity: 1;

  }

`;


// =====================================================
// MENU ICON
// =====================================================

const MenuIcon = styled.span`

  width: 22px;

  height: 22px;

  display: flex;

  align-items: center;

  justify-content: center;

  color:
    #64748B;

`;


// =====================================================
// MENU ITEM TEXT
// =====================================================

const MenuItemText = styled.span`

  font-size: 12px;

  font-weight: 700;

`;


// =====================================================
// SIDE FOOTER
// =====================================================

const SideMenuFooter = styled.div`

  padding:
    15px 18px 22px;

  border-top:
    1px solid
    #E8EEF2;

`;


// =====================================================
// LOGOUT
// =====================================================

const MenuLogout = styled.button`

  width: 100%;

  display: flex;

  align-items: center;

  gap: 12px;

  padding:
    12px 13px;

  border:
    1px solid
    #F0DDDD;

  border-radius: 9px;

  background:
    #FFF8F8;

  color:
    #B42318;

  cursor: pointer;

  transition:
    all 0.2s ease;

  &:hover {

    background:
      #FEF0F0;

  }

  ${MenuIcon} {

    color:
      #B42318;

  }

`;


// =====================================================
// FOOTER TEXT
// =====================================================

const MenuFooterText = styled.div`

  margin-top: 15px;

  text-align: center;

  color:
    #A0AEB8;

  font-size: 8px;

  line-height: 1.6;

  letter-spacing:
    0.4px;

`;


// =====================================================
// HERO
// =====================================================

const HeroSection = styled.section`

  position: relative;

  width: calc(
    100% - 40px
  );

  max-width: 1450px;

  min-height: 430px;

  margin:
    35px auto 0;

  padding:
    65px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  overflow: hidden;

  border-radius: 25px;

  background:
    linear-gradient(
      120deg,
      #0B263D 0%,
      #103C59 55%,
      #075B7F 100%
    );

  box-shadow:
    0 18px 50px
    rgba(
      11,
      38,
      61,
      0.15
    );

  @media (max-width: 800px) {

    padding:
      45px 30px;

    min-height:
      500px;

  }

`;


// =====================================================
// HERO BACKGROUND
// =====================================================

const BackgroundWord = styled.div`

  position: absolute;

  right: -30px;

  top: -35px;

  font-size: 150px;

  font-weight: 900;

  letter-spacing:
    -8px;

  color:
    rgba(
      255,
      255,
      255,
      0.035
    );

  user-select: none;

  pointer-events: none;

`;


// =====================================================
// HERO BACKGROUND 2
// =====================================================

const BackgroundWordTwo = styled.div`

  position: absolute;

  right: 80px;

  bottom: -55px;

  font-size: 115px;

  font-weight: 900;

  letter-spacing:
    -5px;

  color:
    rgba(
      255,
      255,
      255,
      0.025
    );

  user-select: none;

  pointer-events: none;

`;


// =====================================================
// HERO CONTENT
// =====================================================

const HeroContent = styled.div`

  position: relative;

  z-index: 2;

  max-width: 720px;

`;


// =====================================================
// HERO EYEBROW
// =====================================================

const HeroEyebrow = styled.div`

  display: inline-flex;

  align-items: center;

  padding:
    8px 13px;

  border-radius:
    50px;

  background:
    rgba(
      98,
      197,
      28,
      0.13
    );

  border:
    1px solid
    rgba(
      98,
      197,
      28,
      0.2
    );

  color:
    #B7E88E;

  font-size: 10px;

  font-weight: 800;

  letter-spacing:
    1.5px;

`;


// =====================================================
// HERO TITLE
// =====================================================

const HeroTitle = styled.h1`

  margin:
    22px 0 0;

  font-size: 52px;

  line-height: 1.1;

  letter-spacing:
    -1.8px;

  font-weight: 800;

  color:
    #FFFFFF;

  @media (max-width: 800px) {

    font-size: 39px;

  }

`;


// =====================================================
// HERO ACCENT
// =====================================================

const HeroAccent = styled.span`

  color:
    #8ED34F;

`;


// =====================================================
// HERO DESCRIPTION
// =====================================================

const HeroDescription = styled.p`

  max-width: 650px;

  margin:
    18px 0 0;

  font-size: 15px;

  line-height: 1.75;

  color:
    rgba(
      255,
      255,
      255,
      0.73
    );

`;


// =====================================================
// HERO STATS
// =====================================================

const HeroStats = styled.div`

  display: flex;

  align-items: center;

  gap: 28px;

  margin-top:
    35px;

  @media (max-width: 600px) {

    gap: 15px;

  }

`;


// =====================================================
// HERO STAT
// =====================================================

const HeroStat = styled.div`

  display: flex;

  flex-direction: column;

`;


// =====================================================
// STAT NUMBER
// =====================================================

const HeroStatNumber = styled.div`

  font-size: 26px;

  font-weight: 800;

  color:
    #FFFFFF;

`;


// =====================================================
// STAT LABEL
// =====================================================

const HeroStatLabel = styled.div`

  margin-top: 4px;

  font-size: 8px;

  font-weight: 800;

  letter-spacing:
    1px;

  color:
    rgba(
      255,
      255,
      255,
      0.48
    );

`;


// =====================================================
// STAT DIVIDER
// =====================================================

const StatDivider = styled.div`

  width: 1px;

  height: 40px;

  background:
    rgba(
      255,
      255,
      255,
      0.16
    );

`;


// =====================================================
// HERO VISUAL
// =====================================================

const HeroVisual = styled.div`

  position: absolute;

  right: 90px;

  top: 50%;

  transform:
    translateY(-50%);

  @media (max-width: 1050px) {

    right: 30px;

    opacity: 0.4;

  }

  @media (max-width: 800px) {

    display: none;

  }

`;


// =====================================================
// DRILLING CIRCLE
// =====================================================

const DrillingCircle = styled.div`

  width: 270px;

  height: 270px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  border:
    1px solid
    rgba(
      142,
      211,
      79,
      0.25
    );

  background:
    radial-gradient(
      circle,
      rgba(
        98,
        197,
        28,
        0.1
      ),
      rgba(
        255,
        255,
        255,
        0.015
      )
    );

`;


// =====================================================
// DRILLING INNER
// =====================================================

const DrillingInner = styled.div`

  width: 185px;

  height: 185px;

  border-radius: 50%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  border:
    1px dashed
    rgba(
      142,
      211,
      79,
      0.25
    );

`;


// =====================================================
// DRILLING ICON
// =====================================================

const DrillingIcon = styled.div`

  font-size: 50px;

  color:
    #8ED34F;

`;


// =====================================================
// DRILLING TEXT
// =====================================================

const DrillingText = styled.div`

  margin-top: 8px;

  text-align: center;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 2px;

  line-height: 1.6;

  color:
    rgba(
      255,
      255,
      255,
      0.7
    );

`;


// =====================================================
// REGION BANNER
// =====================================================

const RegionBanner = styled.section`

  width: calc(
    100% - 40px
  );

  max-width: 1450px;

  margin:
    28px auto 0;

  padding:
    45px;

  box-sizing: border-box;

  border:
    1px solid
    #DCE7EE;

  border-radius: 22px;

  background:
    linear-gradient(
      135deg,
      #FFFFFF,
      #F7FBFD
    );

  box-shadow:
    0 10px 35px
    rgba(
      15,
      23,
      42,
      0.045
    );

  @media (max-width: 800px) {

    padding:
      30px 22px;

  }

`;


// =====================================================
// REGION HEADER
// =====================================================

const RegionHeader = styled.div`

  text-align: center;

  max-width: 750px;

  margin:
    0 auto 35px;

`;


// =====================================================
// REGION EYEBROW
// =====================================================

const RegionEyebrow = styled.div`

  color:
    #4E8F22;

  font-size: 10px;

  font-weight: 800;

  letter-spacing:
    2px;

`;


// =====================================================
// REGION TITLE
// =====================================================

const RegionTitle = styled.h2`

  margin:
    10px 0 8px;

  color:
    #0B263D;

  font-size: 31px;

  line-height: 1.25;

  font-weight: 800;

  @media (max-width: 700px) {

    font-size: 25px;

  }

`;


// =====================================================
// REGION DESCRIPTION
// =====================================================

const RegionDescription = styled.p`

  margin: 0;

  color:
    #718096;

  font-size: 14px;

  line-height: 1.6;

`;


// =====================================================
// REGION GRID
// =====================================================

const RegionGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(
      5,
      1fr
    );

  gap: 13px;

  @media (max-width: 1100px) {

    grid-template-columns:
      repeat(
        3,
        1fr
      );

  }

  @media (max-width: 650px) {

    grid-template-columns:
      repeat(
        2,
        1fr
      );

  }

  @media (max-width: 450px) {

    grid-template-columns:
      1fr;

  }

`;


// =====================================================
// REGION CARD
// =====================================================

const RegionCard = styled.div`

  position: relative;

  min-height: 160px;

  padding: 22px;

  box-sizing: border-box;

  border:
    1px solid
    ${(props) =>
      props.$international
        ? "#DCE7EE"
        : "#E1EBDD"};

  border-radius: 15px;

  background:
    ${(props) =>
      props.$international
        ? "linear-gradient(145deg, #F7FBFD, #FFFFFF)"
        : "linear-gradient(145deg, #F8FCF5, #FFFFFF)"};

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  overflow: hidden;

  &:hover {

    transform:
      translateY(-4px);

    box-shadow:
      0 10px 25px
      rgba(
        15,
        23,
        42,
        0.07
      );

  }

`;


// =====================================================
// REGION NUMBER
// =====================================================

const RegionNumber = styled.div`

  position: absolute;

  top: 13px;

  right: 15px;

  color:
    #CBD5DE;

  font-size: 10px;

  font-weight: 800;

`;


// =====================================================
// REGION ICON
// =====================================================

const RegionIcon = styled.div`

  font-size: 25px;

  margin-bottom: 14px;

`;


// =====================================================
// REGION NAME
// =====================================================

const RegionName = styled.div`

  color:
    #0B263D;

  font-size: 16px;

  font-weight: 800;

`;


// =====================================================
// REGION STATUS
// =====================================================

const RegionStatus = styled.div`

  margin-top: 8px;

  color:
    #718096;

  font-size: 8px;

  font-weight: 800;

  letter-spacing:
    1px;

`;


// =====================================================
// EXPANSION LINE
// =====================================================

const ExpansionLine = styled.div`

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin-top: 28px;

  padding-top: 22px;

  border-top:
    1px solid
    #E7EDF1;

`;


// =====================================================
// EXPANSION DOT
// =====================================================

const ExpansionDot = styled.span`

  width: 8px;

  height: 8px;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    #62C51C;

  box-shadow:
    0 0 0 4px
    rgba(
      98,
      197,
      28,
      0.1
    );

`;


// =====================================================
// EXPANSION TEXT
// =====================================================

const ExpansionText = styled.div`

  color:
    #526273;

  font-size: 12px;

  font-weight: 600;

  text-align: center;

`;


// =====================================================
// MANAGEMENT HEADER
// =====================================================

const ManagementHeader = styled.div`

  position: relative;

  width: calc(
    100% - 40px
  );

  max-width: 1360px;

  margin:
    55px auto 25px;

  padding: 0;

  box-sizing: border-box;

  @media (max-width: 800px) {

    padding: 0;

  }

`;


// =====================================================
// MANAGEMENT TITLE
// =====================================================

const ManagementTitle = styled.h2`

  margin: 0;

  color:
    #0B263D;

  font-size: 30px;

  font-weight: 800;

`;


// =====================================================
// MANAGEMENT DESCRIPTION
// =====================================================

const ManagementDescription = styled.p`

  margin:
    7px 0 0;

  color:
    #718096;

  font-size: 14px;

`;


// =====================================================
// ADD LORRY BUTTON
// =====================================================

const AddLorryButton = styled.button`

  position: absolute;

  right: 0;

  bottom: 0;

  padding:
    13px 21px;

  border: none;

  border-radius: 9px;

  background:
    #0078B8;

  color:
    #FFFFFF;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 5px 15px
    rgba(
      0,
      120,
      184,
      0.18
    );

  transition:
    all 0.2s ease;

  &:hover {

    background:
      #006A9F;

    transform:
      translateY(-2px);

  }

  @media (max-width: 650px) {

    position: static;

    margin-top: 18px;

  }

`;


// =====================================================
// ADD FORM
// =====================================================

const AddLorryForm = styled.form`

  width: calc(
    100% - 40px
  );

  max-width: 1360px;

  margin:
    0 auto 30px;

  padding:
    30px;

  box-sizing: border-box;

  border:
    1px solid
    #DCE7EE;

  border-radius: 18px;

  background:
    #FFFFFF;

  box-shadow:
    0 10px 30px
    rgba(
      15,
      23,
      42,
      0.05
    );

`;


// =====================================================
// FORM HEADER
// =====================================================

const FormHeader = styled.div`

  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 25px;

`;


// =====================================================
// FORM ICON
// =====================================================

const FormIcon = styled.div`

  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background:
    #EDF7E8;

  font-size: 23px;

`;


// =====================================================
// FORM HEADER TEXT
// =====================================================

const FormHeaderText = styled.div``;


// =====================================================
// FORM TITLE
// =====================================================

const FormTitle = styled.div`

  font-size: 18px;

  font-weight: 800;

  color:
    #0B263D;

`;


// =====================================================
// FORM SUBTITLE
// =====================================================

const FormSubtitle = styled.div`

  margin-top: 3px;

  font-size: 11px;

  color:
    #718096;

`;


// =====================================================
// FORM GRID
// =====================================================

const FormGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(
      5,
      1fr
    );

  gap: 15px;

  @media (max-width: 1000px) {

    grid-template-columns:
      repeat(
        2,
        1fr
      );

  }

  @media (max-width: 600px) {

    grid-template-columns:
      1fr;

  }

`;


// =====================================================
// FORM FIELD
// =====================================================

const FormField = styled.div`

  display: flex;

  flex-direction: column;

`;


// =====================================================
// FORM LABEL
// =====================================================

const FormLabel = styled.label`

  margin-bottom: 7px;

  color:
    #526273;

  font-size: 10px;

  font-weight: 800;

  letter-spacing:
    0.5px;

`;


// =====================================================
// INPUT
// =====================================================

const Input = styled.input`

  width: 100%;

  padding:
    13px 14px;

  box-sizing: border-box;

  border:
    1px solid
    #D9E2E9;

  border-radius: 8px;

  outline: none;

  background:
    #FBFCFD;

  color:
    #0B263D;

  font-size: 13px;

  transition:
    all 0.2s ease;

  &:focus {

    border-color:
      #0078B8;

    background:
      #FFFFFF;

    box-shadow:
      0 0 0 3px
      rgba(
        0,
        120,
        184,
        0.08
      );

  }

`;


// =====================================================
// SUBMIT
// =====================================================

const SubmitButton = styled.button`

  margin-top: 22px;

  padding:
    13px 22px;

  border: none;

  border-radius: 8px;

  background:
    #62A52D;

  color:
    #FFFFFF;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

  transition:
    all 0.2s ease;

  &:hover {

    background:
      #548F26;

    transform:
      translateY(-1px);

  }

`;


// =====================================================
// LORRY SECTION
// =====================================================

const LorrySection = styled.section`

  width: calc(
    100% - 40px
  );

  max-width: 1360px;

  margin:
    0 auto;

  padding:
    0 0 60px;

  box-sizing: border-box;

`;


// =====================================================
// SECTION HEADER
// =====================================================

const LorrySectionHeader = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 25px;

`;


// =====================================================
// SECTION TITLE
// =====================================================

const LorrySectionTitle = styled.h2`

  margin: 0;

  color:
    #0B263D;

  font-size: 25px;

  font-weight: 800;

`;


// =====================================================
// SECTION DESCRIPTION
// =====================================================

const LorrySectionDescription = styled.p`

  margin:
    6px 0 0;

  color:
    #718096;

  font-size: 12px;

`;


// =====================================================
// FLEET COUNT
// =====================================================

const FleetCount = styled.div`

  padding:
    8px 12px;

  border-radius: 7px;

  background:
    #EDF6FA;

  color:
    #0078B8;

  font-size: 10px;

  font-weight: 800;

  letter-spacing:
    1px;

`;


// =====================================================
// LORRY LIST
// =====================================================

const LorryList = styled.div`

  display: grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap: 25px;

  @media (max-width: 1100px) {

    grid-template-columns:
      repeat(
        2,
        1fr
      );

  }

  @media (max-width: 700px) {

    grid-template-columns:
      1fr;

  }

`;


// =====================================================
// LORRY CARD
// =====================================================

const LorryCard = styled.div`

  position: relative;

  overflow: hidden;

  border:
    1px solid
    ${(props) =>
      props.$selected
        ? "#9BC7DD"
        : "#DCE5EC"};

  border-radius: 18px;

  background:
    #FFFFFF;

  box-shadow:
    ${(props) =>
      props.$selected
        ? "0 12px 35px rgba(0, 120, 184, 0.12)"
        : "0 8px 28px rgba(15, 23, 42, 0.055)"};

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  &:hover {

    transform:
      translateY(-5px);

    box-shadow:
      0 18px 40px
      rgba(
        15,
        23,
        42,
        0.09
      );

  }

`;


// =====================================================
// CARD CONTENT
// =====================================================

const CardContent = styled.div`

  text-align: left;

  cursor: pointer;

`;


// =====================================================
// CARD TOP
// =====================================================

const CardTop = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    20px 20px 14px;

`;


// =====================================================
// REGISTRATION
// =====================================================

const RegistrationBadge = styled.div`

  padding:
    8px 11px;

  border-radius: 7px;

  background:
    #EEF7EA;

  color:
    #4E8F22;

  font-size: 12px;

  font-weight: 800;

`;


// =====================================================
// OWNER PHONE
// =====================================================

const OwnerPhone = styled.div`

  color:
    #0078B8;

  font-size: 11px;

  font-weight: 700;

`;


// =====================================================
// IMAGE
// =====================================================

const ImageContainer = styled.div`

  position: relative;

  width: 100%;

  height: 240px;

  overflow: hidden;

  background:
    #E9EFF3;

  img {

    width: 100%;

    height: 100%;

    object-fit: cover;

    display: block;

    transition:
      transform 0.35s ease;

  }

  ${LorryCard}:hover img {

    transform:
      scale(1.035);

  }

`;


// =====================================================
// IMAGE OVERLAY
// =====================================================

const ImageOverlay = styled.div`

  position: absolute;

  left: 0;

  right: 0;

  bottom: 0;

  padding:
    45px 18px 16px;

  background:
    linear-gradient(
      transparent,
      rgba(
        5,
        25,
        38,
        0.78
      )
    );

  opacity: 0;

  transition:
    opacity 0.25s ease;

  ${LorryCard}:hover & {

    opacity: 1;

  }

`;


// =====================================================
// VIEW DASHBOARD
// =====================================================

const ViewDashboard = styled.div`

  color:
    #FFFFFF;

  font-size: 12px;

  font-weight: 800;

`;


// =====================================================
// DETAILS
// =====================================================

const Details = styled.div`

  padding:
    18px 20px 20px;

`;


// =====================================================
// DETAIL ROW
// =====================================================

const DetailRow = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding:
    8px 0;

  border-bottom:
    1px solid
    #F0F3F5;

`;


// =====================================================
// DETAIL LABEL
// =====================================================

const DetailLabel = styled.span`

  color:
    #94A3B8;

  font-size: 10px;

  font-weight: 700;

`;


// =====================================================
// DETAIL VALUE
// =====================================================

const DetailValue = styled.span`

  color:
    #334155;

  font-size: 12px;

  font-weight: 700;

  text-align: right;

`;


// =====================================================
// MANAGER INFO
// =====================================================

const ManagerInfo = styled.div`

  margin-top: 13px;

  padding:
    13px;

  border-radius: 9px;

  background:
    #F8FAFB;

  border:
    1px solid
    #EDF1F4;

`;


// =====================================================
// MANAGER INFO TOP
// =====================================================

const ManagerInfoTop = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

`;


// =====================================================
// MANAGER LABEL
// =====================================================

const ManagerLabel = styled.div`

  color:
    #64748B;

  font-size: 9px;

  font-weight: 800;

  text-transform:
    uppercase;

  letter-spacing:
    0.7px;

`;


// =====================================================
// MANAGER STATUS
// =====================================================

const ManagerStatus = styled.div`

  color:
    #4E8F22;

  font-size: 8px;

  font-weight: 800;

`;


// =====================================================
// MANAGER VALUE
// =====================================================

const ManagerValue = styled.div`

  margin-top: 7px;

  color:
    #334155;

  font-size: 11px;

  font-weight: 600;

  line-height: 1.5;

`;


// =====================================================
// MANAGER SECTION
// =====================================================

const ManagerSection = styled.div`

  margin:
    0 20px;

  padding:
    18px 0;

  border-top:
    1px solid
    #E9EEF2;

`;


// =====================================================
// MANAGER SECTION TITLE
// =====================================================

const ManagerSectionTitle = styled.div`

  margin-bottom: 9px;

  color:
    #64748B;

  font-size: 9px;

  font-weight: 800;

  letter-spacing:
    0.8px;

  text-transform:
    uppercase;

`;


// =====================================================
// MANAGER SELECT
// =====================================================

const ManagerSelect = styled.select`

  width: 100%;

  padding:
    12px;

  box-sizing: border-box;

  border:
    1px solid
    #D9E2E9;

  border-radius: 8px;

  outline: none;

  background:
    #FBFCFD;

  color:
    #334155;

  font-size: 12px;

  cursor: pointer;

  &:focus {

    border-color:
      #0078B8;

  }

`;


// =====================================================
// MANAGER ACTIONS
// =====================================================

const ManagerActions = styled.div`

  display: flex;

  gap: 8px;

  margin-top: 9px;

`;


// =====================================================
// MANAGER BUTTON
// =====================================================

const ManagerButton = styled.button`

  flex: 1;

  padding:
    10px;

  border: none;

  border-radius: 7px;

  background:
    #0078B8;

  color:
    #FFFFFF;

  font-size: 10px;

  font-weight: 800;

  cursor: pointer;

  &:hover {

    background:
      #006A9F;

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

  padding:
    10px 13px;

  border:
    1px solid
    #E6D8D8;

  border-radius: 7px;

  background:
    #FFF8F8;

  color:
    #B42318;

  font-size: 10px;

  font-weight: 800;

  cursor: pointer;

  &:hover {

    background:
      #FEF0F0;

  }

  &:disabled {

    opacity:
      0.55;

    cursor:
      not-allowed;

  }

`;


// =====================================================
// DELETE
// =====================================================

const DeleteButton = styled.button`

  display: block;

  width:
    calc(
      100% - 40px
    );

  margin:
    0 20px 20px;

  padding:
    10px;

  border:
    1px solid
    #E9D4D4;

  border-radius: 7px;

  background:
    transparent;

  color:
    #B42318;

  font-size: 10px;

  font-weight: 700;

  cursor: pointer;

  transition:
    all 0.2s ease;

  &:hover {

    background:
      #FFF5F5;

    border-color:
      #D9AAAA;

  }

`;


// =====================================================
// LOADING
// =====================================================

const LoadingText = styled.div`

  grid-column:
    1 / -1;

  padding:
    70px 20px;

  text-align: center;

  color:
    #64748B;

  font-size: 15px;

`;


// =====================================================
// NO LORRIES
// =====================================================

const NoLorries = styled.div`

  grid-column:
    1 / -1;

  padding:
    65px 20px;

  text-align: center;

  border:
    1px dashed
    #CBD8E0;

  border-radius: 16px;

  background:
    rgba(
      255,
      255,
      255,
      0.7
    );

`;


// =====================================================
// NO LORRIES ICON
// =====================================================

const NoLorriesIcon = styled.div`

  font-size: 45px;

  opacity:
    0.65;

`;


// =====================================================
// NO LORRIES TITLE
// =====================================================

const NoLorriesTitle = styled.div`

  margin-top: 15px;

  color:
    #334155;

  font-size: 18px;

  font-weight: 800;

`;


// =====================================================
// NO LORRIES TEXT
// =====================================================

const NoLorriesText = styled.div`

  margin-top: 6px;

  color:
    #718096;

  font-size: 12px;

`;


// =====================================================
// FOOTER
// =====================================================

const Footer = styled.footer`

  width: 100%;

  padding:
    45px 20px 35px;

  box-sizing: border-box;

  text-align: center;

  border-top:
    1px solid
    #E3EAF0;

  background:
    #F1F5F8;

`;


// =====================================================
// FOOTER LOGO
// =====================================================

const FooterLogo = styled.div`

  width: 65px;

  height: 48px;

  margin:
    0 auto 12px;

  overflow: hidden;

  border-radius: 8px;

  background:
    #FFFFFF;

`;


// =====================================================
// FOOTER COMPANY
// =====================================================

const FooterCompany = styled.div`

  color:
    #0B263D;

  font-size: 15px;

  font-weight: 800;

`;


// =====================================================
// FOOTER TAGLINE
// =====================================================

const FooterTagline = styled.div`

  margin-top: 5px;

  color:
    #4E8F22;

  font-size: 10px;

  font-weight: 600;

`;


// =====================================================
// FOOTER COPY
// =====================================================

const FooterCopy = styled.div`

  margin-top: 15px;

  color:
    #94A3B8;

  font-size: 9px;

`;


// =====================================================
// EXPORT
// =====================================================

export default OwnerPage;