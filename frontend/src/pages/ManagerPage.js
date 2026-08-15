import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import api from "../utils/api";
import LorryImage from "../assets/images/TN34K3749.jpeg";

const ManagerPage = () => {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName");

  const [lorries, setLorries] = useState([]);
  const [loading, setLoading] = useState(false);


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");

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

        setLorries(response.data);

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

    // logout is intentionally omitted because
    // this effect only needs to run when the page loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // =====================================================
  // OPEN LORRY
  // =====================================================

  const openLorry = (lorryId) => {
    navigate(
      `/dashboard/${lorryId}`
    );
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

        <CompanyName>
          Sri Murugan Rig Service
        </CompanyName>

        <UserSection>

          <UserName>
            {userName || "Manager"}
          </UserName>

          <UserRole>
            MANAGER
          </UserRole>

          <LogoutButton
            onClick={logout}
          >
            Logout
          </LogoutButton>

        </UserSection>

      </Header>


      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <PageTitle>
        Lorry Management
      </PageTitle>


      {/* =================================================
          LORRY LIST
      ================================================= */}

      <LorryList>

        {loading ? (

          <LoadingText>
            Loading lorries...
          </LoadingText>

        ) : lorries.length === 0 ? (

          <NoLorries>
            No lorries available.
          </NoLorries>

        ) : (

          lorries.map((lorry) => (

            <LorryCard
              key={lorry.id}
            >

              <CardContent>

                <OwnerPhone>
                  {lorry.owner_phone ||
                    "Unknown Owner"}
                </OwnerPhone>


                <ImageContainer>

                  <img
                    src={LorryImage}
                    alt="Lorry"
                  />

                </ImageContainer>


                <Details>

                  <div>
                    <strong>
                      Owner:
                    </strong>{" "}
                    {lorry.owner_name ||
                      "Unknown"}
                  </div>


                  <div>
                    <strong>
                      Registration:
                    </strong>{" "}
                    {lorry.registration_number}
                  </div>


                  <div>
                    <strong>
                      Model:
                    </strong>{" "}
                    {lorry.model}
                  </div>


                  <div>
                    <strong>
                      Year Built:
                    </strong>{" "}
                    {lorry.year_built}
                  </div>


                  <ManagerInfo>

                    <strong>
                      Lorry Manager:
                    </strong>{" "}

                    {lorry.lorry_manager_name
                      ? `${lorry.lorry_manager_name} (${lorry.lorry_manager_phone})`
                      : "Not Assigned"}

                  </ManagerInfo>

                </Details>


                <OpenButton
                  onClick={() =>
                    openLorry(lorry.id)
                  }
                >
                  Open Lorry
                </OpenButton>

              </CardContent>

            </LorryCard>

          ))

        )}

      </LorryList>

    </Container>
  );
};


export default ManagerPage;


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


const LorryList = styled.div`
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 30px;

  margin-top: 40px;
`;


const LorryCard = styled.div`
  width: 320px;

  padding: 20px;

  border: 1px solid #ddd;

  border-radius: 12px;

  background-color: white;

  box-shadow:
    0 4px 12px
    rgba(0, 0, 0, 0.1);
`;


const CardContent = styled.div`
  text-align: center;
`;


const OwnerPhone = styled.div`
  font-size: 16px;

  font-weight: bold;

  color: #4caf50;

  margin-bottom: 10px;
`;


const ImageContainer = styled.div`
  width: 100%;

  height: 220px;

  overflow: hidden;

  border-radius: 10px;

  margin-bottom: 15px;

  img {
    width: 100%;

    height: 100%;

    object-fit: cover;
  }
`;


const Details = styled.div`
  font-size: 14px;

  color: #333;

  div {
    margin: 8px 0;
  }
`;


const ManagerInfo = styled.div`
  padding-top: 8px;

  border-top: 1px solid #eee;
`;


const OpenButton = styled.button`
  width: 100%;

  margin-top: 15px;

  padding: 12px;

  background-color: #2196f3;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  font-size: 15px;

  &:hover {
    background-color: #1976d2;
  }
`;


const LoadingText = styled.div`
  font-size: 20px;

  color: #555;

  margin-top: 50px;
`;


const NoLorries = styled.div`
  font-size: 20px;

  color: #555;

  margin-top: 50px;
`;