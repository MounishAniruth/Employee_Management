import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import styled, { createGlobalStyle } from "styled-components";

import api from "../utils/api";

import LorryImage from "../assets/images/TN34K3749.jpeg";


// =====================================================
// LORRY MANAGER PAGE
// =====================================================

const LorryManagerPage = () => {

  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName");


  const [lorry, setLorry] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

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

  };


  // =====================================================
  // FETCH ASSIGNED LORRY
  // =====================================================

  useEffect(() => {

    const fetchAssignedLorry =
      async () => {

        try {

          setLoading(true);


          const response =
            await api.get(
              "/lorry/assigned"
            );


          setLorry(
            response.data
          );


        } catch (error) {

          console.error(
            "Error fetching assigned lorry:",
            error
          );


          if (
            error.response?.status === 401
          ) {

            logout();

            return;

          }


          if (
            error.response?.status === 404
          ) {

            setLorry(null);

            return;

          }


          alert(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch assigned lorry."
          );


        } finally {

          setLoading(false);

        }

      };


    fetchAssignedLorry();


    // logout intentionally omitted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // =====================================================
  // OPEN FUEL
  // =====================================================

  const openFuel = () => {

    if (!lorry) {

      return;

    }


    navigate(
      `/fuel/${lorry.id}`
    );

    setMenuOpen(false);

  };


  // =====================================================
  // OPEN POINT DETAILS
  // =====================================================

  const openPointDetails = () => {

    if (!lorry) {

      return;

    }


    navigate(
      `/point-details/${lorry.id}`
    );

    setMenuOpen(false);

  };


  // =====================================================
  // GO HOME
  // =====================================================

  const goHome = () => {

    setMenuOpen(false);

    navigate("/home");

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <Page>
      <ResponsiveStyleMount/>


      {/* =================================================
          TOP BAR
      ================================================= */}

      <TopBar>


        {/* MENU BUTTON */}

        <MenuButton
          onClick={() =>
            setMenuOpen(
              (previous) =>
                !previous
            )
          }
        >

          <MenuLine />
          <MenuLine />
          <MenuLine />

        </MenuButton>


        {/* BRAND */}

        <BrandArea>

          <BrandLogo>
            SM
          </BrandLogo>


          <BrandText>

            <CompanyName>
              Sri Murugan Rig Service
            </CompanyName>


            <CompanySubtitle>
              Drilling • Borewell • Rig Operations
            </CompanySubtitle>

          </BrandText>

        </BrandArea>


        {/* USER */}

        <UserArea>

          <UserAvatar>

            {
              (
                userName ||
                "M"
              )
                .charAt(0)
                .toUpperCase()
            }

          </UserAvatar>


          <UserInfo>

            <UserName>
              {
                userName ||
                "Lorry Manager"
              }
            </UserName>


            <UserRole>
              LORRY MANAGER
            </UserRole>

          </UserInfo>

        </UserArea>

      </TopBar>


      {/* =================================================
          SIDE MENU
      ================================================= */}

      {menuOpen && (

        <>

          <MenuBackdrop
            onClick={() =>
              setMenuOpen(false)
            }
          />


          <SideMenu>


            <SideMenuHeader>

              <SideMenuBrand>
                Sri Murugan Rig Service
              </SideMenuBrand>


              <CloseButton
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                ×
              </CloseButton>

            </SideMenuHeader>


            <SideMenuSubtitle>
              Lorry Manager Control Center
            </SideMenuSubtitle>


            <MenuDivider />


            <MenuItem
              onClick={() =>
                setMenuOpen(false)
              }
            >

              <MenuIcon>
                🚛
              </MenuIcon>


              <MenuContent>

                <MenuItemTitle>
                  My Assigned Lorry
                </MenuItemTitle>


                <MenuItemText>
                  View assigned lorry
                </MenuItemText>

              </MenuContent>

            </MenuItem>


            <MenuItem
              onClick={openFuel}
              disabled={!lorry}
            >

              <MenuIcon>
                ⛽
              </MenuIcon>


              <MenuContent>

                <MenuItemTitle>
                  Fuel Details
                </MenuItemTitle>


                <MenuItemText>
                  Track fuel and expenses
                </MenuItemText>

              </MenuContent>

            </MenuItem>


            <MenuItem
              onClick={openPointDetails}
              disabled={!lorry}
            >

              <MenuIcon>
                📍
              </MenuIcon>


              <MenuContent>

                <MenuItemTitle>
                  Point Details
                </MenuItemTitle>


                <MenuItemText>
                  Manage drilling points
                </MenuItemText>

              </MenuContent>

            </MenuItem>


            <MenuItem
              onClick={goHome}
            >

              <MenuIcon>
                ⌂
              </MenuIcon>


              <MenuContent>

                <MenuItemTitle>
                  Home
                </MenuItemTitle>


                <MenuItemText>
                  Company overview
                </MenuItemText>

              </MenuContent>

            </MenuItem>


            <MenuDivider />


            <LogoutItem
              onClick={logout}
            >

              <MenuIcon>
                ↪
              </MenuIcon>


              <MenuContent>

                <MenuItemTitle>
                  Logout
                </MenuItemTitle>


                <MenuItemText>
                  Sign out of your account
                </MenuItemText>

              </MenuContent>

            </LogoutItem>


          </SideMenu>

        </>

      )}


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <Main>


        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <PageIntro>

          <IntroEyebrow>
            LORRY OPERATIONS
          </IntroEyebrow>


          <IntroTitle>
            My Assigned Lorry
          </IntroTitle>


          <IntroDescription>

            Manage the operational details
            of your assigned drilling rig
            from one place.

          </IntroDescription>

        </PageIntro>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <LoadingCard>

            <Spinner />

            <LoadingTitle>
              Loading your lorry
            </LoadingTitle>


            <LoadingText>
              Fetching assigned lorry details...
            </LoadingText>

          </LoadingCard>

        ) : !lorry ? (

          <NoLorryCard>

            <NoLorryIcon>
              🚛
            </NoLorryIcon>


            <NoLorryTitle>
              No Lorry Assigned
            </NoLorryTitle>


            <NoLorryText>

              A lorry has not been assigned
              to your account yet.

              <br />

              Please contact the owner
              or manager.

            </NoLorryText>

          </NoLorryCard>

        ) : (

          <>


            {/* =================================================
                LORRY HERO CARD
            ================================================= */}

            <LorryHero>


              <LorryImageContainer>

                <img
                  src={LorryImage}
                  alt={
                    lorry.registration_number ||
                    "Assigned lorry"
                  }
                />


                <ImageOverlay />


                <ActiveBadge>

                  <ActiveDot />

                  {
                    lorry.status ||
                    "ACTIVE"
                  }

                </ActiveBadge>


                <RegistrationArea>

                  <RegistrationLabel>
                    ASSIGNED LORRY
                  </RegistrationLabel>


                  <RegistrationNumber>

                    {
                      lorry.registration_number ||
                      "N/A"
                    }

                  </RegistrationNumber>

                </RegistrationArea>

              </LorryImageContainer>


              <LorryInformation>


                <InfoEyebrow>
                  VEHICLE INFORMATION
                </InfoEyebrow>


                <InfoTitle>

                  {
                    lorry.model ||
                    "Drilling Rig"
                  }

                </InfoTitle>


                <InfoDescription>

                  Your assigned drilling rig
                  and operational vehicle.

                </InfoDescription>


                <DetailsGrid>


                  <DetailCard>

                    <DetailIcon>
                      👤
                    </DetailIcon>


                    <DetailContent>

                      <DetailLabel>
                        OWNER
                      </DetailLabel>


                      <DetailValue>

                        {
                          lorry.owner_name ||
                          "Not Available"
                        }

                      </DetailValue>

                    </DetailContent>

                  </DetailCard>


                  <DetailCard>

                    <DetailIcon>
                      ☎
                    </DetailIcon>


                    <DetailContent>

                      <DetailLabel>
                        OWNER PHONE
                      </DetailLabel>


                      <DetailValue>

                        {
                          lorry.owner_phone ||
                          "Not Available"
                        }

                      </DetailValue>

                    </DetailContent>

                  </DetailCard>


                  <DetailCard>

                    <DetailIcon>
                      🚛
                    </DetailIcon>


                    <DetailContent>

                      <DetailLabel>
                        MODEL
                      </DetailLabel>


                      <DetailValue>

                        {
                          lorry.model ||
                          "Not Available"
                        }

                      </DetailValue>

                    </DetailContent>

                  </DetailCard>


                  <DetailCard>

                    <DetailIcon>
                      📅
                    </DetailIcon>


                    <DetailContent>

                      <DetailLabel>
                        YEAR BUILT
                      </DetailLabel>


                      <DetailValue>

                        {
                          lorry.year_built ||
                          "Not Available"
                        }

                      </DetailValue>

                    </DetailContent>

                  </DetailCard>


                </DetailsGrid>


              </LorryInformation>

            </LorryHero>


            {/* =================================================
                OPERATIONS
            ================================================= */}

            <OperationsSection>


              <OperationsHeader>

                <OperationsHeaderContent>

                  <OperationsEyebrow>
                    OPERATIONS
                  </OperationsEyebrow>


                  <OperationsTitle>
                    Lorry Details
                  </OperationsTitle>


                  <OperationsDescription>

                    Access the information you
                    need to manage your daily
                    rig operations.

                  </OperationsDescription>

                </OperationsHeaderContent>


                <OperationsStatus>

                  <StatusDot />

                  READY

                </OperationsStatus>

              </OperationsHeader>


              <ModuleGrid>


                {/* ==========================================
                    FUEL
                ========================================== */}

                <ModuleCard
                  onClick={openFuel}
                >

                  <ModuleIcon fuel>
                    ⛽
                  </ModuleIcon>


                  <ModuleContent>

                    <ModuleEyebrow>
                      OPERATIONS
                    </ModuleEyebrow>


                    <ModuleTitle>
                      Fuel Details
                    </ModuleTitle>


                    <ModuleDescription>

                      Record and monitor fuel
                      usage, expenses and
                      refuelling history for
                      this lorry.

                    </ModuleDescription>


                    <ModuleAction>

                      Open Fuel Details

                      <Arrow>
                        →
                      </Arrow>

                    </ModuleAction>

                  </ModuleContent>

                </ModuleCard>


                {/* ==========================================
                    POINT DETAILS
                ========================================== */}

                <ModuleCard
                  onClick={openPointDetails}
                >

                  <ModuleIcon point>
                    📍
                  </ModuleIcon>


                  <ModuleContent>

                    <ModuleEyebrow>
                      FIELD OPERATIONS
                    </ModuleEyebrow>


                    <ModuleTitle>
                      Point Details
                    </ModuleTitle>


                    <ModuleDescription>

                      Manage drilling points,
                      locations and operational
                      information for your
                      assigned rig.

                    </ModuleDescription>


                    <ModuleAction>

                      Open Point Details

                      <Arrow>
                        →
                      </Arrow>

                    </ModuleAction>

                  </ModuleContent>

                </ModuleCard>


              </ModuleGrid>

            </OperationsSection>


            {/* =================================================
                EXPERIENCE BANNER
            ================================================= */}

            <ExperienceBanner>

              <ExperienceContent>

                <ExperienceEyebrow>
                  SRI MURUGAN RIG SERVICE
                </ExperienceEyebrow>


                <ExperienceTitle>

                  25 Years of Experience.
                  <br />

                  Built on Trust.
                  Driven by Service.

                </ExperienceTitle>


                <ExperienceText>

                  Since 2001, our drilling
                  operations have been built
                  around dependable service,
                  field experience and
                  long-term customer trust.

                </ExperienceText>

              </ExperienceContent>


              <ExperienceSince>

                <SinceNumber>
                  25+
                </SinceNumber>


                <SinceLabel>
                  YEARS
                  <br />
                  EXPERIENCE
                </SinceLabel>

              </ExperienceSince>

            </ExperienceBanner>


          </>

        )}

      </Main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer>

        <FooterCompany>
          Sri Murugan Rig Service
        </FooterCompany>


        <FooterQuote>

          “Since 2001 — Reliability at Every Depth.”

        </FooterQuote>


        <FooterSince>
          Since 2001
        </FooterSince>

      </Footer>


    </Page>

  );

};


