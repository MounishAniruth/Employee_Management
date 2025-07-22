import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Snackbar, Typography, Container as MuiContainer } from "@mui/material";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
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
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/home");
      }, 500); // Navigate after showing success message
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
      setSuccess("");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <StyledContainer>
      <StyledCard>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email or Phone Number"
            variant="outlined"
            fullWidth
            name="identifier"
            value={loginData.identifier}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            type="password"
            value={loginData.password}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: 2 }}>
            Login
          </Button>
        </form>
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
            Sign Up
          </Link>
        </Typography>
      </StyledCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={success}
      />
    </StyledContainer>
  );
};

export default LoginPage;

// Styled Components
const StyledContainer = styled(MuiContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  height: 100%;
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
`;

const StyledCard = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 0.9rem;
  margin: 10px 0;
`;

const SuccessMessage = styled.p`
  color: #4caf50;
  font-size: 0.9rem;
  margin: 10px 0;
`;
