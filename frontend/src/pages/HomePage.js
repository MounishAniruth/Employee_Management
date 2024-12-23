import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [lorries, setLorries] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [model, setModel] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [ownerName, setOwnerName] = useState("Thangavelu"); // Static name
  const [ownerPhoneHeader, setOwnerPhoneHeader] = useState("9443769338"); // Static phone number
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLorries = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/lorry");
        setLorries(response.data);
      } catch (error) {
        console.error("Error fetching lorries:", error.response ? error.response.data : error.message);
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
        owner_phone: ownerPhone,
        model,
        year_built: yearBuilt,
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
      await axios.delete(
        `http://localhost:5001/api/lorry/${registrationNumber}`
      );
      alert("Lorry deleted successfully");
      setLorries(
        lorries.filter(
          (lorry) => lorry.registration_number !== registrationNumber
        )
      );
    } catch (error) {
      console.error("Error deleting lorry:", error);
      alert("Failed to delete lorry");
    }
  };

  const handleLorryClick = (registrationNumber) => {
    navigate(`/dashboard/${registrationNumber}`);
  };

  return (
    <Container>
      <Header>
        <CompanyName>Sri Murugan Rig Service</CompanyName>
        <OwnerInfo>
          <OwnerName>{ownerName}</OwnerName>
          <OwnerPhone>{ownerPhoneHeader}</OwnerPhone>
        </OwnerInfo>
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
          <button type="submit">Add Lorry</button>
        </AddLorryForm>
      )}

      <LorryListContainer>
        {lorries.map((lorry) => (
          <LorryCard key={lorry.registration_number} onClick={() => handleLorryClick(lorry.registration_number)}>
            <OwnerName>{lorry.owner_phone || "Unknown Owner"}</OwnerName>
            <ImageContainer>
              <img
                src={
                  lorry.image_url
                    ? `path-to-assets-folder/${lorry.image_url}`
                    : "/assets/image/placeholder.png"
                }
                alt="Lorry"
              />
            </ImageContainer>
            <LorryDetails>
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
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
  position: relative;
  align-items: center;
`;

const CompanyName = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0;
  flex-grow: 1;
`;

const OwnerInfo = styled.div`
  text-align: right;
  padding-right: 10px;
`;

const OwnerName = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  font-weight: 500;
`;

const OwnerPhone = styled.div`
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
  margin-top: 5px;
`;

const AddLorryButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const AddLorryForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const LorryListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const LorryCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 10px;

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
    margin: 5px 0;
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    background-color: #e57373;
  }
`;