export default LorryManagerPage;


// =====================================================
// PAGE
// =====================================================

const Page = styled.div`

  min-height: 100vh;

  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(22,101,52,0.07),
      transparent 25%
    ),

    radial-gradient(
      circle at 90% 30%,
      rgba(30,64,175,0.05),
      transparent 25%
    ),

    linear-gradient(
      135deg,
      #f8faf9 0%,
      #eef4f0 100%
    );

  color: #172554;

`;


// =====================================================
// TOP BAR
// =====================================================

const TopBar = styled.header`

  position: relative;

  z-index: 30;

  height: 92px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0 42px;

  background:
    rgba(255,255,255,0.96);

  border-bottom:
    1px solid #dce7e1;

  backdrop-filter:
    blur(15px);

`;


// =====================================================
// MENU BUTTON
// =====================================================

const MenuButton = styled.button`

  position: absolute;

  left: 32px;

  top: 50%;

  transform:
    translateY(-50%);

  width: 54px;

  height: 54px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 6px;

  border:
    1px solid #dce7e1;

  border-radius: 14px;

  background: #ffffff;

  cursor: pointer;

  transition:
    all 0.2s ease;


  &:hover {

    background: #ecfdf5;

    border-color: #bbf7d0;

  }

`;


// =====================================================
// MENU LINE
// =====================================================

