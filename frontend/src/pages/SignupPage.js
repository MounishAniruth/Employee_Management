import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@mui/material";
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
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
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
          <TextField
            label="Full Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email Address"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>User Type</InputLabel>
            <Select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              label="User Type"
            >
              <MenuItem value="" disabled>Select User Type</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="lorry_manager">Lorry Manager</MenuItem>
            </Select>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>

          <ButtonStyled type="submit" variant="contained" color="primary">
            Sign Up
          </ButtonStyled>
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
  max-width: 500px;
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

const ButtonStyled = styled(Button)`
  padding: 15px;
  margin: 20px 0;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #6a11cb;
  }
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
