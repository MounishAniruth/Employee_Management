import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import styled from "styled-components";

import api from "../utils/api";

import LorryImage from "../assets/images/TN34K3749.jpeg";


// =====================================================
// MANAGER PAGE
// =====================================================

const ManagerPage = () => {

  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName");


  // =====================================================
  // STATE
  // =====================================================

  const [lorries, setLorries] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

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
  // FETCH ALL LORRIES
  // =====================================================

  useEffect(() => {

    const loadLorries = async () => {

      try {

        setLoading(true);


        const response =
          await api.get("/lorry");


        setLorries(
          Array.isArray(response.data)
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

          logout();

          return;

        }


        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch lorries."
        );


      } finally {

        setLoading(false);

      }

    };


    loadLorries();


    // logout intentionally omitted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // =====================================================
  // OPEN LORRY
  // =====================================================

  const openLorry = (
    lorryId
  ) => {

    navigate(
      `/dashboard/${lorryId}`
    );

    setMenuOpen(false);

  };


  // =====================================================
  // FILTER LORRIES
  // =====================================================

  const filteredLorries =
    useMemo(() => {

      const query =
        searchTerm
          .trim()
          .toLowerCase();


      if (!query) {

        return lorries;

      }


      return lorries.filter(
        (lorry) => {

          const registration =
            String(
              lorry.registration_number ||
              ""
            ).toLowerCase();


          const owner =
            String(
              lorry.owner_name ||
              ""
            ).toLowerCase();


          const model =
            String(
              lorry.model ||
              ""
            ).toLowerCase();


          const manager =
            String(
              lorry.lorry_manager_name ||
              ""
            ).toLowerCase();


          return (
            registration.includes(query) ||
            owner.includes(query) ||
            model.includes(query) ||
            manager.includes(query)
          );

        }
      );

    }, [
      lorries,
      searchTerm
    ]);


  // =====================================================
  // ASSIGNED MANAGER COUNT
  // =====================================================

  const assignedCount =
    lorries.filter(
      (lorry) =>
        Boolean(
          lorry.lorry_manager_name
        )
    ).length;


  // =====================================================
  // UNASSIGNED COUNT
  // =====================================================

  const unassignedCount =
    lorries.length -
    assignedCount;


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
                "Manager"
              }
            </UserName>


            <UserRole>
              MANAGER
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


              <CloseMenuButton
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                ×
              </CloseMenuButton>

            </SideMenuHeader>


            <SideMenuSubtitle>
              Manager Control Center
            </SideMenuSubtitle>


            <MenuDivider />


            <MenuItem
              onClick={() =>
                setMenuOpen(false)
              }
            >

              <MenuItemIcon>
                ▦
              </MenuItemIcon>


              <MenuItemContent>

                <MenuItemTitle>
                  Lorry Management
                </MenuItemTitle>


                <MenuItemText>
                  View and manage the fleet
                </MenuItemText>

              </MenuItemContent>

            </MenuItem>


            <MenuItem
              onClick={() =>
                navigate("/home")
              }
            >

              <MenuItemIcon>
                ⌂
              </MenuItemIcon>


              <MenuItemContent>

                <MenuItemTitle>
                  Home
                </MenuItemTitle>


                <MenuItemText>
                  Company overview
                </MenuItemText>

              </MenuItemContent>

            </MenuItem>


            <MenuDivider />


            <LogoutMenuItem
              onClick={logout}
            >

              <MenuItemIcon>
                ↪
              </MenuItemIcon>


              <MenuItemContent>

                <MenuItemTitle>
                  Logout
                </MenuItemTitle>


                <MenuItemText>
                  Sign out of your account
                </MenuItemText>

              </MenuItemContent>

            </LogoutMenuItem>


          </SideMenu>

        </>

      )}


      {/* =================================================
          HERO
      ================================================= */}

      <Hero>


        <HeroImage>

          <img
            src={LorryImage}
            alt="Sri Murugan drilling rig"
          />

        </HeroImage>


        <HeroOverlay />


        <HeroContent>

          <HeroEyebrow>
            FLEET MANAGEMENT
          </HeroEyebrow>


          <HeroTitle>

            Manage Your
            <br />

            Rig Operations.

          </HeroTitle>


          <HeroDescription>

            Monitor your company's drilling
            fleet, access individual lorries
            and manage field operations from
            one central platform.

          </HeroDescription>


          <HeroQuote>

            “25 Years of Experience.
            Built on Trust. Driven by Service.”

          </HeroQuote>


          <HeroSince>

            Since 2001 — Reliability at Every Depth.

          </HeroSince>

        </HeroContent>

      </Hero>


      {/* =================================================
          MAIN
      ================================================= */}

      <Main>


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <PageHeader>

          <PageHeaderContent>

            <PageEyebrow>
              MANAGEMENT CONSOLE
            </PageEyebrow>


            <PageTitle>
              Lorry Management
            </PageTitle>


            <PageDescription>

              View your fleet and access
              individual lorry operations.

            </PageDescription>

          </PageHeaderContent>


          <FleetStatus>

            <StatusDot />

            FLEET SYSTEM ONLINE

          </FleetStatus>

        </PageHeader>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <StatsGrid>


          <StatCard>

            <StatIcon>
              🚛
            </StatIcon>


            <StatContent>

              <StatLabel>
                TOTAL LORRIES
              </StatLabel>


              <StatValue>
                {lorries.length}
              </StatValue>


              <StatDescription>
                Registered in fleet
              </StatDescription>

            </StatContent>

          </StatCard>


          <StatCard>

            <StatIcon $green>
              ✓
            </StatIcon>


            <StatContent>

              <StatLabel>
                ASSIGNED
              </StatLabel>


              <StatValue>
                {assignedCount}
              </StatValue>


              <StatDescription>
                Managers assigned
              </StatDescription>

            </StatContent>

          </StatCard>


          <StatCard>

            <StatIcon $orange>
              ○
            </StatIcon>


            <StatContent>

              <StatLabel>
                AVAILABLE
              </StatLabel>


              <StatValue>
                {unassignedCount}
              </StatValue>


              <StatDescription>
                Awaiting assignment
              </StatDescription>

            </StatContent>

          </StatCard>


        </StatsGrid>


        {/* =================================================
            SEARCH
        ================================================= */}

        <SearchSection>


          <SearchHeader>

            <SearchHeaderContent>

              <SearchEyebrow>
                FLEET DIRECTORY
              </SearchEyebrow>


              <SearchTitle>
                Your Lorries
              </SearchTitle>

            </SearchHeaderContent>


            <FleetCount>

              {filteredLorries.length}

              {" "}

              {
                filteredLorries.length === 1
                  ? "Lorry"
                  : "Lorries"
              }

            </FleetCount>

          </SearchHeader>


          <SearchBoxWrapper>

            <SearchIcon>
              ⌕
            </SearchIcon>


            <SearchInput

              type="text"

              placeholder={
                "Search by registration, owner, model or manager..."
              }

              value={searchTerm}

              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }

            />


            {searchTerm && (

              <ClearSearch
                onClick={() =>
                  setSearchTerm("")
                }
              >
                ×
              </ClearSearch>

            )}

          </SearchBoxWrapper>

        </SearchSection>


        {/* =================================================
            LORRY LIST
        ================================================= */}

        <LorryList>


          {loading ? (

            <LoadingCard>

              <LoadingSpinner />


              <LoadingTitle>
                Loading fleet
              </LoadingTitle>


              <LoadingText>
                Retrieving lorry information...
              </LoadingText>

            </LoadingCard>

          ) : filteredLorries.length === 0 ? (

            <NoLorries>

              <NoLorryIcon>
                🚛
              </NoLorryIcon>


              <NoLorryTitle>
                No Lorries Found
              </NoLorryTitle>


              <NoLorryText>

                {searchTerm
                  ? "No lorry matches your search."
                  : "No lorries are currently available."
                }

              </NoLorryText>


              {searchTerm && (

                <ResetButton
                  onClick={() =>
                    setSearchTerm("")
                  }
                >
                  Clear Search
                </ResetButton>

              )}

            </NoLorries>

          ) : (

            filteredLorries.map(
              (lorry) => (

                <LorryCard
                  key={lorry.id}
                >


                  {/* IMAGE */}

                  <ImageContainer>

                    <img
                      src={LorryImage}
                      alt={
                        lorry.registration_number ||
                        "Lorry"
                      }
                    />


                    <ImageOverlay />


                    <CardStatus>

                      <StatusDot />

                      {
                        lorry.status ||
                        "ACTIVE"
                      }

                    </CardStatus>


                    <RegistrationOverlay>

                      <RegistrationLabel>
                        REGISTRATION
                      </RegistrationLabel>


                      <RegistrationNumber>

                        {
                          lorry.registration_number ||
                          "N/A"
                        }

                      </RegistrationNumber>

                    </RegistrationOverlay>

                  </ImageContainer>


                  {/* CARD BODY */}

                  <CardBody>


                    <CardEyebrow>
                      DRILLING RIG
                    </CardEyebrow>


                    <CardTitle>

                      {
                        lorry.model ||
                        "Rig Model"
                      }

                    </CardTitle>


                    <CardDetails>


                      <DetailRow>

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
                              "Unknown Owner"
                            }

                          </DetailValue>

                        </DetailContent>

                      </DetailRow>


                      <DetailRow>

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

                      </DetailRow>


                      <DetailRow>

                        <DetailIcon>
                          ◷
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

                      </DetailRow>


                    </CardDetails>


                    {/* MANAGER */}

                    <ManagerBox>

                      <ManagerIcon>
                        👥
                      </ManagerIcon>


                      <ManagerContent>

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


                        {lorry.lorry_manager_phone && (

                          <ManagerPhone>

                            {lorry.lorry_manager_phone}

                          </ManagerPhone>

                        )}

                      </ManagerContent>

                    </ManagerBox>


                    {/* OPEN BUTTON */}

                    <OpenButton
                      onClick={() =>
                        openLorry(
                          lorry.id
                        )
                      }
                    >

                      <span>
                        Open Lorry
                      </span>


                      <ButtonArrow>
                        →
                      </ButtonArrow>

                    </OpenButton>


                  </CardBody>

                </LorryCard>

              )
            )

          )}

        </LorryList>


        {/* =================================================
            SERVICE AREAS
        ================================================= */}

        <ServiceBanner>


          <ServiceContent>

            <ServiceEyebrow>
              OUR REACH
            </ServiceEyebrow>


            <ServiceTitle>
              Operating Across Regions
            </ServiceTitle>


            <ServiceDescription>

              Sri Murugan Rig Service has
              built its operations through
              years of field experience,
              serving drilling requirements
              across different regions and
              expanding into international
              markets.

            </ServiceDescription>


            <ServiceLocations>

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

            </ServiceLocations>

          </ServiceContent>


          <ServiceQuote>

            “Since 2001 —
            Reliability at Every Depth.”

          </ServiceQuote>

        </ServiceBanner>


      </Main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer>

        <FooterCompany>
          Sri Murugan Rig Service
        </FooterCompany>


        <FooterQuote>
          25 Years of Experience. Built on Trust. Driven by Service.
        </FooterQuote>


        <FooterSince>
          Since 2001
        </FooterSince>

      </Footer>


    </Page>

  );

};


