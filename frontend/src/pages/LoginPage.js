import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import styled from "styled-components";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    identifier: "", // Changed from 'phone' to 'identifier'
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", loginData);
      const { token, message } = response.data;
  
      localStorage.setItem("authToken", token);
  
      setSuccess(message);
      setError("");
  
      // Navigate to the Home Page after successful login
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
      setSuccess("");
    }
  };  

  return (
    <Container>
      <Card>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="identifier" // Updated field name
            placeholder="Email or Phone Number"
            value={loginData.identifier}
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleInputChange}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <Button type="submit">Login</Button>
        </Form>

        <LinkText>
          Don't have an account? 
          <LinkButton onClick={() => navigate("/signup")}>Sign Up</LinkButton>
        </LinkText>
      </Card>
    </Container>
  );
};

export default LoginPage;


// Styled Components

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #6a11cb, #2575fc);
`;

const Card = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2575fc;
  }
`;

const Button = styled.button`
  padding: 15px;
  margin: 20px 0;
  background: #2575fc;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #6a11cb;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4c4c;
  font-size: 0.9rem;
  margin: 10px 0;
`;

const SuccessMessage = styled.p`
  color: #28a745;
  font-size: 0.9rem;
  margin: 10px 0;
`;

const LinkText = styled.p`
  font-size: 1rem;
  color: #555;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #2575fc;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;

  &:hover {
    color: #6a11cb;
  }
`;
