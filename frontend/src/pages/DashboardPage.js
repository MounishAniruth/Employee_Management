import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import styled from "styled-components";
import rigLogo from "../assets/images/rig_logo.jpg";

// =====================================================
// DASHBOARD PAGE
// =====================================================

const DashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lorry, setLorry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // FETCH LORRY DETAILS
  // =====================================================

  useEffect(() => {
    const fetchLorry = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/lorry/${id}`);

        setLorry(response.data);
      } catch (err) {
        console.error("Error fetching lorry details:", err);

        setError(
          "Unable to load rig details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLorry();
  }, [id]);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleEmployeePage = () => {
    setMenuOpen(false);
    navigate(`/employee/${id}`);
  };

  const handleFuelPage = () => {
    setMenuOpen(false);
    navigate(`/fuel/${id}`);
  };

  const handlePointDetailsPage = () => {
    setMenuOpen(false);
    navigate(`/point-details/${id}`);
  };

  const handleDocumentsPage = () => {
    setMenuOpen(false);
    navigate(`/documents/${id}`);
  };

  const handleOwnerPage = () => {
    setMenuOpen(false);
    navigate("/owner");
  };

  const handleBack = () => {
    navigate(-1);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setMenuOpen(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");

    navigate("/login");
  };

  // =====================================================
  // CLOSE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
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
          Loading rig details...
        </LoadingText>

        <LoadingSpinner />

      </LoadingContainer>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !lorry) {
    return (
      <ErrorContainer>

        <ErrorCard>

          <ErrorIcon>
            !
          </ErrorIcon>

          <ErrorTitle>
            Unable to Load Details
          </ErrorTitle>

          <ErrorText>
            {error ||
              "Rig details could not be found."}
          </ErrorText>

          <BackButton onClick={handleBack}>
            ← Go Back
          </BackButton>

        </ErrorCard>

      </ErrorContainer>
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
        <SidebarOverlay onClick={closeMenu} />
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

          <CloseButton onClick={closeMenu}>
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
            {lorry.registration_number}
          </CurrentRigNumber>

          <CurrentRigStatus>
            <SmallStatusDot />
            Active
          </CurrentRigStatus>

        </CurrentRig>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <MenuSection>

          <MenuSectionTitle>
            MANAGEMENT
          </MenuSectionTitle>


          <MenuItem
            onClick={() => {
              setMenuOpen(false);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            $active
          >

            <MenuIcon>
              ◈
            </MenuIcon>

            <MenuText>
              Rig Overview
            </MenuText>

          </MenuItem>


          <MenuItem onClick={handleEmployeePage}>

            <MenuIcon>
              👷
            </MenuIcon>

            <MenuText>
              Employees
            </MenuText>

          </MenuItem>


          <MenuItem onClick={handleFuelPage}>

            <MenuIcon>
              ⛽
            </MenuIcon>

            <MenuText>
              Fuel Management
            </MenuText>

          </MenuItem>


          <MenuItem onClick={handlePointDetailsPage}>

            <MenuIcon>
              📍
            </MenuIcon>

            <MenuText>
              Point Details
            </MenuText>

          </MenuItem>


          <MenuItem onClick={handleDocumentsPage}>

            <MenuIcon>
              📄
            </MenuIcon>

            <MenuText>
              Documents
            </MenuText>

          </MenuItem>

        </MenuSection>


        <MenuSection>

          <MenuSectionTitle>
            BUSINESS
          </MenuSectionTitle>


          <MenuItem onClick={handleOwnerPage}>

            <MenuIcon>
              ◫
            </MenuIcon>

            <MenuText>
              Rig Fleet
            </MenuText>

          </MenuItem>


          <MenuItem
            onClick={() => {
              setMenuOpen(false);
              alert(
                "Reports section will be available soon."
              );
            }}
          >

            <MenuIcon>
              ▥
            </MenuIcon>

            <MenuText>
              Reports
            </MenuText>

            <ComingSoon>
              Soon
            </ComingSoon>

          </MenuItem>


          <MenuItem
            onClick={() => {
              setMenuOpen(false);
              alert(
                "Settings section will be available soon."
              );
            }}
          >

            <MenuIcon>
              ⚙
            </MenuIcon>

            <MenuText>
              Settings
            </MenuText>

          </MenuItem>

        </MenuSection>


        <SidebarBottom>

          <SidebarBackButton
            onClick={() => {
              setMenuOpen(false);
              handleBack();
            }}
          >
            <span>
              ←
            </span>

            Back
          </SidebarBackButton>


          <LogoutButton onClick={handleLogout}>

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

            {/* HAMBURGER */}

            <MenuButton
              onClick={() =>
                setMenuOpen(true)
              }
              aria-label="Open menu"
            >

              <HamburgerLine />
              <HamburgerLine />
              <HamburgerLine />

            </MenuButton>


            {/* BRAND */}

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


          {/* HEADER RIG */}

          <HeaderRig>

            <HeaderRigLabel>
              CURRENT RIG
            </HeaderRigLabel>

            <HeaderRigNumber>
              {lorry.registration_number}
            </HeaderRigNumber>

          </HeaderRig>

        </HeaderInner>

      </Header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <MainContent>

        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <PageHeading>

          <Eyebrow>
            RIG MANAGEMENT
          </Eyebrow>

          <PageTitle>
            Rig Dashboard
          </PageTitle>

          <PageSubtitle>
            Manage operations, employees, fuel
            and drilling information for your rig.
          </PageSubtitle>

        </PageHeading>


        {/* =================================================
            RIG INFORMATION CARD
        ================================================= */}

        <LorryCard>

          <LorryVisual>

            <RigIcon>
              🚛
            </RigIcon>

          </LorryVisual>


          <LorryMain>

            <LorryLabel>
              REGISTRATION NUMBER
            </LorryLabel>

            <RegistrationNumber>
              {lorry.registration_number}
            </RegistrationNumber>

            <LorryStatus>

              <StatusDot />

              Active Rig

            </LorryStatus>

          </LorryMain>


          <OwnerDetails>

            <OwnerItem>

              <OwnerLabel>
                OWNER
              </OwnerLabel>

              <OwnerValue>
                {lorry.owner_name || "—"}
              </OwnerValue>

            </OwnerItem>


            <OwnerDivider />


            <OwnerItem>

              <OwnerLabel>
                CONTACT
              </OwnerLabel>

              <OwnerValue>
                {lorry.owner_phone || "—"}
              </OwnerValue>

            </OwnerItem>

          </OwnerDetails>

        </LorryCard>


        {/* =================================================
            MANAGEMENT
        ================================================= */}

        <SectionHeader>

          <SectionTitle>
            Operations
          </SectionTitle>

          <SectionDescription>
            Select an area to manage this rig.
          </SectionDescription>

        </SectionHeader>


        <ManagementGrid>

          {/* =================================================
              EMPLOYEES
          ================================================= */}

          <ManagementCard
            type="button"
            onClick={handleEmployeePage}
          >

            <CardTop>

              <CardIcon $type="employee">
                👷
              </CardIcon>

              <CardArrow>
                →
              </CardArrow>

            </CardTop>


            <CardTitle>
              Employees
            </CardTitle>

            <CardDescription>
              Manage drivers, drillers,
              managers and workers assigned
              to this rig.
            </CardDescription>

            <CardAction>
              Manage Employees
              <span>
                →
              </span>
            </CardAction>

          </ManagementCard>


          {/* =================================================
              FUEL
          ================================================= */}

          <ManagementCard
            type="button"
            onClick={handleFuelPage}
          >

            <CardTop>

              <CardIcon $type="fuel">
                ⛽
              </CardIcon>

              <CardArrow>
                →
              </CardArrow>

            </CardTop>


            <CardTitle>
              Fuel
            </CardTitle>

            <CardDescription>
              Track fuel usage, fuel entries
              and related records for
              this rig.
            </CardDescription>

            <CardAction>
              Manage Fuel
              <span>
                →
              </span>
            </CardAction>

          </ManagementCard>


          {/* =================================================
              POINT DETAILS
          ================================================= */}

          <ManagementCard
            type="button"
            onClick={handlePointDetailsPage}
          >

            <CardTop>

              <CardIcon $type="points">
                📍
              </CardIcon>

              <CardArrow>
                →
              </CardArrow>

            </CardTop>


            <CardTitle>
              Point Details
            </CardTitle>

            <CardDescription>
              View and manage drilling
              points and project-related
              information.
            </CardDescription>

            <CardAction>
              View Point Details
              <span>
                →
              </span>
            </CardAction>

          </ManagementCard>


          {/* =================================================
              DOCUMENTS
          ================================================= */}

          <ManagementCard
            type="button"
            onClick={handleDocumentsPage}
          >

            <CardTop>

              <CardIcon $type="documents">
                📄
              </CardIcon>

              <CardArrow>
                →
              </CardArrow>

            </CardTop>


            <CardTitle>
              Documents
            </CardTitle>

            <CardDescription>
              View and manage lorry documents
              like RC Book, Insurance, etc.
            </CardDescription>

            <CardAction>
              View Documents
              <span>
                →
              </span>
            </CardAction>

          </ManagementCard>

        </ManagementGrid>


        {/* =================================================
            OPERATIONS INFORMATION
        ================================================= */}

        <InfoSection>

          <InfoHeader>

            <InfoIcon>
              ◉
            </InfoIcon>

            <div>

              <InfoTitle>
                Drilling Operations
              </InfoTitle>

              <InfoSubtitle>
                Reliable equipment. Experienced teams.
              </InfoSubtitle>

            </div>

          </InfoHeader>


          <InfoText>
            Sri Murugan Rig Service has been serving
            the drilling industry since 2001, delivering
            dependable rig operations with experienced
            manpower and a strong focus on service,
            safety and reliability.
          </InfoText>


          <InfoStats>

            <InfoStat>

              <InfoStatNumber>
                25+
              </InfoStatNumber>

              <InfoStatLabel>
                YEARS EXPERIENCE
              </InfoStatLabel>

            </InfoStat>


            <InfoStatDivider />


            <InfoStat>

              <InfoStatNumber>
                2001
              </InfoStatNumber>

              <InfoStatLabel>
                ESTABLISHED
              </InfoStatLabel>

            </InfoStat>


            <InfoStatDivider />


            <InfoStat>

              <InfoStatNumber>
                24/7
              </InfoStatNumber>

              <InfoStatLabel>
                SERVICE FOCUS
              </InfoStatLabel>

            </InfoStat>

          </InfoStats>

        </InfoSection>


        {/* =================================================
            COMPANY MESSAGE
        ================================================= */}

        <CompanyMessage>

          <MessageAccent />

          <MessageContent>

            <MessageTitle>
              25 Years of Experience.
              Built on Trust. Driven by Service.
            </MessageTitle>

            <MessageSubtitle>
              Since 2001 — Reliability at Every Depth.
            </MessageSubtitle>

          </MessageContent>


          <EstablishedBadge>
            EST. 2001
          </EstablishedBadge>

        </CompanyMessage>

      </MainContent>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer>
        © {new Date().getFullYear()} Sri Murugan Rig Service
      </Footer>

    </PageContainer>
  );
};


// =====================================================
// PAGE CONTAINER
// =====================================================

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;

  color: #0b263d;

  background:
    radial-gradient(
      circle at 0% 0%,
      rgba(0, 120, 184, 0.08),
      transparent 30%
    ),
    radial-gradient(
      circle at 100% 15%,
      rgba(98, 197, 28, 0.07),
      transparent 28%
    ),
    radial-gradient(
      circle at 70% 100%,
      rgba(0, 120, 184, 0.05),
      transparent 32%
    ),
    #f7f9fb;

  &::before {
    content: "";
    position: fixed;

    width: 450px;
    height: 450px;

    top: 35%;
    left: -260px;

    border-radius: 50%;

    background:
      rgba(98, 197, 28, 0.035);

    filter: blur(20px);

    pointer-events: none;
    z-index: 0;
  }
`;


// =====================================================
// SIDEBAR OVERLAY
// =====================================================

const SidebarOverlay = styled.div`
  position: fixed;

  inset: 0;

  background:
    rgba(8, 25, 40, 0.42);

  backdrop-filter: blur(3px);

  z-index: 998;

  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;


// =====================================================
// SIDEBAR
// =====================================================

const Sidebar = styled.aside`
  position: fixed;

  top: 0;
  left: 0;

  width: 320px;
  height: 100vh;

  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #f8fbfd 100%
    );

  border-right:
    1px solid #e1e8ee;

  box-shadow:
    12px 0 40px
    rgba(15, 23, 42, 0.10);

  z-index: 999;

  display: flex;
  flex-direction: column;

  box-sizing: border-box;

  transform:
    translateX(
      ${(props) =>
        props.$open ? "0" : "-105%"}
    );

  transition:
    transform 0.3s
    cubic-bezier(
      0.22,
      1,
      0.36,
      1
    );

  @media (max-width: 500px) {
    width: 88%;
    max-width: 330px;
  }
`;


// =====================================================
// SIDEBAR HEADER
// =====================================================

const SidebarHeader = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  padding: 24px 22px 20px;
`;


// =====================================================
// SIDEBAR BRAND
// =====================================================

const SidebarBrand = styled.div`
  display: flex;

  align-items: center;

  gap: 12px;
`;


// =====================================================
// SIDEBAR LOGO
// =====================================================

const SidebarLogo = styled.div`
  width: 58px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  overflow: hidden;

  background: #ffffff;

  border:
    1px solid #dfe7ed;

  box-shadow:
    0 4px 12px
    rgba(15, 23, 42, 0.05);
`;


// =====================================================
// SIDEBAR BRAND TEXT
// =====================================================

const SidebarBrandText = styled.div`
  display: flex;

  flex-direction: column;
`;


// =====================================================
// SIDEBAR COMPANY
// =====================================================

const SidebarCompany = styled.div`
  color: #0b263d;

  font-size: 17px;

  font-weight: 800;
`;


// =====================================================
// SIDEBAR SERVICE
// =====================================================

const SidebarService = styled.div`
  margin-top: 3px;

  color: #0078b8;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 2px;
`;


// =====================================================
// CLOSE BUTTON
// =====================================================

const CloseButton = styled.button`
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 10px;

  background: #f2f5f7;

  color: #536574;

  font-size: 26px;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #e8f2f7;
    color: #0078b8;
  }
`;


// =====================================================
// SIDEBAR DIVIDER
// =====================================================

const SidebarDivider = styled.div`
  height: 1px;

  margin: 0 22px;

  background: #e5ebef;
`;


// =====================================================
// CURRENT RIG
// =====================================================

const CurrentRig = styled.div`
  margin: 20px 18px;

  padding: 17px;

  border-radius: 13px;

  background:
    linear-gradient(
      135deg,
      #f1f8ec,
      #f8fbf6
    );

  border:
    1px solid #dcebd3;
`;


// =====================================================
// CURRENT RIG LABEL
// =====================================================

const CurrentRigLabel = styled.div`
  color: #84919d;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.4px;
`;


// =====================================================
// CURRENT RIG NUMBER
// =====================================================

const CurrentRigNumber = styled.div`
  margin-top: 7px;

  color: #0b263d;

  font-size: 21px;

  font-weight: 800;
`;


// =====================================================
// CURRENT RIG STATUS
// =====================================================

const CurrentRigStatus = styled.div`
  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 7px;

  color: #4e8f22;

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

  background: #62c51c;

  box-shadow:
    0 0 0 3px
    rgba(98, 197, 28, 0.12);
`;


// =====================================================
// MENU SECTION
// =====================================================

const MenuSection = styled.div`
  padding: 4px 12px;
`;


// =====================================================
// MENU SECTION TITLE
// =====================================================

const MenuSectionTitle = styled.div`
  padding:
    11px 12px 8px;

  color: #9aa7b4;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.5px;
`;


// =====================================================
// MENU ITEM
// =====================================================

const MenuItem = styled.button`
  width: 100%;

  display: flex;

  align-items: center;

  gap: 13px;

  padding:
    12px 13px;

  margin-bottom: 3px;

  border: none;

  border-radius: 10px;

  background:
    ${(props) =>
      props.$active
        ? "#edf7e8"
        : "transparent"};

  color:
    ${(props) =>
      props.$active
        ? "#4e8f22"
        : "#435466"};

  font-size: 13px;

  font-weight:
    ${(props) =>
      props.$active ? "750" : "600"};

  text-align: left;

  cursor: pointer;

  transition:
    all 0.2s ease;

  &:hover {
    background: #f0f6f9;

    color: #0078b8;

    transform:
      translateX(2px);
  }
`;


// =====================================================
// MENU ICON
// =====================================================

const MenuIcon = styled.span`
  width: 25px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 17px;
`;


// =====================================================
// MENU TEXT
// =====================================================

const MenuText = styled.span`
  flex: 1;
`;


// =====================================================
// COMING SOON
// =====================================================

const ComingSoon = styled.span`
  padding:
    3px 7px;

  border-radius: 5px;

  background: #f1f4f6;

  color: #9aa7b4;

  font-size: 8px;

  font-weight: 800;

  text-transform: uppercase;
`;


// =====================================================
// SIDEBAR BOTTOM
// =====================================================

const SidebarBottom = styled.div`
  margin-top: auto;

  padding:
    15px 18px 22px;

  border-top:
    1px solid #e7edf1;
`;


// =====================================================
// SIDEBAR BACK BUTTON
// =====================================================

const SidebarBackButton = styled.button`
  width: 100%;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 11px 13px;

  margin-bottom: 7px;

  border: none;

  border-radius: 9px;

  background: transparent;

  color: #596b79;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  text-align: left;

  &:hover {
    background: #f1f5f7;

    color: #0078b8;
  }
`;


// =====================================================
// LOGOUT
// =====================================================

const LogoutButton = styled.button`
  width: 100%;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 12px 13px;

  border: none;

  border-radius: 9px;

  background: #fff5f5;

  color: #c24141;

  font-size: 12px;

  font-weight: 750;

  cursor: pointer;

  text-align: left;

  transition: all 0.2s ease;

  &:hover {
    background: #fee8e8;

    color: #b52f2f;
  }
`;


// =====================================================
// LOGOUT ICON
// =====================================================

const LogoutIcon = styled.span`
  font-size: 17px;
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
    0 4px 24px
    rgba(
      15,
      23,
      42,
      0.045
    );
`;


// =====================================================
// HEADER INNER
// =====================================================

const HeaderInner = styled.div`
  width: 100%;

  max-width: 1400px;

  margin: 0 auto;

  padding:
    15px 42px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 25px;

  @media (max-width: 700px) {
    padding:
      12px 20px;
  }
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
// MENU BUTTON
// =====================================================

const MenuButton = styled.button`
  width: 46px;
  height: 46px;

  flex-shrink: 0;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 5px;

  border: 1px solid #dce5eb;

  border-radius: 11px;

  background: #ffffff;

  cursor: pointer;

  box-shadow:
    0 3px 12px
    rgba(15, 23, 42, 0.05);

  transition:
    all 0.2s ease;

  &:hover {
    border-color: #b8d7e7;

    background: #f7fbfd;

    transform:
      translateY(-1px);
  }
`;


// =====================================================
// HAMBURGER LINE
// =====================================================

const HamburgerLine = styled.span`
  width: 20px;

  height: 2px;

  border-radius: 4px;

  background: #29485e;
`;


// =====================================================
// BRAND
// =====================================================

const Brand = styled.div`
  display: flex;

  align-items: center;

  gap: 15px;

  min-width: 0;
`;


// =====================================================
// BRAND LOGO
// =====================================================

const BrandLogo = styled.div`
  width: 66px;

  height: 51px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #ffffff;

  overflow: hidden;

  border:
    1px solid #e0e7ee;

  box-shadow:
    0 3px 10px
    rgba(
      15,
      23,
      42,
      0.05
    );

  @media (max-width: 500px) {
    width: 55px;

    height: 43px;
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
  color: #0b263d;

  font-size: 20px;

  font-weight: 800;

  line-height: 1.2;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  @media (max-width: 700px) {
    font-size: 16px;
  }

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;


// =====================================================
// COMPANY TAGLINE
// =====================================================

const CompanyTagline = styled.div`
  margin-top: 5px;

  color: #5e6f7f;

  font-size: 11px;

  font-weight: 500;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  @media (max-width: 500px) {
    font-size: 8px;
  }
`;


// =====================================================
// HEADER RIG
// =====================================================

const HeaderRig = styled.div`
  display: flex;

  flex-direction: column;

  align-items: flex-end;

  flex-shrink: 0;

  @media (max-width: 600px) {
    display: none;
  }
`;


// =====================================================
// HEADER RIG LABEL
// =====================================================

const HeaderRigLabel = styled.div`
  color: #9aa7b4;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 1.2px;
`;


// =====================================================
// HEADER RIG NUMBER
// =====================================================

const HeaderRigNumber = styled.div`
  margin-top: 4px;

  color: #0b263d;

  font-size: 16px;

  font-weight: 800;
`;


// =====================================================
// MAIN CONTENT
// =====================================================

const MainContent = styled.main`
  width: 100%;

  max-width: 1400px;

  margin: 0 auto;

  padding:
    58px 42px 75px;

  box-sizing: border-box;

  position: relative;

  z-index: 1;

  @media (max-width: 700px) {
    padding:
      38px 20px 55px;
  }
`;


// =====================================================
// PAGE HEADING
// =====================================================

const PageHeading = styled.div`
  margin-bottom: 38px;
`;


// =====================================================
// EYEBROW
// =====================================================

const Eyebrow = styled.div`
  display: inline-flex;

  align-items: center;

  gap: 9px;

  margin-bottom: 10px;

  color: #4e8f22;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1.8px;

  &::before {
    content: "";

    width: 25px;

    height: 3px;

    border-radius: 10px;

    background: #62c51c;
  }
`;


// =====================================================
// PAGE TITLE
// =====================================================

const PageTitle = styled.h1`
  margin: 0;

  color: #0b263d;

  font-size: 44px;

  font-weight: 800;

  line-height: 1.15;

  letter-spacing: -1px;

  @media (max-width: 700px) {
    font-size: 33px;
  }
`;


// =====================================================
// PAGE SUBTITLE
// =====================================================

const PageSubtitle = styled.p`
  margin:
    12px 0 0;

  color: #64748b;

  font-size: 16px;

  line-height: 1.6;

  max-width: 700px;

  @media (max-width: 700px) {
    font-size: 14px;
  }
`;


// =====================================================
// LORRY CARD
// =====================================================

const LorryCard = styled.div`
  position: relative;

  display: flex;

  align-items: center;

  gap: 28px;

  width: 100%;

  box-sizing: border-box;

  padding:
    32px 34px;

  margin-bottom: 52px;

  border:
    1px solid
    rgba(
      203,
      213,
      225,
      0.85
    );

  border-radius: 21px;

  background:
    linear-gradient(
      135deg,
      rgba(
        255,
        255,
        255,
        0.98
      ),
      rgba(
        248,
        252,
        255,
        0.95
      )
    );

  box-shadow:
    0 12px 35px
    rgba(
      15,
      23,
      42,
      0.06
    );

  overflow: hidden;

  &::after {
    content: "";

    position: absolute;

    width: 240px;

    height: 240px;

    right: -110px;

    top: -120px;

    border-radius: 50%;

    background:
      rgba(
        0,
        120,
        184,
        0.045
      );

    pointer-events: none;
  }

  @media (max-width: 800px) {
    flex-wrap: wrap;

    padding: 24px;
  }
`;


// =====================================================
// LORRY VISUAL
// =====================================================

const LorryVisual = styled.div`
  width: 82px;

  height: 82px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 18px;

  background:
    linear-gradient(
      135deg,
      #e9f7e1,
      #f3faef
    );

  border:
    1px solid #d7edca;

  @media (max-width: 500px) {
    width: 70px;

    height: 70px;
  }
`;


// =====================================================
// RIG ICON
// =====================================================

const RigIcon = styled.span`
  font-size: 40px;

  @media (max-width: 500px) {
    font-size: 33px;
  }
`;


// =====================================================
// LORRY MAIN
// =====================================================

const LorryMain = styled.div`
  min-width: 250px;

  flex: 1;

  @media (max-width: 800px) {
    min-width:
      calc(
        100% - 110px
      );
  }
`;


// =====================================================
// LORRY LABEL
// =====================================================

const LorryLabel = styled.div`
  color: #94a3b8;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.4px;
`;


// =====================================================
// REGISTRATION NUMBER
// =====================================================

const RegistrationNumber = styled.div`
  margin-top: 7px;

  color: #0b263d;

  font-size: 31px;

  font-weight: 800;

  letter-spacing: 0.7px;

  @media (max-width: 600px) {
    font-size: 25px;
  }
`;


// =====================================================
// STATUS
// =====================================================

const LorryStatus = styled.div`
  display: inline-flex;

  align-items: center;

  gap: 8px;

  margin-top: 10px;

  color: #4e8f22;

  font-size: 12px;

  font-weight: 700;
`;


// =====================================================
// STATUS DOT
// =====================================================

const StatusDot = styled.span`
  width: 9px;

  height: 9px;

  border-radius: 50%;

  background: #62c51c;

  box-shadow:
    0 0 0 4px
    rgba(
      98,
      197,
      28,
      0.12
    );
`;


// =====================================================
// OWNER DETAILS
// =====================================================

const OwnerDetails = styled.div`
  display: flex;

  align-items: center;

  gap: 38px;

  padding-left: 38px;

  border-left:
    1px solid #e5eaf0;

  @media (max-width: 800px) {
    width: 100%;

    padding:
      22px 0 0;

    border-left: none;

    border-top:
      1px solid #e5eaf0;

    gap: 32px;
  }
`;


// =====================================================
// OWNER ITEM
// =====================================================

const OwnerItem = styled.div`
  min-width: 150px;

  @media (max-width: 450px) {
    min-width: 0;
  }
`;


// =====================================================
// OWNER LABEL
// =====================================================

const OwnerLabel = styled.div`
  color: #94a3b8;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.2px;
`;


// =====================================================
// OWNER VALUE
// =====================================================

const OwnerValue = styled.div`
  margin-top: 8px;

  color: #334155;

  font-size: 16px;

  font-weight: 700;

  word-break: break-word;
`;


// =====================================================
// OWNER DIVIDER
// =====================================================

const OwnerDivider = styled.div`
  width: 1px;

  height: 45px;

  background: #e5eaf0;

  @media (max-width: 800px) {
    height: 38px;
  }
`;


// =====================================================
// SECTION HEADER
// =====================================================

const SectionHeader = styled.div`
  margin-bottom: 22px;
`;


// =====================================================
// SECTION TITLE
// =====================================================

const SectionTitle = styled.h2`
  margin: 0;

  color: #0b263d;

  font-size: 27px;

  font-weight: 800;
`;


// =====================================================
// SECTION DESCRIPTION
// =====================================================

const SectionDescription = styled.p`
  margin:
    7px 0 0;

  color: #7b8794;

  font-size: 14px;
`;


// =====================================================
// MANAGEMENT GRID
// =====================================================

const ManagementGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap: 24px;

  @media (max-width: 1000px) {
    grid-template-columns:
      repeat(
        2,
        1fr
      );
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;


// =====================================================
// MANAGEMENT CARD
// =====================================================

const ManagementCard = styled.button`
  position: relative;

  width: 100%;

  min-height: 315px;

  padding: 30px;

  box-sizing: border-box;

  text-align: left;

  border:
    1px solid
    rgba(
      203,
      213,
      225,
      0.85
    );

  border-radius: 20px;

  background:
    rgba(
      255,
      255,
      255,
      0.94
    );

  cursor: pointer;

  box-shadow:
    0 8px 28px
    rgba(
      15,
      23,
      42,
      0.05
    );

  overflow: hidden;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  &::before {
    content: "";

    position: absolute;

    top: 0;

    left: 0;

    right: 0;

    height: 4px;

    background:
      linear-gradient(
        90deg,
        #62c51c,
        #0078b8
      );

    opacity: 0;

    transition:
      opacity 0.25s ease;
  }

  &:hover {
    transform:
      translateY(-6px);

    border-color:
      rgba(
        0,
        120,
        184,
        0.22
      );

    box-shadow:
      0 18px 42px
      rgba(
        15,
        23,
        42,
        0.09
      );
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    transform:
      translateY(-2px);
  }
`;


// =====================================================
// CARD TOP
// =====================================================

const CardTop = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 30px;
`;


// =====================================================
// CARD ICON
// =====================================================

const CardIcon = styled.div`
  width: 68px;

  height: 68px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 17px;

  background:
    ${(props) =>
      props.$type === "employee"
        ? "linear-gradient(135deg, #EFF8E9, #F7FBF4)"
        : props.$type === "fuel"
        ? "linear-gradient(135deg, #FFF7E8, #FFFBF3)"
        : "linear-gradient(135deg, #EAF5FB, #F5FAFD)"};

  border:
    1px solid
    ${(props) =>
      props.$type === "employee"
        ? "#DCEFCF"
        : props.$type === "fuel"
        ? "#F4E3C1"
        : "#D7EAF5"};

  font-size: 31px;
`;


// =====================================================
// CARD ARROW
// =====================================================

const CardArrow = styled.span`
  width: 42px;

  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #f5f7f9;

  color: #64748b;

  font-size: 21px;

  transition: all 0.2s ease;

  ${ManagementCard}:hover & {
    background: #eaf4fa;

    color: #0078b8;

    transform:
      translateX(3px);
  }
`;


// =====================================================
// CARD TITLE
// =====================================================

const CardTitle = styled.h3`
  margin: 0;

  color: #0b263d;

  font-size: 25px;

  font-weight: 800;
`;


// =====================================================
// CARD DESCRIPTION
// =====================================================

const CardDescription = styled.p`
  min-height: 68px;

  margin:
    10px 0 24px;

  color: #718096;

  font-size: 14px;

  line-height: 1.7;

  max-width: 360px;
`;


// =====================================================
// CARD ACTION
// =====================================================

const CardAction = styled.div`
  display: flex;

  align-items: center;

  gap: 9px;

  color: #0078b8;

  font-size: 13px;

  font-weight: 800;

  span {
    font-size: 18px;

    transition:
      transform 0.2s ease;
  }

  ${ManagementCard}:hover & span {
    transform:
      translateX(4px);
  }
`;


// =====================================================
// INFORMATION SECTION
// =====================================================

const InfoSection = styled.section`
  margin-top: 48px;

  padding: 32px;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      #f3f8fb,
      #ffffff
    );

  border:
    1px solid #dce7ed;

  box-shadow:
    0 8px 28px
    rgba(
      15,
      23,
      42,
      0.04
    );
`;


// =====================================================
// INFO HEADER
// =====================================================

const InfoHeader = styled.div`
  display: flex;

  align-items: center;

  gap: 14px;
`;


// =====================================================
// INFO ICON
// =====================================================

const InfoIcon = styled.div`
  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  background: #e9f4f9;

  color: #0078b8;

  font-size: 22px;
`;


// =====================================================
// INFO TITLE
// =====================================================

const InfoTitle = styled.div`
  color: #0b263d;

  font-size: 20px;

  font-weight: 800;
`;


// =====================================================
// INFO SUBTITLE
// =====================================================

const InfoSubtitle = styled.div`
  margin-top: 4px;

  color: #718096;

  font-size: 12px;
`;


// =====================================================
// INFO TEXT
// =====================================================

const InfoText = styled.p`
  max-width: 950px;

  margin:
    22px 0 28px;

  color: #5e6f7f;

  font-size: 14px;

  line-height: 1.8;
`;


// =====================================================
// INFO STATS
// =====================================================

const InfoStats = styled.div`
  display: flex;

  align-items: center;

  gap: 35px;

  @media (max-width: 650px) {
    flex-wrap: wrap;

    gap: 20px;
  }
`;


// =====================================================
// INFO STAT
// =====================================================

const InfoStat = styled.div`
  min-width: 110px;
`;


// =====================================================
// INFO STAT NUMBER
// =====================================================

const InfoStatNumber = styled.div`
  color: #0b263d;

  font-size: 22px;

  font-weight: 800;
`;


// =====================================================
// INFO STAT LABEL
// =====================================================

const InfoStatLabel = styled.div`
  margin-top: 4px;

  color: #94a3b8;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 1px;
`;


// =====================================================
// INFO STAT DIVIDER
// =====================================================

const InfoStatDivider = styled.div`
  width: 1px;

  height: 35px;

  background: #dce5eb;

  @media (max-width: 650px) {
    display: none;
  }
`;


// =====================================================
// COMPANY MESSAGE
// =====================================================

const CompanyMessage = styled.div`
  position: relative;

  display: flex;

  align-items: center;

  gap: 22px;

  margin-top: 38px;

  padding:
    25px 30px;

  border:
    1px solid #dce9d5;

  border-radius: 17px;

  background:
    linear-gradient(
      100deg,
      #f7fbf4,
      #ffffff
    );

  overflow: hidden;

  box-shadow:
    0 6px 20px
    rgba(
      15,
      23,
      42,
      0.035
    );

  @media (max-width: 650px) {
    flex-direction: column;

    align-items: flex-start;

    padding: 22px;
  }
`;


// =====================================================
// MESSAGE ACCENT
// =====================================================

const MessageAccent = styled.div`
  width: 5px;

  align-self: stretch;

  flex-shrink: 0;

  border-radius: 5px;

  background:
    linear-gradient(
      180deg,
      #62c51c,
      #0078b8
    );

  @media (max-width: 650px) {
    width: 50px;

    height: 4px;

    align-self: auto;
  }
`;


// =====================================================
// MESSAGE CONTENT
// =====================================================

const MessageContent = styled.div`
  flex: 1;
`;


// =====================================================
// MESSAGE TITLE
// =====================================================

const MessageTitle = styled.div`
  color: #29451f;

  font-size: 16px;

  font-weight: 800;

  line-height: 1.5;
`;


// =====================================================
// MESSAGE SUBTITLE
// =====================================================

const MessageSubtitle = styled.div`
  margin-top: 6px;

  color: #718096;

  font-size: 12px;
`;


// =====================================================
// ESTABLISHED BADGE
// =====================================================

const EstablishedBadge = styled.div`
  padding:
    9px 13px;

  border-radius: 7px;

  background: #eaf5e3;

  color: #4e8f22;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.3px;

  white-space: nowrap;
`;


// =====================================================
// FOOTER
// =====================================================

const Footer = styled.footer`
  width: 100%;

  padding:
    0 20px 30px;

  box-sizing: border-box;

  text-align: center;

  color: #9aa7b4;

  font-size: 11px;
`;


// =====================================================
// LOGGING / LOADING
// =====================================================

const LoadingContainer = styled.div`
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  background:
    radial-gradient(
      circle at 30% 20%,
      rgba(
        0,
        120,
        184,
        0.08
      ),
      transparent 30%
    ),
    #f7f9fb;

  color: #0b263d;
`;


// =====================================================
// LOADING LOGO
// =====================================================

const LoadingLogo = styled.div`
  width: 95px;

  height: 75px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 14px;

  background: #ffffff;

  border:
    1px solid #e2e8f0;

  box-shadow:
    0 8px 25px
    rgba(
      15,
      23,
      42,
      0.06
    );

  margin-bottom: 20px;

  overflow: hidden;
`;


// =====================================================
// LOADING TITLE
// =====================================================

const LoadingTitle = styled.div`
  font-size: 20px;

  font-weight: 800;
`;


// =====================================================
// LOADING TEXT
// =====================================================

const LoadingText = styled.div`
  margin-top: 7px;

  color: #64748b;

  font-size: 14px;
`;


// =====================================================
// LOADING SPINNER
// =====================================================

const LoadingSpinner = styled.div`
  width: 30px;

  height: 30px;

  margin-top: 22px;

  border:
    3px solid #dce7ef;

  border-top-color:
    #0078b8;

  border-radius: 50%;

  animation:
    spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;


// =====================================================
// ERROR CONTAINER
// =====================================================

const ErrorContainer = styled.div`
  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  box-sizing: border-box;

  background:
    radial-gradient(
      circle at 30% 20%,
      rgba(
        0,
        120,
        184,
        0.06
      ),
      transparent 30%
    ),
    #f7f9fb;
`;


// =====================================================
// ERROR CARD
// =====================================================

const ErrorCard = styled.div`
  width: 100%;

  max-width: 480px;

  padding: 48px;

  text-align: center;

  background:
    rgba(
      255,
      255,
      255,
      0.96
    );

  border:
    1px solid #e5eaf0;

  border-radius: 20px;

  box-shadow:
    0 15px 40px
    rgba(
      15,
      23,
      42,
      0.08
    );
`;


// =====================================================
// ERROR ICON
// =====================================================

const ErrorIcon = styled.div`
  width: 65px;

  height: 65px;

  margin:
    0 auto 20px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #fef2f2;

  color: #dc2626;

  font-size: 25px;

  font-weight: 800;
`;


// =====================================================
// ERROR TITLE
// =====================================================

const ErrorTitle = styled.h2`
  margin: 0;

  color: #0b263d;

  font-size: 23px;
`;


// =====================================================
// ERROR TEXT
// =====================================================

const ErrorText = styled.p`
  margin:
    12px 0 28px;

  color: #64748b;

  font-size: 14px;

  line-height: 1.7;
`;


// =====================================================
// BACK BUTTON
// =====================================================

const BackButton = styled.button`
  padding:
    13px 24px;

  border: none;

  border-radius: 9px;

  background: #006ead;

  color: #ffffff;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #00598c;

    transform:
      translateY(-1px);
  }
`;


// =====================================================
// EXPORT
// =====================================================

export default DashboardPage;