const MenuLine = styled.span`

  width: 25px;

  height: 3px;

  border-radius: 4px;

  background: #166534;

`;


// =====================================================
// BRAND
// =====================================================

const BrandArea = styled.div`

  display: flex;

  align-items: center;

  gap: 15px;

`;


// =====================================================
// BRAND LOGO
// =====================================================

const BrandLogo = styled.div`

  width: 57px;

  height: 57px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 15px;

  background: #14532d;

  color: #ffffff;

  font-size: 17px;

  font-weight: 900;

  letter-spacing: 1px;

  box-shadow:
    0 8px 22px
    rgba(20,83,45,0.18);

`;


// =====================================================
// BRAND TEXT
// =====================================================

const BrandText = styled.div`;

`;


// =====================================================
// COMPANY NAME
// =====================================================

const CompanyName = styled.div`

  color: #172554;

  font-size: 21px;

  font-weight: 900;

`;


// =====================================================
// COMPANY SUBTITLE
// =====================================================

const CompanySubtitle = styled.div`

  margin-top: 4px;

  color: #64748b;

  font-size: 11px;

  font-weight: 700;

`;


// =====================================================
// USER AREA
// =====================================================

const UserArea = styled.div`

  position: absolute;

  right: 34px;

  top: 50%;

  transform:
    translateY(-50%);

  display: flex;

  align-items: center;

  gap: 12px;

`;