export default ManagerPage;


// =====================================================
// PAGE
// =====================================================

const Page = styled.div`

  min-height: 100vh;

  background:
    radial-gradient(
      circle at 5% 10%,
      rgba(22,101,52,0.07),
      transparent 25%
    ),

    radial-gradient(
      circle at 95% 25%,
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

  backdrop-filter: blur(15px);

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

    transform:
      translateY(-50%)
      scale(1.03);

  }

`;


// =====================================================
// MENU LINE
// =====================================================

const MenuLine = styled.span`

  width: 24px;

  height: 3px;

  border-radius: 5px;

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

  width: 56px;

  height: 56px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 15px;

  background:
    #14532d;

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

const BrandText = styled.div`

  text-align: left;

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
// USER
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

const UserInfo = styled.div`

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
// SIDE MENU BACKDROP
// =====================================================

const MenuBackdrop = styled.div`

  position: fixed;

  inset: 0;

  z-index: 80;

  background:
    rgba(15,23,42,0.4);

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

  font-size: 22px;

  font-weight: 900;

`;


// =====================================================
// CLOSE
// =====================================================

const CloseMenuButton = styled.button`

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
// DIVIDER
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

`;


// =====================================================
// LOGOUT ITEM
// =====================================================

const LogoutMenuItem = styled(
  MenuItem
)`

  &:hover {

    background: #fef2f2;

  }

