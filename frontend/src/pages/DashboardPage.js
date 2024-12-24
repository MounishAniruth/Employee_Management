import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const DashboardPage = () => {
  const { registrationNumber } = useParams();
  const navigate = useNavigate();

  // State to hold the lorry details
  const [lorry, setLorry] = useState(null);

  useEffect(() => {
    // Fetch lorry details when the component mounts
    const fetchLorry = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/lorry/${registrationNumber}`);
        setLorry(response.data); // Set the fetched lorry data
      } catch (error) {
        console.error("Error fetching lorry details:", error);
      }
    };

    fetchLorry();
  }, [registrationNumber]); // Dependency on registrationNumber to refetch if it changes

  if (!lorry) {
    return <LoadingMessage>Loading...</LoadingMessage>; // Show loading message while fetching lorry details
  }

  const handleEmployeePage = () => {
    navigate(`/employee/${registrationNumber}`);
  };

  const handleFuelPage = () => {
    navigate(`/fuel/${registrationNumber}`);
  };

  const handlePointDetailsPage = () => {
    navigate(`/point-details/${registrationNumber}`);
  };

  return (
    <Container>
      {/* Top section with the owner's name, registration number, and phone */}
      <TopSection>
        <TopLeft>{lorry.registration_number}</TopLeft>
        <TopCenter>{lorry.owner_name}</TopCenter>
        <TopRight>{lorry.owner_phone}</TopRight>
      </TopSection>

      {/* Navigation buttons for Employee, Fuel, and Point Details */}
      <NavigationContainer>
        <NavButton onClick={handleEmployeePage}>Employee</NavButton>
        <NavButton onClick={handleFuelPage}>Fuel</NavButton>
        <NavButton onClick={handlePointDetailsPage}>Point Details</NavButton>
      </NavigationContainer>
    </Container>
  );
};

// Styled components for styling the dashboard page

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding-top: 60px; /* Ensure the content is not hidden behind the fixed header */
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
  box-sizing: border-box; /* Ensure padding doesn’t affect width */
  white-space: nowrap; /* Prevent text wrapping in the section */
  overflow: hidden; /* Hide overflow text */
`;

const TopLeft = styled.div`
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
  max-width: 33%; /* Limit width for proper layout */
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
  margin-top: 100px; /* To avoid overlap with the top section */
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