// =====================================================
// USER AVATAR
// =====================================================

const UserAvatar = styled.div`

  width: 49px;

  height: 49px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  background: #ecfdf5;

  color: #166534;

  font-size: 17px;

  font-weight: 900;

`;


// =====================================================
// USER INFO
// =====================================================

const UserInfo = styled.div`;

  text-align: left;

`;


// =====================================================
// USER NAME
// =====================================================

const UserName = styled.div`

  color: #172554;

  font-size: 14px;

  font-weight: 900;

`;


// =====================================================
// USER ROLE
// =====================================================

const UserRole = styled.div`

  margin-top: 3px;

  color: #94a3b8;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// MENU BACKDROP
// =====================================================

const MenuBackdrop = styled.div`

  position: fixed;

  inset: 0;

  z-index: 80;

  background:
    rgba(15,23,42,0.42);

  backdrop-filter:
    blur(3px);

`;


// =====================================================
// SIDE MENU
// =====================================================

const SideMenu = styled.aside`

  position: fixed;

  top: 0;

  left: 0;

  bottom: 0;

  z-index: 90;

  width: 390px;

  padding: 32px 24px;

  box-sizing: border-box;

  background: #ffffff;

  box-shadow:
    18px 0 50px
    rgba(15,23,42,0.16);

  animation:
    slideIn 0.22s ease;


  @keyframes slideIn {

    from {

      transform:
        translateX(-100%);

    }

    to {

      transform:
        translateX(0);

    }

  }

`;


// =====================================================
// SIDE MENU HEADER
// =====================================================

const SideMenuHeader = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

`;


// =====================================================
// SIDE MENU BRAND
// =====================================================

const SideMenuBrand = styled.div`

  color: #172554;

  font-size: 21px;

  font-weight: 900;

`;


// =====================================================
// CLOSE BUTTON
// =====================================================

const CloseButton = styled.button`

  width: 44px;

  height: 44px;

  border:
    1px solid #dce7e1;

  border-radius: 11px;

  background: #f8faf9;

  color: #64748b;

  font-size: 27px;

  cursor: pointer;

`;


// =====================================================
// SIDE MENU SUBTITLE
// =====================================================

const SideMenuSubtitle = styled.div`

  margin-top: 6px;

  color: #94a3b8;

  font-size: 11px;

  font-weight: 700;

`;