`;


// =====================================================
// MENU ICON
// =====================================================

const MenuItemIcon = styled.div`

  width: 48px;

  height: 48px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #f1f5f9;

  color: #166534;

  font-size: 20px;

`;


// =====================================================
// MENU CONTENT
// =====================================================

const MenuItemContent = styled.div`

  min-width: 0;

`;


// =====================================================
// MENU TITLE
// =====================================================

const MenuItemTitle = styled.div`

  color: #172554;

  font-size: 14px;

  font-weight: 900;

`;


// =====================================================
// MENU TEXT
// =====================================================

const MenuItemText = styled.div`

  margin-top: 3px;

  color: #94a3b8;

  font-size: 10px;

  font-weight: 600;

`;


// =====================================================
// HERO
// =====================================================

const Hero = styled.section`

  position: relative;

  max-width: 1650px;

  min-height: 470px;

  margin: 32px auto 55px;

  overflow: hidden;

  border-radius: 30px;

  background: #173b2a;

  box-shadow:
    0 25px 60px
    rgba(15,23,42,0.15);

`;


// =====================================================
// HERO IMAGE
// =====================================================

const HeroImage = styled.div`

  position: absolute;

  inset: 0;

  img {

    width: 100%;

    height: 100%;

    object-fit: cover;

    object-position: center;

  }

