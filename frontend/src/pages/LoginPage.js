import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Snackbar,
  Typography,
  Container as MuiContainer
} from "@mui/material";
import styled from "styled-components";
import { Link } from "react-router-dom";


const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });


  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [openSnackbar, setOpenSnackbar] =
    useState(false);


  const navigate = useNavigate();


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setLoginData({
      ...loginData,
      [name]: value
    });

  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      const response =
        await axios.post(
          "http://localhost:5001/api/auth/login",
          loginData
        );


      const {
        token,
        message,
        user
      } = response.data;


      // =================================================
      // VALIDATE LOGIN RESPONSE
      // =================================================

      if (!token || !user) {

        setError(
          "Invalid login response from server."
        );

        setSuccess("");

        return;

      }


      // =================================================
      // SAVE AUTHENTICATION DATA
      // =================================================

      localStorage.setItem(
        "authToken",
        token
      );


      // IMPORTANT:
      // Save the logged-in user's ID.
      //
      // Example:
      // Joshitha -> userId = 16
      //
      // This can be used by the frontend when
      // checking the currently assigned lorry.

      localStorage.setItem(
        "userId",
        user.id
      );


      // =================================================
      // SAVE USER ROLE
      // =================================================

      localStorage.setItem(
        "userType",
        user.user_type
      );


      // =================================================
      // SAVE USER NAME
      // =================================================

      localStorage.setItem(
        "userName",
        user.name
      );


      console.log(
        "Login successful"
      );

      console.log(
        "User ID:",
        user.id
      );

      console.log(
        "User Type:",
        user.user_type
      );

      console.log(
        "User Name:",
        user.name
      );


      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      setSuccess(
        message ||
        "Login successful!"
      );

      setError("");

      setOpenSnackbar(true);


      // =================================================
      // GO TO HOME
      // =================================================

setTimeout(() => {

  if (user.user_type === "owner") {

    navigate("/owner");

  } else if (user.user_type === "manager") {

    navigate("/manager");

  } else if (
    user.user_type === "lorry_manager"
  ) {

    navigate("/lorry-manager");

  } else {

    navigate("/login");

  }

}, 500);


    } catch (err) {

      console.error(
        "Login error:",
        err
      );


      if (
        err.response?.data?.message
      ) {

        setError(
          err.response.data.message
        );

      } else {

        setError(
          "An error occurred during login. Please try again."
        );

      }


      setSuccess("");

    }

  };


  // =====================================================
  // CLOSE SNACKBAR
  // =====================================================

  const handleCloseSnackbar = () => {

    setOpenSnackbar(false);

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <StyledContainer>

      <StyledCard>

        <Typography
          variant="h4"
          gutterBottom
        >

          Login

        </Typography>


        <form
          onSubmit={handleSubmit}
        >


          {/* ============================================
              EMAIL / PHONE
          ============================================ */}

          <TextField

            label="Email or Phone Number"

            variant="outlined"

            fullWidth

            name="identifier"

            value={
              loginData.identifier
            }

            onChange={
              handleInputChange
            }

            required

            margin="normal"

          />


          {/* ============================================
              PASSWORD
          ============================================ */}

          <TextField

            label="Password"

            variant="outlined"

            fullWidth

            name="password"

            type="password"

            value={
              loginData.password
            }

            onChange={
              handleInputChange
            }

            required

            margin="normal"

          />


          {/* ============================================
              ERROR
          ============================================ */}

          {error && (

            <ErrorMessage>

              {error}

            </ErrorMessage>

          )}


          {/* ============================================
              SUCCESS
          ============================================ */}

          {success && (

            <SuccessMessage>

              {success}

            </SuccessMessage>

          )}


          {/* ============================================
              LOGIN BUTTON
          ============================================ */}

          <Button

            variant="contained"

            color="primary"

            fullWidth

            type="submit"

            sx={{
              marginTop: 2
            }}

          >

            Login

          </Button>


        </form>


        {/* ==============================================
            SIGN UP
        ============================================== */}

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            marginTop: 2
          }}
        >

          Don't have an account?{" "}

          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "#1976d2"
            }}
          >

            Sign Up

          </Link>

        </Typography>


      </StyledCard>


      {/* =================================================
          SNACKBAR
      ================================================= */}

      <Snackbar

        open={
          openSnackbar
        }

        autoHideDuration={
          3000
        }

        onClose={
          handleCloseSnackbar
        }

        message={
          success
        }

      />


    </StyledContainer>

  );

};


export default LoginPage;


// =====================================================
// STYLED COMPONENTS
// =====================================================

const StyledContainer =
  styled(MuiContainer)`

    display: flex;

    justify-content: center;

    align-items: center;

    min-height: 100vh;

    background:
      linear-gradient(
        to right,
        #6a11cb,
        #2575fc
      );

    height: 100%;

    margin: 0;

    padding: 0;

  `;


const StyledCard =
  styled.div`

    background: #fff;

    padding: 40px;

    border-radius: 10px;

    box-shadow:
      0 10px 30px
      rgba(0, 0, 0, 0.1);

    width: 100%;

    max-width: 400px;

    text-align: center;

  `;


const ErrorMessage =
  styled.p`

    color: #f44336;

    font-size: 0.9rem;

    margin: 10px 0;

  `;


const SuccessMessage =
  styled.p`

    color: #4caf50;

    font-size: 0.9rem;

    margin: 10px 0;

  `;