// =====================================================
// MENU DIVIDER
// =====================================================

const MenuDivider = styled.div`

  height: 1px;

  margin: 22px 0;

  background: #eef2f7;

`;


// =====================================================
// MENU ITEM
// =====================================================

const MenuItem = styled.button`

  width: 100%;

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 15px;

  margin-bottom: 7px;

  border: none;

  border-radius: 13px;

  background: transparent;

  text-align: left;

  cursor: pointer;

  transition:
    background 0.2s ease;


  &:hover {

    background: #f0fdf4;

  }


  &:disabled {

    opacity: 0.45;

    cursor: not-allowed;

  }

`;


// =====================================================
// LOGOUT
// =====================================================

const LogoutItem = styled(MenuItem)`

  &:hover {

    background: #fef2f2;

  }

`;

const StatusDot = styled.span`
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #22c55e;
  box-shadow:
    0 0 0 5px rgba(34, 197, 94, 0.12);
`;


// =====================================================
// MENU ICON
// =====================================================

const MenuIcon = styled.div`

  width: 48px;

  height: 48px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #f1f5f9;

  font-size: 20px;

`;


// =====================================================
// MENU CONTENT
// =====================================================

const MenuContent = styled.div`

  min-width: 0;

`;


// =====================================================
// MENU ITEM TITLE
// =====================================================

const MenuItemTitle = styled.div`

  color: #172554;

  font-size: 14px;

  font-weight: 900;

`;


// =====================================================
// MENU ITEM TEXT
// =====================================================

const MenuItemText = styled.div`

  margin-top: 3px;

  color: #94a3b8;

  font-size: 10px;

  font-weight: 600;

`;


// =====================================================
// MAIN
// =====================================================

const Main = styled.main`

  max-width: 1550px;

  margin: 0 auto;

  padding:
    55px 42px 70px;

`;


// =====================================================
// PAGE INTRO
// =====================================================

const PageIntro = styled.div`

  margin-bottom: 35px;

`;


// =====================================================
// INTRO EYEBROW
// =====================================================

const IntroEyebrow = styled.div`

  color: #3f6f5a;

  font-size: 11px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// INTRO TITLE
// =====================================================

const IntroTitle = styled.h1`

  margin: 8px 0 0;

  color: #172554;

  font-size:
    clamp(42px, 5vw, 58px);

  font-weight: 900;

  letter-spacing: -1.5px;

`;


// =====================================================
// INTRO DESCRIPTION
// =====================================================

const IntroDescription = styled.p`

  max-width: 700px;

  margin: 13px 0 0;

  color: #64748b;

  font-size: 16px;

  line-height: 1.7;

`;


// =====================================================
// LORRY HERO
// =====================================================

const LorryHero = styled.section`

  display: grid;

  grid-template-columns:
    1.1fr 1fr;

  overflow: hidden;

  border:
    1px solid #dce7e1;

  border-radius: 27px;

  background: #ffffff;

  box-shadow:
    0 18px 45px
    rgba(15,23,42,0.07);

`;


// =====================================================
// LORRY IMAGE
// =====================================================

const LorryImageContainer = styled.div`

  position: relative;

  min-height: 510px;

  overflow: hidden;

  background: #173b2a;

  img {

    width: 100%;

    height: 100%;

    min-height: 510px;

    object-fit: cover;

  }

`;


// =====================================================
// IMAGE OVERLAY
// =====================================================

const ImageOverlay = styled.div`

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(8,25,17,0.92),
      rgba(8,25,17,0.05) 65%
    );

`;


// =====================================================
// ACTIVE BADGE
// =====================================================

const ActiveBadge = styled.div`

  position: absolute;

  top: 22px;

  right: 22px;

  display: flex;

  align-items: center;

  gap: 8px;

  padding:
    10px 14px;

  border-radius: 10px;

  background:
    rgba(255,255,255,0.95);

  color: #166534;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// ACTIVE DOT
// =====================================================

const ActiveDot = styled.span`

  width: 9px;

  height: 9px;

  border-radius: 50%;

  background: #22c55e;

  box-shadow:
    0 0 0 5px
    rgba(34,197,94,0.12);

`;


// =====================================================
// REGISTRATION AREA
// =====================================================

const RegistrationArea = styled.div`

  position: absolute;

  left: 32px;

  right: 25px;

  bottom: 30px;

`;