`;


// =====================================================
// HERO OVERLAY
// =====================================================

const HeroOverlay = styled.div`

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(8,30,19,0.96) 0%,
      rgba(13,55,35,0.85) 42%,
      rgba(13,55,35,0.42) 72%,
      rgba(13,55,35,0.1) 100%
    );

`;


// =====================================================
// HERO CONTENT
// =====================================================

const HeroContent = styled.div`

  position: relative;

  z-index: 2;

  max-width: 800px;

  padding: 70px;

`;


// =====================================================
// HERO EYEBROW
// =====================================================

const HeroEyebrow = styled.div`

  color: #bbf7d0;

  font-size: 11px;

  font-weight: 900;

  letter-spacing: 2.5px;

`;


// =====================================================
// HERO TITLE
// =====================================================

const HeroTitle = styled.h1`

  margin: 15px 0 0;

  color: #ffffff;

  font-size:
    clamp(48px, 6vw, 70px);

  line-height: 1.02;

  font-weight: 900;

  letter-spacing: -2px;

`;


// =====================================================
// HERO DESCRIPTION
// =====================================================

const HeroDescription = styled.p`

  max-width: 690px;

  margin: 23px 0 0;

  color: #dbece2;

  font-size: 17px;

  line-height: 1.75;

`;


// =====================================================
// HERO QUOTE
// =====================================================

const HeroQuote = styled.div`

  margin-top: 25px;

  padding-left: 16px;

  border-left:
    4px solid #86efac;

  color: #ecfdf5;

  font-size: 15px;

  font-weight: 800;

  font-style: italic;

`;


// =====================================================
// HERO SINCE
// =====================================================

const HeroSince = styled.div`

  margin-top: 10px;

  color: #a7f3d0;

  font-size: 12px;

  font-weight: 800;

