import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import styled from "styled-components";

import api from "../utils/api";

import LorryImage from "../assets/images/TN34K3749.jpeg";


const LorryManagerPage = () => {

  const navigate = useNavigate();


  const userName =
    localStorage.getItem("userName");


  const [lorry, setLorry] =
    useState(null);

  const [loading, setLoading] =
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

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <Container>

      <Header>

        <CompanyName>
          Sri Murugan Rig Service
        </CompanyName>


        <UserSection>

          <UserName>
            {userName ||
              "Lorry Manager"}
          </UserName>


          <UserRole>
            LORRY MANAGER
          </UserRole>


          <LogoutButton
            onClick={logout}
          >
            Logout
          </LogoutButton>

        </UserSection>

      </Header>


      <PageTitle>
        My Assigned Lorry
      </PageTitle>


      {loading ? (

        <LoadingText>
          Loading assigned lorry...
        </LoadingText>

      ) : !lorry ? (

        <NoLorry>

          No lorry has been assigned
          to you yet.

          <SmallText>
            Please contact the owner
            to assign a lorry.
          </SmallText>

        </NoLorry>

      ) : (

        <LorryCard>

          <ImageContainer>

            <img
              src={LorryImage}
              alt="Lorry"
            />

          </ImageContainer>


          <Details>

            <DetailRow>

              <strong>
                Registration:
              </strong>

              <span>
                {lorry.registration_number}
              </span>

            </DetailRow>


            <DetailRow>

              <strong>
                Owner:
              </strong>

              <span>
                {lorry.owner_name}
              </span>

            </DetailRow>


            <DetailRow>

              <strong>
                Owner Phone:
              </strong>

              <span>
                {lorry.owner_phone}
              </span>

            </DetailRow>


            <DetailRow>

              <strong>
                Model:
              </strong>

              <span>
                {lorry.model}
              </span>

            </DetailRow>


            <DetailRow>

              <strong>
                Year Built:
              </strong>

              <span>
                {lorry.year_built}
              </span>

            </DetailRow>


            <DetailRow>

              <strong>
                Status:
              </strong>

              <span>
                {lorry.status}
              </span>

            </DetailRow>

          </Details>


          {/* ============================================
              AVAILABLE MODULES
          ============================================ */}

          <ModuleSection>

            <ModuleTitle>
              Lorry Details
            </ModuleTitle>


            <ModuleButton
              onClick={openFuel}
            >
              Fuel Details
            </ModuleButton>


            <ModuleButton
              onClick={openPointDetails}
            >
              Point Details
            </ModuleButton>

          </ModuleSection>

        </LorryCard>

      )}

    </Container>
  );
};


export default LorryManagerPage;


// =====================================================
// STYLES
// =====================================================

const Container = styled.div`
  min-height: 100vh;

  padding: 30px;

  background-color: #f9f9f9;
`;


const Header = styled.div`
  display: flex;

  align-items: center;

  justify-content: center;

  position: relative;

  width: 100%;

  border-bottom: 1px solid #ddd;

  padding-bottom: 20px;
`;


const CompanyName = styled.h1`
  margin: 0;

  font-size: 3rem;

  color: #333;

  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;


const UserSection = styled.div`
  position: absolute;

  right: 0;

  top: 0;

  text-align: right;
`;


const UserName = styled.div`
  font-size: 1.4rem;

  font-weight: bold;

  color: #333;
`;


const UserRole = styled.div`
  font-size: 0.9rem;

  color: #666;

  margin-top: 5px;
`;


const LogoutButton = styled.button`
  margin-top: 10px;

  padding: 10px 20px;

  background-color: #f44336;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;


const PageTitle = styled.h2`
  text-align: center;

  margin-top: 30px;

  color: #333;
`;


const LorryCard = styled.div`
  width: 100%;

  max-width: 500px;

  margin: 40px auto;

  padding: 25px;

  background-color: white;

  border-radius: 12px;

  box-shadow:
    0 4px 15px
    rgba(0, 0, 0, 0.1);

  box-sizing: border-box;
`;


const ImageContainer = styled.div`
  width: 100%;

  height: 280px;

  overflow: hidden;

  border-radius: 10px;

  margin-bottom: 25px;

  img {
    width: 100%;

    height: 100%;

    object-fit: cover;
  }
`;


const Details = styled.div`
  margin-top: 10px;
`;


const DetailRow = styled.div`
  display: flex;

  justify-content: space-between;

  gap: 20px;

  padding: 12px 0;

  border-bottom: 1px solid #eee;

  color: #333;

  span {
    text-align: right;
  }
`;


const ModuleSection = styled.div`
  margin-top: 30px;

  padding-top: 20px;

  border-top: 1px solid #ddd;
`;


const ModuleTitle = styled.h3`
  text-align: center;

  margin-bottom: 20px;

  color: #333;
`;


const ModuleButton = styled.button`
  display: block;

  width: 100%;

  padding: 14px;

  margin-top: 12px;

  background-color: #2196f3;

  color: white;

  border: none;

  border-radius: 6px;

  cursor: pointer;

  font-size: 16px;

  &:hover {
    background-color: #1976d2;
  }
`;


const LoadingText = styled.div`
  text-align: center;

  font-size: 20px;

  color: #555;

  margin-top: 60px;
`;


const NoLorry = styled.div`
  width: 90%;

  max-width: 500px;

  margin: 60px auto;

  padding: 40px 25px;

  background-color: white;

  border-radius: 12px;

  text-align: center;

  font-size: 20px;

  color: #555;

  box-shadow:
    0 4px 12px
    rgba(0, 0, 0, 0.08);
`;


const SmallText = styled.div`
  margin-top: 15px;

  font-size: 15px;

  color: #888;
`;