// =====================================================
// REGISTRATION LABEL
// =====================================================

const RegistrationLabel = styled.div`

  color: #bbf7d0;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// REGISTRATION NUMBER
// =====================================================

const RegistrationNumber = styled.div`

  margin-top: 5px;

  color: #ffffff;

  font-size:
    clamp(42px, 5vw, 65px);

  line-height: 1;

  font-weight: 900;

  letter-spacing: 2px;

  text-shadow:
    0 4px 15px
    rgba(0,0,0,0.35);

`;


// =====================================================
// LORRY INFORMATION
// =====================================================

const LorryInformation = styled.div`

  padding: 48px;

`;


// =====================================================
// INFO EYEBROW
// =====================================================

const InfoEyebrow = styled.div`

  color: #3f6f5a;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// INFO TITLE
// =====================================================

const InfoTitle = styled.h2`

  margin: 8px 0 0;

  color: #172554;

  font-size: 38px;

  font-weight: 900;

`;


// =====================================================
// INFO DESCRIPTION
// =====================================================

const InfoDescription = styled.p`

  margin: 10px 0 0;

  color: #64748b;

  font-size: 14px;

  line-height: 1.6;

`;


// =====================================================
// DETAILS GRID
// =====================================================

const DetailsGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 20px;

  margin-top: 35px;
`;


// =====================================================
// DETAIL CARD
// =====================================================

const DetailCard = styled.div`
  display: flex;

  align-items: center;

  gap: 18px;

  min-height: 125px;

  padding: 22px;

  box-sizing: border-box;

  border: 1px solid #dce7e1;

  border-radius: 17px;

  background: #f8faf9;

  transition: all 0.2s ease;

  &:hover {
    background: #f0fdf4;

    border-color: #bbf7d0;

    transform: translateY(-2px);
  }
`;


// =====================================================
// DETAIL ICON
// =====================================================

const DetailIcon = styled.div`
  width: 58px;

  height: 58px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 14px;

  background: #ecfdf5;

  color: #166534;

  font-size: 25px;
`;


// =====================================================
// DETAIL CONTENT
// =====================================================

const DetailContent = styled.div`

  min-width: 0;

`;


// =====================================================
// DETAIL LABEL
// =====================================================

const DetailLabel = styled.div`
  color: #64748b;

  font-size: 11px;

  font-weight: 900;

  letter-spacing: 1.3px;

  text-transform: uppercase;
`;


// =====================================================
// DETAIL VALUE
// =====================================================

const DetailValue = styled.div`
  margin-top: 7px;

  color: #172554;

  font-size: 19px;

  font-weight: 900;

  line-height: 1.3;

  word-break: break-word;
`;

// =====================================================
// OPERATIONS
// =====================================================

const OperationsSection = styled.section`

  margin-top: 60px;

`;


// =====================================================
// OPERATIONS HEADER
// =====================================================

const OperationsHeader = styled.div`

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 25px;

`;


// =====================================================
// HEADER CONTENT
// =====================================================

const OperationsHeaderContent = styled.div`;

`;


// =====================================================
// OPERATIONS EYEBROW
// =====================================================

const OperationsEyebrow = styled.div`

  color: #3f6f5a;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// OPERATIONS TITLE
// =====================================================

const OperationsTitle = styled.h2`

  margin: 7px 0 0;

  color: #172554;

  font-size: 35px;

  font-weight: 900;

`;


// =====================================================
// OPERATIONS DESCRIPTION
// =====================================================

const OperationsDescription = styled.p`

  margin: 8px 0 0;

  color: #64748b;

  font-size: 14px;

`;


// =====================================================
// OPERATIONS STATUS
// =====================================================

const OperationsStatus = styled.div`

  display: flex;

  align-items: center;

  gap: 9px;

  padding:
    11px 15px;

  border:
    1px solid #bbf7d0;

  border-radius: 10px;

  background: #f0fdf4;

  color: #166534;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// MODULE GRID
// =====================================================

const ModuleGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 23px;

`;


// =====================================================
// MODULE CARD
// =====================================================

const ModuleCard = styled.button`

  min-height: 320px;

  display: flex;

  align-items: flex-start;

  gap: 23px;

  padding: 32px;

  box-sizing: border-box;

  border:
    1px solid #dce7e1;

  border-radius: 22px;

  background: #ffffff;

  text-align: left;

  cursor: pointer;

  box-shadow:
    0 10px 30px
    rgba(15,23,42,0.05);

  transition:
    all 0.22s ease;


  &:hover {

    transform:
      translateY(-6px);

    border-color:
      #bbf7d0;

    box-shadow:
      0 20px 40px
      rgba(15,23,42,0.09);

  }

`;


