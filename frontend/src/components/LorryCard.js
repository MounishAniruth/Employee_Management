import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LorryCard = ({ lorry }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to dashboard page when clicking on a lorry
    navigate(`/dashboard/${lorry.registrationNumber}`);
  };

  return (
    <Card onClick={handleClick}>
      <h3>{lorry.registrationNumber}</h3>
      <p>{lorry.model}</p>
    </Card>
  );
};

export default LorryCard;

// Styled Components
const Card = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  text-align: center;
  width: 200px;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
  }

  p {
    color: #777;
  }
`;