`;


// =====================================================
// MAIN
// =====================================================

const Main = styled.main`

  max-width: 1650px;

  margin: 0 auto;

  padding:
    0 42px 65px;

`;


// =====================================================
// PAGE HEADER
// =====================================================

const PageHeader = styled.div`

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 25px;

  margin-bottom: 25px;

`;


// =====================================================
// PAGE HEADER CONTENT
// =====================================================

const PageHeaderContent = styled.div`

  min-width: 0;

`;


// =====================================================
// PAGE EYEBROW
// =====================================================

const PageEyebrow = styled.div`

  color: #3f6f5a;

  font-size: 11px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// PAGE TITLE
// =====================================================

const PageTitle = styled.h2`

  margin: 7px 0 0;

  color: #172554;

  font-size: 40px;

  font-weight: 900;

  letter-spacing: -1px;

`;


// =====================================================
// PAGE DESCRIPTION
// =====================================================

const PageDescription = styled.div`

  margin-top: 7px;

  color: #64748b;

  font-size: 15px;

`;


// =====================================================
// FLEET STATUS
// =====================================================

const FleetStatus = styled.div`

  display: flex;

  align-items: center;

  gap: 9px;

  padding:
    12px 16px;

  border:
    1px solid #bbf7d0;

  border-radius: 11px;

  background: #f0fdf4;

  color: #166534;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// STATUS DOT
// =====================================================

const StatusDot = styled.span`

  width: 9px;

  height: 9px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #22c55e;

  box-shadow:
    0 0 0 5px
    rgba(34,197,94,0.12);

`;


// =====================================================
// STATS
// =====================================================

const StatsGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 20px;

  margin-bottom: 48px;

`;


// =====================================================
// STAT CARD
// =====================================================

const StatCard = styled.div`

  display: flex;

  align-items: center;

  gap: 18px;

  min-height: 145px;

  padding: 25px;

  box-sizing: border-box;

  border:
    1px solid #dce7e1;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 9px 28px
    rgba(15,23,42,0.05);

`;


// =====================================================
// STAT ICON
// =====================================================

const StatIcon = styled.div`

  width: 62px;

  height: 62px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 16px;

  background:
    ${({ $green, $orange }) => {

      if ($green)
        return "#ecfdf5";

      if ($orange)
        return "#fff7ed";

      return "#eff6ff";

    }};

  color:
    ${({ $green, $orange }) => {

      if ($green)
        return "#166534";

      if ($orange)
        return "#c2410c";

      return "#1d4ed8";

    }};

  font-size: 25px;

`;


// =====================================================
// STAT CONTENT
// =====================================================

const StatContent = styled.div`

  min-width: 0;

`;


// =====================================================
// STAT LABEL
// =====================================================

const StatLabel = styled.div`

  color: #94a3b8;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.3px;

`;


// =====================================================
// STAT VALUE
// =====================================================

const StatValue = styled.div`

  margin-top: 4px;

  color: #172554;

  font-size: 34px;

  line-height: 1;

  font-weight: 900;

`;


// =====================================================
// STAT DESCRIPTION
// =====================================================

const StatDescription = styled.div`

  margin-top: 7px;

  color: #64748b;

  font-size: 11px;

`;


// =====================================================
// SEARCH SECTION
// =====================================================

const SearchSection = styled.section`

  margin-bottom: 28px;

`;


// =====================================================
// SEARCH HEADER
// =====================================================

const SearchHeader = styled.div`

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 17px;

`;


// =====================================================
// SEARCH HEADER CONTENT
// =====================================================

const SearchHeaderContent = styled.div`

  min-width: 0;

`;


// =====================================================
// SEARCH EYEBROW
// =====================================================

const SearchEyebrow = styled.div`

  color: #3f6f5a;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// SEARCH TITLE
// =====================================================

const SearchTitle = styled.h3`

  margin: 6px 0 0;

  color: #172554;

  font-size: 31px;

  font-weight: 900;

