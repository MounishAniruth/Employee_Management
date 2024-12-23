import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import styled from "styled-components";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    userType: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
  
    if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.userType) {
      setError("All fields are required!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5001/api/auth/signup", formData);
      alert(response.data.message);
  
      // Navigate to the Home Page after successful signup
      navigate("/home");
  
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        userType: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong! Please try again.");
    }
  };
  

  return (
    <Container>
      <Card>
        <Title>Sign Up</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Select
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select User Type</option>
            <option value="owner">Owner</option>
            <option value="manager">Manager</option>
            <option value="lorry_manager">Lorry Manager</option>
          </Select>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit">Sign Up</Button>
        </Form>

        <LinkText>
          Already have an account? 
          <LinkButton onClick={() => navigate("/login")}>Login</LinkButton>
        </LinkText>
      </Card>
    </Container>
  );
};

export default SignupPage;

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

const Select = styled.select`
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