// =====================================================
// MODULE ICON
// =====================================================

const ModuleIcon = styled.div`

  width: 72px;

  height: 72px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 18px;

  background:
    ${({ fuel }) =>
      fuel
        ? "#fff7ed"
        : "#eff6ff"};

  color:
    ${({ fuel }) =>
      fuel
        ? "#c2410c"
        : "#1d4ed8"};

  font-size: 31px;

`;


// =====================================================
// MODULE CONTENT
// =====================================================

const ModuleContent = styled.div`

  flex: 1;

`;


// =====================================================
// MODULE EYEBROW
// =====================================================

const ModuleEyebrow = styled.div`

  color: #94a3b8;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.5px;

`;


// =====================================================
// MODULE TITLE
// =====================================================

const ModuleTitle = styled.div`

  margin-top: 7px;

  color: #172554;

  font-size: 27px;

  font-weight: 900;

`;


// =====================================================
// MODULE DESCRIPTION
// =====================================================

const ModuleDescription = styled.div`

  max-width: 470px;

  margin-top: 12px;

  color: #64748b;

  font-size: 14px;

  line-height: 1.7;

`;


// =====================================================
// MODULE ACTION
// =====================================================

const ModuleAction = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 30px;

  color: #166534;

  font-size: 12px;

  font-weight: 900;

`;


// =====================================================
// ARROW
// =====================================================

const Arrow = styled.span`

  font-size: 23px;

  transition:
    transform 0.2s ease;

  ${ModuleCard}:hover & {

    transform:
      translateX(5px);

  }

`;


// =====================================================
// EXPERIENCE BANNER
// =====================================================

const ExperienceBanner = styled.section`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 35px;

  margin-top: 55px;

  padding: 42px;

  border-radius: 23px;

  background:
    linear-gradient(
      120deg,
      #163b29,
      #1f5139
    );

  box-shadow:
    0 18px 40px
    rgba(15,23,42,0.1);

`;


// =====================================================
// EXPERIENCE CONTENT
// =====================================================

const ExperienceContent = styled.div`

  max-width: 800px;

`;


// =====================================================
// EXPERIENCE EYEBROW
// =====================================================

const ExperienceEyebrow = styled.div`

  color: #a7f3d0;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// EXPERIENCE TITLE
// =====================================================

const ExperienceTitle = styled.h2`

  margin: 10px 0 0;

  color: #ffffff;

  font-size: 32px;

  line-height: 1.25;

  font-weight: 900;

`;


// =====================================================
// EXPERIENCE TEXT
// =====================================================

const ExperienceText = styled.p`

  margin: 14px 0 0;

  color: #dbece2;

  font-size: 14px;

  line-height: 1.7;

`;


// =====================================================
// EXPERIENCE SINCE
// =====================================================

const ExperienceSince = styled.div`

  display: flex;

  align-items: center;

  gap: 13px;

  padding-left: 28px;

  border-left:
    3px solid #86efac;

`;


// =====================================================
// SINCE NUMBER
// =====================================================

const SinceNumber = styled.div`

  color: #ffffff;

  font-size: 57px;

  line-height: 1;

  font-weight: 900;

`;


// =====================================================
// SINCE LABEL
// =====================================================

const SinceLabel = styled.div`

  color: #a7f3d0;

  font-size: 10px;

  line-height: 1.4;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// LOADING CARD
// =====================================================

const LoadingCard = styled.div`

  min-height: 500px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  border:
    1px solid #dce7e1;

  border-radius: 25px;

  background: #ffffff;

`;


// =====================================================
// SPINNER
// =====================================================

const Spinner = styled.div`

  width: 55px;

  height: 55px;

  border:
    5px solid #dcfce7;

  border-top-color:
    #166534;

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
// LOADING TITLE
// =====================================================

const LoadingTitle = styled.div`

  margin-top: 23px;

  color: #172554;

  font-size: 23px;

  font-weight: 900;

`;


// =====================================================
// LOADING TEXT
// =====================================================

const LoadingText = styled.div`

  margin-top: 8px;

  color: #94a3b8;

  font-size: 13px;

`;


