import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import styled from "styled-components";

const DashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to hold the lorry details
  const [lorry, setLorry] = useState(null);

  useEffect(() => {

    const fetchLorry = async () => {

      try {

        const response =
          await api.get(`/lorry/${id}`);

        setLorry(response.data);

      } catch (error) {

        console.error(
          "Error fetching lorry details:",
          error
        );

      }

    };

    fetchLorry();

  }, [id]);


  if (!lorry) {

    return (
      <LoadingMessage>
        Loading...
      </LoadingMessage>
    );

  }


  const handleEmployeePage = () => {
    navigate(`/employee/${id}`);
  };


  const handleFuelPage = () => {
    navigate(`/fuel/${id}`);
  };


  const handlePointDetailsPage = () => {
    navigate(`/point-details/${id}`);
  };


  return (
    <Container>

      {/* Top section */}
      <TopSection>

        <TopLeft>
          {lorry.registration_number}
        </TopLeft>

        <TopCenter>
          {lorry.owner_name}
        </TopCenter>

        <TopRight>
          {lorry.owner_phone}
        </TopRight>

      </TopSection>


      {/* Navigation buttons */}
      <NavigationContainer>

        <NavButton
          onClick={handleEmployeePage}
        >
          Employee
        </NavButton>

        <NavButton
          onClick={handleFuelPage}
        >
          Fuel
        </NavButton>

        <NavButton
          onClick={handlePointDetailsPage}
        >
          Point Details
        </NavButton>

      </NavigationContainer>

    </Container>
  );
};


// =========================
// STYLED COMPONENTS
// =========================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding-top: 60px;
`;


const LoadingMessage = styled.div`
  font-size: 2rem;
  color: #333;
  text-align: center;
`;


const TopSection = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 20px;

  background-color: #fff;
  border-bottom: 1px solid #ccc;

  z-index: 10;

  box-sizing: border-box;

  white-space: nowrap;
  overflow: hidden;
`;


const TopLeft = styled.div`
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;

  max-width: 33%;

  text-overflow: ellipsis;
  overflow: hidden;
`;


const TopCenter = styled.div`
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;

  flex-grow: 1;

  text-align: center;

  max-width: 33%;

  text-overflow: ellipsis;
  overflow: hidden;
`;


const TopRight = styled.div`
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;

  max-width: 33%;

  text-align: right;

  text-overflow: ellipsis;
  overflow: hidden;
`;


const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 100px;
`;


const NavButton = styled.button`
  padding: 15px 30px;

  margin: 10px;

  font-size: 1.2rem;

  background-color: #4caf50;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  width: 200px;

  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;


export default DashboardPage;