`;


// =====================================================
// FLEET COUNT
// =====================================================

const FleetCount = styled.div`

  color: #64748b;

  font-size: 12px;

  font-weight: 800;

`;


// =====================================================
// SEARCH BOX
// =====================================================

const SearchBoxWrapper = styled.div`

  position: relative;

  display: flex;

  align-items: center;

  min-height: 64px;

  border:
    1px solid #dce7e1;

  border-radius: 15px;

  background: #ffffff;

  box-shadow:
    0 8px 22px
    rgba(15,23,42,0.04);

`;


// =====================================================
// SEARCH ICON
// =====================================================

const SearchIcon = styled.div`

  width: 64px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #166534;

  font-size: 27px;

`;


// =====================================================
// SEARCH INPUT
// =====================================================

const SearchInput = styled.input`

  flex: 1;

  min-width: 0;

  height: 62px;

  border: none;

  outline: none;

  background: transparent;

  color: #172554;

  font-family: inherit;

  font-size: 15px;

  font-weight: 600;


  &::placeholder {

    color: #94a3b8;

  }

`;


// =====================================================
// CLEAR SEARCH
// =====================================================

const ClearSearch = styled.button`

  width: 45px;

  height: 45px;

  margin-right: 9px;

  border: none;

  border-radius: 10px;

  background: #f1f5f9;

  color: #64748b;

  font-size: 24px;

  cursor: pointer;

`;


// =====================================================
// LORRY LIST
// =====================================================

const LorryList = styled.div`

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 25px;

`;


// =====================================================
// LORRY CARD
// =====================================================

const LorryCard = styled.article`

  overflow: hidden;

  border:
    1px solid #dce7e1;

  border-radius: 23px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15,23,42,0.055);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;


  &:hover {

    transform:
      translateY(-6px);

    box-shadow:
      0 20px 42px
      rgba(15,23,42,0.1);

  }

`;


// =====================================================
// IMAGE
// =====================================================

const ImageContainer = styled.div`

  position: relative;

  height: 290px;

  overflow: hidden;

  img {

    width: 100%;

    height: 100%;

    object-fit: cover;

    transition:
      transform 0.4s ease;

  }


  ${LorryCard}:hover & img {

    transform:
      scale(1.04);

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
      rgba(8,25,17,0.9),
      rgba(8,25,17,0.03) 65%
    );

`;


// =====================================================
// CARD STATUS
// =====================================================

const CardStatus = styled.div`

  position: absolute;

  top: 18px;

  right: 18px;

  display: flex;

  align-items: center;

  gap: 7px;

  padding:
    9px 12px;

  border-radius: 9px;

  background:
    rgba(255,255,255,0.94);

  color: #166534;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// REGISTRATION OVERLAY
// =====================================================

const RegistrationOverlay = styled.div`

  position: absolute;

  left: 22px;

  bottom: 20px;

`;


// =====================================================
// REGISTRATION LABEL
// =====================================================

const RegistrationLabel = styled.div`

  color: #bbf7d0;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.6px;

`;


// =====================================================
// REGISTRATION NUMBER
// =====================================================

const RegistrationNumber = styled.div`

  margin-top: 4px;

  color: #ffffff;

  font-size:
    clamp(27px, 3vw, 38px);

  line-height: 1;

  font-weight: 900;

  letter-spacing: 1px;

  text-shadow:
    0 3px 12px
    rgba(0,0,0,0.35);

`;


// =====================================================
// CARD BODY
// =====================================================

const CardBody = styled.div`

  padding: 27px;

`;


// =====================================================
// CARD EYEBROW
// =====================================================

const CardEyebrow = styled.div`

  color: #3f6f5a;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.8px;

`;


// =====================================================
// CARD TITLE
// =====================================================

const CardTitle = styled.h3`

  margin: 7px 0 0;

  color: #172554;

  font-size: 26px;

  font-weight: 900;

`;


// =====================================================
// CARD DETAILS
// =====================================================