// =====================================================
// NO LORRY CARD
// =====================================================

const NoLorryCard = styled.div`

  min-height: 500px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 40px;

  border:
    1px dashed #cbd5e1;

  border-radius: 25px;

  background:
    rgba(255,255,255,0.8);

  text-align: center;

`;


// =====================================================
// NO LORRY ICON
// =====================================================

const NoLorryIcon = styled.div`

  width: 95px;

  height: 95px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 25px;

  background: #ecfdf5;

  font-size: 42px;

`;


// =====================================================
// NO LORRY TITLE
// =====================================================

const NoLorryTitle = styled.h2`

  margin: 22px 0 0;

  color: #172554;

  font-size: 29px;

  font-weight: 900;

`;


// =====================================================
// NO LORRY TEXT
// =====================================================

const NoLorryText = styled.p`

  margin: 10px 0 0;

  color: #64748b;

  font-size: 14px;

  line-height: 1.7;

`;


// =====================================================
// FOOTER
// =====================================================

const Footer = styled.footer`

  max-width: 1550px;

  margin: 0 auto;

  padding:
    28px 42px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 25px;

  border-top:
    1px solid #dce7e1;

`;


// =====================================================
// FOOTER COMPANY
// =====================================================

const FooterCompany = styled.div`

  color: #166534;

  font-size: 13px;

  font-weight: 900;

`;


// =====================================================
// FOOTER QUOTE
// =====================================================

const FooterQuote = styled.div`

  color: #64748b;

  font-size: 11px;

  font-style: italic;

`;


// =====================================================
// FOOTER SINCE
// =====================================================

const FooterSince = styled.div`

  color: #94a3b8;

  font-size: 11px;

  font-weight: 800;

`;


// =====================================================
// RESPONSIVE
// =====================================================

const ResponsiveStyle = createGlobalStyle`

  @media (max-width: 1100px) {

    ${LorryHero} {

      grid-template-columns:
        1fr;

    }


    ${LorryImageContainer} {

      min-height: 430px;

    }


    ${LorryImageContainer} img {

      min-height: 430px;

    }


    ${ModuleGrid} {

      grid-template-columns:
        1fr;

    }

  }


  @media (max-width: 750px) {

    ${TopBar} {

      height: 78px;

      padding: 0 15px;

    }


    ${MenuButton} {

      left: 15px;

      width: 46px;

      height: 46px;

    }


    ${BrandLogo} {

      width: 44px;

      height: 44px;

    }


    ${CompanyName} {

      font-size: 15px;

    }


    ${CompanySubtitle} {

      display: none;

    }


    ${UserArea} {

      right: 15px;

    }


    ${UserInfo} {

      display: none;

    }


    ${Main} {

      padding:
        35px 18px 50px;

    }


    ${IntroTitle} {

      font-size: 40px;

    }


    ${LorryInformation} {

      padding: 30px 23px;

    }


    ${InfoTitle} {

      font-size: 31px;

    }


    ${DetailsGrid} {

      grid-template-columns:
        1fr;

    }


    ${OperationsHeader} {

      align-items: flex-start;

      flex-direction: column;

    }


    ${ExperienceBanner} {

      align-items: flex-start;

      flex-direction: column;

      padding: 30px;

    }


    ${ExperienceSince} {

      padding-left: 0;

      padding-top: 20px;

      border-left: none;

      border-top:
        3px solid #86efac;

    }


    ${Footer} {

      align-items: flex-start;

      flex-direction: column;

      padding:
        25px 20px;

    }

  }


  @media (max-width: 500px) {

    ${SideMenu} {

      width: 90%;

    }


    ${LorryImageContainer} {

      min-height: 350px;

    }


    ${LorryImageContainer} img {

      min-height: 350px;

    }


    ${RegistrationArea} {

      left: 22px;

      bottom: 22px;

    }


    ${RegistrationNumber} {

      font-size: 37px;

    }


    ${ModuleCard} {

      min-height: auto;

      padding: 24px;

      flex-direction: column;

    }


    ${ModuleIcon} {

      width: 62px;

      height: 62px;

    }


    ${ExperienceTitle} {

      font-size: 27px;

    }

  }

`;


// =====================================================
// RESPONSIVE STYLE MOUNT
// =====================================================

const ResponsiveStyleMount = () => {

  return (
    <ResponsiveStyle />
  );

};