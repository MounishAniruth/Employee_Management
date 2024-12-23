import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Updated import


const HomePage = () => {
  const [lorries, setLorries] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [model, setModel] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const navigate = useNavigate();  // Updated to use navigate

  // Fetch lorries on initial load
  useEffect(() => {
    const fetchLorries = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/lorry');
        setLorries(response.data);
      } catch (error) {
        console.error('Error fetching lorries:', error);
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
      const newLorry = { registration_number: registrationNumber, owner_phone: ownerPhone, model, year_built: yearBuilt };
      await axios.post('http://localhost:5001/api/lorry/add', newLorry);
      alert('Lorry added successfully');
      setIsFormVisible(false);  // Hide form after submission
      // Fetch updated list of lorries
      const response = await axios.get('http://localhost:5001/api/lorry/');
      setLorries(response.data);
    } catch (error) {
      console.error('Error adding lorry:', error);
      alert('Failed to add lorry');
    }
  };

  const handleDeleteLorry = async (registrationNumber) => {
    try {
      // Send a DELETE request to remove the lorry
      await axios.delete(`http://localhost:5001/api/lorry/${registrationNumber}`);
      alert('Lorry deleted successfully');
      // Remove deleted lorry from UI
      setLorries(lorries.filter(lorry => lorry.registration_number !== registrationNumber));
    } catch (error) {
      console.error('Error deleting lorry:', error);
      alert('Failed to delete lorry');
    }
  };

  const handleCardClick = (registrationNumber) => {
    // Navigate to the dashboard page for the clicked lorry
    navigate(`/dashboard/${registrationNumber}`);  // Updated to use navigate
  };

  return (
    <Container>
      <Header>
        <CompanyName>Sri Murugan Rig Service</CompanyName>
        <OwnerInfo>
          <div>K Thangavelu</div>
          <div>9443769338</div>
        </OwnerInfo>
      </Header>

      <AddLorryButton onClick={handleAddLorry}>
        {isFormVisible ? 'Cancel' : 'Add Lorry'}
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
          <LorryCard key={lorry.registration_number} onClick={() => handleCardClick(lorry.registration_number)}>
            <LorryDetails>
              <div>Registration: {lorry.registration_number}</div>
              <div>Owner: {lorry.owner_phone}</div>
              <div>Model: {lorry.model}</div>
              <div>Year Built: {lorry.year_built}</div>
            </LorryDetails>
            <DeleteButton onClick={(e) => {
              e.stopPropagation(); // Prevent card click from firing
              handleDeleteLorry(lorry.registration_number);
            }}>
              Delete
            </DeleteButton>
          </LorryCard>
        ))}
      </LorryListContainer>
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CompanyName = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
`;

const OwnerInfo = styled.div`
  text-align: right;
  font-size: 1.2rem;
  font-weight: 500;
`;

const LorryCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  width: 30%;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 10px;
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const LorryDetails = styled.div`
  margin-bottom: 10px;
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
  gap: 20px;
`;
