import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import LorryCard from "../components/LorryCard"; // Component to display lorries

const HomePage = () => {
  const [lorries, setLorries] = useState([]);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking for auth token
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      // Fetch user type from the server (optional, depends on your backend structure)
      axios
        .get("http://localhost:5001/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserType(response.data.userType); // Set the user type (owner, manager, or lorry manager)
        })
        .catch((error) => {
          console.error("Error fetching user type", error);
        });

      // Fetch lorries data from the backend
      axios
        .get("http://localhost:5001/api/lorries", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setLorries(response.data); // Set the lorries data from the backend
        })
        .catch((error) => {
          console.error("Error fetching lorries", error);
        });
    }
  }, [navigate]);

  return (
    <Container>
      <Header>
        <h1>Welcome to the Transport Management System</h1>
        <UserType>{userType && `Logged in as: ${userType}`}</UserType>
      </Header>
      <LorryList>
        {lorries.length > 0 ? (
          lorries.map((lorry) => (
            <LorryCard key={lorry.registrationNumber} lorry={lorry} />
          ))
        ) : (
          <p>No lorries available</p>
        )}
      </LorryList>
    </Container>
  );
};

export default HomePage;

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const UserType = styled.p`
  font-size: 16px;
  color: #555;
`;

const LorryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;
