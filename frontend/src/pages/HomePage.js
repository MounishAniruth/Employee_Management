import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LorryImage from "../assets/images/TN34K3749.jpeg";

const HomePage = () => {
  const STATIC_NAME = "Thangavelu";
  const STATIC_PHONE = "9443769338";

  const [lorries, setLorries] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [model, setModel] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLorries = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/lorry");
        setLorries(response.data);
        console.log("Lorries fetched:", response.data); // Debugging log
      } catch (error) {
        console.error("Error fetching lorries:", error);
        alert("Error fetching lorries. Please check the backend server.");
      }
    };
    fetchLorries();
  }, []);

  const handleAddLorry = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLorry = {
        registration_number: registrationNumber,
        owner_phone: ownerPhone,  // Ensure phone is passed to match the owner
        model,
        year_built: yearBuilt,
        owner_name: ownerName,
      };
      await axios.post("http://localhost:5001/api/lorry/add", newLorry);
      alert("Lorry added successfully");
      setIsFormVisible(false);
      const response = await axios.get("http://localhost:5001/api/lorry");
      setLorries(response.data);
    } catch (error) {
      console.error("Error adding lorry:", error);
      alert("Failed to add lorry");
    }
  };

  const handleDeleteLorry = async (registrationNumber) => {
    try {
      await axios.delete(`http://localhost:5001/api/lorry/${registrationNumber}`);
      alert("Lorry deleted successfully");
      setLorries(lorries.filter((lorry) => lorry.registration_number !== registrationNumber));
    } catch (error) {
      console.error("Error deleting lorry:", error);
      alert("Failed to delete lorry");
    }
  };

  const handleLorryClick = (id) => {
    console.log('Navigating to dashboard with registration number:', id);
    navigate(`/dashboard/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <Container>
      <Header>
        <CompanyName>Sri Murugan Rig Service</CompanyName>
        <OwnerInfo>
          <OwnerName>{STATIC_NAME}</OwnerName>
          <OwnerPhone>{STATIC_PHONE}</OwnerPhone>
        </OwnerInfo>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <AddLorryButton onClick={handleAddLorry}>
        {isFormVisible ? "Cancel" : "Add Lorry"}
      </AddLorryButton>

      {isFormVisible && (
        <AddLorryForm onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Registration Number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Owner Phone"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Year Built"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            required
          />
          <SubmitButton type="submit">Add Lorry</SubmitButton>
        </AddLorryForm>
      )}

      <LorryListContainer>
        {lorries.map((lorry) => (
          <LorryCard key={lorry.registration_number} onClick={() => handleLorryClick(lorry.id)}>
            {/* Display Owner Phone Number */}
            <OwnerPhoneText>{lorry.owner_phone || "Unknown Owner"}</OwnerPhoneText>
        
            <ImageContainer>
              <img src={LorryImage} alt="Lorry model TN34K3749" />
            </ImageContainer>
        
            <LorryDetails>
              <div>Owner Name: {lorry.owner_name}</div>
              <div>Registration: {lorry.registration_number}</div>
              <div>Model: {lorry.model}</div>
              <div>Year Built: {lorry.year_built}</div>
            </LorryDetails>
        
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteLorry(lorry.registration_number);
              }}
            >
              Delete
            </DeleteButton>
          </LorryCard>
        ))}
      </LorryListContainer>
    </Container>
  );
};

export default HomePage;

// Styled components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: #f9f9f9;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
  position: relative;
  flex-wrap: wrap;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
`;

const CompanyName = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0;
  flex-grow: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const OwnerInfo = styled.div`
  text-align: right;
  padding-right: 20px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-top: 10px;
    text-align: left;
  }
`;

const OwnerName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const OwnerPhone = styled.div`
  font-size: 1.2rem;
  color: #333;
  margin-top: 5px;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 20px;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
  }

  &:hover {
    background-color: #e57373;
  }
`;

const AddLorryButton = styled.button`
  padding: 12px 25px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 30px;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

const AddLorryForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 30px;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

const LorryListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
`;

const LorryCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;

const ImageContainer = styled.div`
  height: 220px;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 15px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LorryDetails = styled.div`
  font-size: 14px;
  color: #333;

  div {
    margin: 8px 0;
  }
`;

const OwnerPhoneText = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 10px;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;

  &:hover {
    background-color: #e57373;
  }
`;