const CardDetails = styled.div`

  margin-top: 20px;

  padding-top: 7px;

  border-top:
    1px solid #eef2f7;

`;


// =====================================================
// DETAIL ROW
// =====================================================

const DetailRow = styled.div`

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 11px 0;

  border-bottom:
    1px solid #f1f5f9;

`;


// =====================================================
// DETAIL ICON
// =====================================================

const DetailIcon = styled.div`

  width: 39px;

  height: 39px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #f8faf9;

  color: #166534;

  font-size: 14px;

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

  color: #94a3b8;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// DETAIL VALUE
// =====================================================

const DetailValue = styled.div`

  margin-top: 3px;

  color: #172554;

  font-size: 13px;

  font-weight: 800;

  word-break: break-word;

`;


// =====================================================
// MANAGER BOX
// =====================================================

const ManagerBox = styled.div`

  display: flex;

  align-items: center;

  gap: 13px;

  margin-top: 17px;

  padding: 15px;

  border:
    1px solid #dce7e1;

  border-radius: 13px;

  background:
    #f8faf9;

`;


// =====================================================
// MANAGER ICON
// =====================================================

const ManagerIcon = styled.div`

  width: 45px;

  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  background: #ecfdf5;

  font-size: 18px;

`;


// =====================================================
// MANAGER CONTENT
// =====================================================

const ManagerContent = styled.div`

  min-width: 0;

`;


// =====================================================
// MANAGER LABEL
// =====================================================

const ManagerLabel = styled.div`

  color: #94a3b8;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// MANAGER NAME
// =====================================================

const ManagerName = styled.div`

  margin-top: 4px;

  color: #172554;

  font-size: 13px;

  font-weight: 900;

  word-break: break-word;

`;


// =====================================================
// MANAGER PHONE
// =====================================================

const ManagerPhone = styled.div`

  margin-top: 3px;

  color: #64748b;

  font-size: 10px;

`;


// =====================================================
// OPEN BUTTON
// =====================================================

const OpenButton = styled.button`

  width: 100%;

  min-height: 57px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 18px;

  padding:
    0 18px;

  border: none;

  border-radius: 12px;

  background:
    #172554;

  color: #ffffff;

  font-size: 13px;

  font-weight: 900;

  cursor: pointer;

  transition:
    all 0.2s ease;


  &:hover {

    background:
      #1e3a8a;

    transform:
      translateY(-2px);

  }

`;


// =====================================================
// BUTTON ARROW
// =====================================================

const ButtonArrow = styled.span`

  font-size: 21px;

`;


// =====================================================
// LOADING
// =====================================================

const LoadingCard = styled.div`

  grid-column:
    1 / -1;

  min-height: 430px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  border:
    1px solid #dce7e1;

  border-radius: 22px;

  background: #ffffff;

`;


// =====================================================
// LOADING SPINNER
// =====================================================

const LoadingSpinner = styled.div`

  width: 50px;

  height: 50px;

  border:
    4px solid #dcfce7;

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

  margin-top: 22px;

  color: #172554;

  font-size: 21px;

  font-weight: 900;

`;


// =====================================================
// LOADING TEXT
// =====================================================

const LoadingText = styled.div`

  margin-top: 7px;

  color: #94a3b8;

  font-size: 13px;

`;


// =====================================================
// NO LORRIES
// =====================================================

const NoLorries = styled.div`

  grid-column:
    1 / -1;

  min-height: 420px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 40px;

  border:
    1px dashed #cbd5e1;

  border-radius: 22px;

  background:
    rgba(255,255,255,0.75);

  text-align: center;

`;


// =====================================================
// NO LORRY ICON
// =====================================================

const NoLorryIcon = styled.div`

  width: 85px;

  height: 85px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 22px;

  background: #ecfdf5;

  font-size: 38px;

`;


// =====================================================
// NO LORRY TITLE
// =====================================================

const NoLorryTitle = styled.h3`

  margin: 20px 0 0;

  color: #172554;

  font-size: 27px;

  font-weight: 900;

`;


