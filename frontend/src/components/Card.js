import React from "react";
import styled from "styled-components";

const Card = ({ title, content }) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardContent>{content}</CardContent>
    </CardContainer>
  );
};

export default Card;

const CardContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardContent = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #333;
`;