// =====================================================
// NO LORRY TEXT
// =====================================================

const NoLorryText = styled.p`

  margin: 10px 0 0;

  color: #64748b;

  font-size: 14px;

`;


// =====================================================
// RESET BUTTON
// =====================================================

const ResetButton = styled.button`

  margin-top: 20px;

  padding:
    12px 20px;

  border: none;

  border-radius: 10px;

  background: #172554;

  color: #ffffff;

  font-size: 12px;

  font-weight: 900;

  cursor: pointer;

`;


// =====================================================
// SERVICE BANNER
// =====================================================

const ServiceBanner = styled.section`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 45px;

  margin-top: 60px;

  padding: 42px;

  overflow: hidden;

  border-radius: 24px;

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
// SERVICE CONTENT
// =====================================================

const ServiceContent = styled.div`

  max-width: 900px;

`;


// =====================================================
// SERVICE EYEBROW
// =====================================================

const ServiceEyebrow = styled.div`

  color: #a7f3d0;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// SERVICE TITLE
// =====================================================

const ServiceTitle = styled.h3`

  margin: 8px 0 0;

  color: #ffffff;

  font-size: 32px;

  font-weight: 900;

`;


// =====================================================
// SERVICE DESCRIPTION
// =====================================================

const ServiceDescription = styled.p`

  margin: 12px 0 0;

  color: #dbece2;

  font-size: 14px;

  line-height: 1.75;

`;


// =====================================================
// SERVICE LOCATIONS
// =====================================================

const ServiceLocations = styled.div`

  display: flex;

  flex-wrap: wrap;

  gap: 9px;

  margin-top: 20px;

`;


// =====================================================
// LOCATION
// =====================================================

const Location = styled.span`

  padding:
    9px 13px;

  border:
    1px solid
    rgba(255,255,255,0.16);

  border-radius: 9px;

  background:
    rgba(255,255,255,0.07);

  color: #ecfdf5;

  font-size: 10px;

  font-weight: 800;

`;


// =====================================================
// SERVICE QUOTE
// =====================================================

const ServiceQuote = styled.div`

  max-width: 320px;

  padding-left: 20px;

  border-left:
    3px solid #86efac;

  color: #dcfce7;

  font-size: 16px;

  font-weight: 800;

  font-style: italic;

  line-height: 1.7;

`;


// =====================================================
// FOOTER
// =====================================================

const Footer = styled.footer`

  max-width: 1650px;

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

const ResponsiveStyle = styled.div`

  @media (max-width: 1250px) {

    ${LorryList} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

    }

  }


  @media (max-width: 950px) {

    ${StatsGrid} {

      grid-template-columns:
        1fr;

    }


    ${ServiceBanner} {

      flex-direction: column;

      align-items: flex-start;

    }


    ${ServiceQuote} {

      max-width: none;

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


    ${Hero} {

      margin:
        20px 15px 38px;

      min-height: 520px;

      border-radius: 22px;

    }


    ${HeroContent} {

      padding:
        55px 30px;

    }


    ${HeroTitle} {

      font-size: 47px;

    }


    ${Main} {

      padding:
        0 20px 50px;

    }


    ${PageHeader} {

      align-items: flex-start;

      flex-direction: column;

    }


    ${PageTitle} {

      font-size: 34px;

    }


    ${LorryList} {

      grid-template-columns:
        1fr;

    }


    ${SearchHeader} {

      align-items: flex-start;

      flex-direction: column;

    }


    ${ServiceBanner} {

      padding: 30px;

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


    ${HeroTitle} {

      font-size: 40px;

    }


    ${HeroDescription} {

      font-size: 14px;

    }


    ${ImageContainer} {

      height: 260px;

    }


    ${RegistrationNumber} {

      font-size: 30px;

    }


    ${CardBody} {

      padding: 23px;

    }


    ${CardTitle} {

      font-size: 23px;

    }


    ${ServiceTitle} {

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