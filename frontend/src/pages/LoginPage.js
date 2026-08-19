import React, { useState } from "react";
import axios from "axios";
import {
  Snackbar,
  Container as MuiContainer,
} from "@mui/material";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import rigLogo from "../assets/images/rig_logo.jpg";

// =====================================================
// LOGIN PAGE
// =====================================================

const LoginPage = () => {
  // =====================================================
  // LOGIN DATA
  // =====================================================

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  // =====================================================
  // UI STATES
  // =====================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate();

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setLoginData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!loginData.identifier.trim()) {
      setError(
        "Please enter your email or phone number."
      );
      return;
    }

    if (!loginData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        loginData
      );

      const {
        token,
        message,
        user,
      } = response.data;

      if (!token || !user) {
        setError(
          "Invalid login response from server."
        );
        return;
      }

      // =================================================
      // STORE AUTH DATA
      // =================================================

      localStorage.setItem(
        "authToken",
        token
      );

      localStorage.setItem(
        "userId",
        user.id
      );

      localStorage.setItem(
        "userType",
        user.user_type
      );

      localStorage.setItem(
        "userName",
        user.name
      );

      // =================================================
      // REMEMBER ME
      // =================================================

      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "rememberMe"
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      const successMessage =
        message ||
        "Login successful.";

      setSuccess(successMessage);
      setOpenSnackbar(true);

      // =================================================
      // ROLE BASED NAVIGATION
      // =================================================

      setTimeout(() => {
        if (
          user.user_type === "owner"
        ) {
          navigate("/owner");

        } else if (
          user.user_type === "manager"
        ) {
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

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid credentials. Please try again."
      );

      setSuccess("");

    } finally {
      setLoading(false);
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
    <PageContainer>

      <LoginWrapper>

        {/* =================================================
            BRAND SIDE
        ================================================= */}

        <BrandSection>

          <BrandGlow />
          <BrandCircle />

          <BrandContent>

            {/* LOGO */}

            <LogoContainer>
              <Logo
                src={rigLogo}
                alt="Sri Murugan Rig Service"
              />
            </LogoContainer>


            {/* COMPANY NAME */}

            <CompanyName>
              Sri Murugan
              <br />
              Rig Service
            </CompanyName>


            {/* ESTABLISHED */}

            <Established>
              EST. 2001
            </Established>


            {/* MAIN TAGLINE */}

            <Tagline>
              25 Years of Experience.
              <br />
              Built on Trust. Driven by Service.
            </Tagline>


            {/* SECONDARY TAGLINE */}

            <SecondaryTagline>
              Since 2001 — Reliability at Every Depth.
            </SecondaryTagline>


            <BrandDivider />


            {/* DESCRIPTION */}

            <BrandDescription>
              Professional rig and drilling
              services built on reliability,
              experience and quality.
            </BrandDescription>


            {/* EXPERIENCE LINE */}

            <ExperienceLine>
              <ExperienceDot />
              <span>
                Serving with experience since 2001
              </span>
            </ExperienceLine>

          </BrandContent>

        </BrandSection>


        {/* =================================================
            LOGIN SIDE
        ================================================= */}

        <LoginSection>

          <LoginCard>

            {/* MOBILE BRAND */}

            <MobileBrand>

              <MobileLogo
                src={rigLogo}
                alt="Sri Murugan Rig Service"
              />

              <MobileCompanyName>
                Sri Murugan Rig Service
              </MobileCompanyName>

              <MobileEstablished>
                EST. 2001
              </MobileEstablished>

              <MobileTagline>
                25 Years of Experience.
                <br />
                Built on Trust. Driven by Service.
              </MobileTagline>

            </MobileBrand>


            {/* HEADER */}

            <LoginHeader>

              <LoginTitle>
                Welcome Back
              </LoginTitle>

              <LoginSubtitle>
                Sign in to continue to your account.
              </LoginSubtitle>

            </LoginHeader>


            {/* ERROR */}

            {error && (
              <MessageBox $error>

                <MessageIcon>
                  !
                </MessageIcon>

                <span>
                  {error}
                </span>

              </MessageBox>
            )}


            {/* SUCCESS */}

            {success && (
              <MessageBox>

                <MessageIcon>
                  ✓
                </MessageIcon>

                <span>
                  {success}
                </span>

              </MessageBox>
            )}


            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

              {/* IDENTIFIER */}

              <FormGroup>

                <InputLabel>
                  Email or Phone Number
                </InputLabel>

                <InputWrapper>

                  <InputIcon>
                    👤
                  </InputIcon>

                  <StyledInput
                    type="text"
                    name="identifier"
                    value={
                      loginData.identifier
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter your email or phone"
                    autoComplete="username"
                    required
                  />

                </InputWrapper>

              </FormGroup>


              {/* PASSWORD */}

              <FormGroup>

                <InputLabel>
                  Password
                </InputLabel>

                <InputWrapper>

                  <InputIcon>
                    🔒
                  </InputIcon>

                  <StyledInput
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      loginData.password
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <PasswordToggle
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    {showPassword
                      ? "🙈"
                      : "👁"}
                  </PasswordToggle>

                </InputWrapper>

              </FormGroup>


              {/* OPTIONS */}

              <FormOptions>

                <RememberMe>

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Remember me
                  </span>

                </RememberMe>


                <ForgotButton
                  type="button"
                  onClick={() =>
                    alert(
                      "Please contact the administrator to reset your password."
                    )
                  }
                >
                  Forgot password?
                </ForgotButton>

              </FormOptions>


              {/* LOGIN BUTTON */}

              <LoginButton
                type="submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <Arrow>
                      →
                    </Arrow>
                  </>
                )}

              </LoginButton>

            </form>


            {/* DIVIDER */}

            <Divider>
              <span>
                NEW USER?
              </span>
            </Divider>


            {/* SIGNUP */}

            <SignupText>

              <span>
                Don't have an account?
              </span>

              <SignupLink
                to="/signup"
              >
                Create account
              </SignupLink>

            </SignupText>


            {/* FOOTER */}

            <FooterText>
              © {new Date().getFullYear()} Sri Murugan Rig Service
            </FooterText>

          </LoginCard>

        </LoginSection>

      </LoginWrapper>


      {/* SNACKBAR */}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={
          handleCloseSnackbar
        }
        message={success}
      />

    </PageContainer>
  );
};


// =====================================================
// COLOR PALETTE
// =====================================================
//
// Deep Navy       : #082B45
// Primary Blue    : #006EAD
// Dark Blue       : #00527F
// Green           : #62C51C
// Bright Green    : #8BE047
// Light Background: #F5F9FC
// Text Navy       : #0B263D
// =====================================================


// =====================================================
// PAGE
// =====================================================

const PageContainer =
  styled(MuiContainer)`
    && {
      min-height: 100vh;
      width: 100%;
      max-width: none;

      padding: 24px;

      margin: 0;

      box-sizing: border-box;

      display: flex;
      align-items: center;
      justify-content: center;

      background:
        radial-gradient(
          circle at 8% 10%,
          rgba(
            98,
            197,
            28,
            0.10
          ),
          transparent 28%
        ),

        radial-gradient(
          circle at 92% 90%,
          rgba(
            0,
            110,
            173,
            0.16
          ),
          transparent 35%
        ),

        #082B45;

      @media (max-width: 600px) {
        padding: 12px;
      }
    }
  `;


// =====================================================
// WRAPPER
// =====================================================

const LoginWrapper =
  styled.div`
    width: 100%;
    max-width: 1050px;

    min-height: 650px;

    display: grid;

    grid-template-columns:
      0.95fr 1.05fr;

    overflow: hidden;

    border-radius: 24px;

    background:
      #ffffff;

    box-shadow:
      0 30px 70px
      rgba(
        0,
        0,
        0,
        0.35
      );

    @media (max-width: 850px) {
      grid-template-columns: 1fr;

      max-width: 500px;

      min-height: auto;
    }
  `;


// =====================================================
// BRAND SECTION
// =====================================================

const BrandSection =
  styled.div`
    position: relative;

    display: flex;
    align-items: center;

    padding: 55px;

    overflow: hidden;

    background:
      linear-gradient(
        145deg,
        #061C2C 0%,
        #082B45 45%,
        #006EAD 100%
      );

    color: #ffffff;

    @media (max-width: 850px) {
      display: none;
    }
  `;


// =====================================================
// BRAND GLOW
// =====================================================

const BrandGlow =
  styled.div`
    position: absolute;

    width: 360px;
    height: 360px;

    right: -160px;
    top: -160px;

    border-radius: 50%;

    background:
      radial-gradient(
        circle,
        rgba(
          98,
          197,
          28,
          0.16
        ),
        transparent 68%
      );

    pointer-events: none;
  `;


// =====================================================
// BRAND CIRCLE
// =====================================================

const BrandCircle =
  styled.div`
    position: absolute;

    width: 420px;
    height: 420px;

    right: -210px;
    bottom: -210px;

    border-radius: 50%;

    border:
      55px solid
      rgba(
        98,
        197,
        28,
        0.10
      );

    pointer-events: none;
  `;


// =====================================================
// BRAND CONTENT
// =====================================================

const BrandContent =
  styled.div`
    position: relative;

    z-index: 2;

    max-width: 400px;
  `;


// =====================================================
// LOGO CONTAINER
// =====================================================

const LogoContainer =
  styled.div`
    width: 150px;
    height: 110px;

    display: flex;

    align-items: center;
    justify-content: center;

    margin-bottom: 28px;

    padding: 8px;

    border-radius: 16px;

    background:
      #ffffff;

    box-shadow:
      0 12px 30px
      rgba(
        0,
        0,
        0,
        0.22
      );

    overflow: hidden;
  `;


// =====================================================
// LOGO
// =====================================================

const Logo =
  styled.img`
    width: 100%;
    height: 100%;

    object-fit: contain;

    display: block;
  `;


// =====================================================
// COMPANY NAME
// =====================================================

const CompanyName =
  styled.h1`
    margin: 0;

    font-size: 38px;

    line-height: 1.08;

    font-weight: 800;

    letter-spacing:
      -1px;

    color:
      #ffffff;
  `;


// =====================================================
// ESTABLISHED
// =====================================================

const Established =
  styled.div`
    display: inline-block;

    margin-top: 16px;

    padding:
      5px 10px;

    border-radius:
      5px;

    background:
      rgba(
        98,
        197,
        28,
        0.15
      );

    border:
      1px solid
      rgba(
        98,
        197,
        28,
        0.35
      );

    color:
      #8BE047;

    font-size:
      10px;

    font-weight:
      800;

    letter-spacing:
      1.5px;
  `;


// =====================================================
// TAGLINE
// =====================================================

const Tagline =
  styled.p`
    margin:
      16px 0 0;

    font-size:
      17px;

    line-height:
      1.5;

    font-weight:
      700;

    color:
      #7BD52F;

    letter-spacing:
      0.1px;
  `;


// =====================================================
// SECONDARY TAGLINE
// =====================================================

const SecondaryTagline =
  styled.p`
    margin:
      12px 0 0;

    color:
      rgba(
        255,
        255,
        255,
        0.75
      );

    font-size:
      13px;

    font-weight:
      500;

    font-style:
      italic;

    line-height:
      1.5;
  `;


// =====================================================
// BRAND DIVIDER
// =====================================================

const BrandDivider =
  styled.div`
    width:
      70px;

    height:
      4px;

    margin:
      28px 0;

    border-radius:
      10px;

    background:
      linear-gradient(
        90deg,
        #62C51C,
        #00A4E4
      );
  `;


// =====================================================
// BRAND DESCRIPTION
// =====================================================

const BrandDescription =
  styled.p`
    margin:
      0;

    max-width:
      360px;

    color:
      rgba(
        255,
        255,
        255,
        0.72
      );

    font-size:
      14px;

    line-height:
      1.7;
  `;


// =====================================================
// EXPERIENCE LINE
// =====================================================

const ExperienceLine =
  styled.div`
    display: flex;

    align-items: center;

    gap: 9px;

    margin-top: 24px;

    color:
      rgba(
        255,
        255,
        255,
        0.58
      );

    font-size:
      11px;

    font-weight:
      600;
  `;


const ExperienceDot =
  styled.span`
    width:
      7px;

    height:
      7px;

    border-radius:
      50%;

    background:
      #62C51C;

    box-shadow:
      0 0 0 4px
      rgba(
        98,
        197,
        28,
        0.10
      );
  `;


// =====================================================
// LOGIN SECTION
// =====================================================

const LoginSection =
  styled.div`
    display: flex;

    align-items: center;

    justify-content: center;

    padding:
      55px 65px;

    background:
      #ffffff;

    @media (max-width: 600px) {
      padding:
        35px 24px;
    }
  `;


// =====================================================
// LOGIN CARD
// =====================================================

const LoginCard =
  styled.div`
    width:
      100%;

    max-width:
      390px;
  `;


// =====================================================
// MOBILE BRAND
// =====================================================

const MobileBrand =
  styled.div`
    display:
      none;

    text-align:
      center;

    margin-bottom:
      32px;

    @media (max-width: 850px) {
      display:
        block;
    }
  `;


// =====================================================
// MOBILE LOGO
// =====================================================

const MobileLogo =
  styled.img`
    width:
      115px;

    height:
      80px;

    object-fit:
      contain;

    display:
      block;

    margin:
      0 auto 12px;
  `;


// =====================================================
// MOBILE COMPANY NAME
// =====================================================

const MobileCompanyName =
  styled.div`
    color:
      #0B263D;

    font-size:
      21px;

    font-weight:
      800;
  `;


// =====================================================
// MOBILE ESTABLISHED
// =====================================================

const MobileEstablished =
  styled.div`
    display:
      inline-block;

    margin-top:
      7px;

    padding:
      4px 9px;

    border-radius:
      5px;

    background:
      rgba(
        98,
        197,
        28,
        0.10
      );

    border:
      1px solid
      rgba(
        98,
        197,
        28,
        0.25
      );

    color:
      #4D961A;

    font-size:
      9px;

    font-weight:
      800;

    letter-spacing:
      1.5px;
  `;


// =====================================================
// MOBILE TAGLINE
// =====================================================

const MobileTagline =
  styled.div`
    margin-top:
      9px;

    color:
      #006EAD;

    font-size:
      12px;

    font-weight:
      600;

    line-height:
      1.5;
  `;


// =====================================================
// HEADER
// =====================================================

const LoginHeader =
  styled.div`
    margin-bottom:
      30px;
  `;


const LoginTitle =
  styled.h2`
    margin:
      0 0 8px;

    color:
      #0B263D;

    font-size:
      30px;

    font-weight:
      800;

    letter-spacing:
      -0.8px;
  `;


const LoginSubtitle =
  styled.p`
    margin:
      0;

    color:
      #647786;

    font-size:
      14px;
  `;


// =====================================================
// FORM
// =====================================================

const FormGroup =
  styled.div`
    margin-bottom:
      20px;
  `;


// =====================================================
// INPUT LABEL
// =====================================================

const InputLabel =
  styled.label`
    display:
      block;

    margin-bottom:
      8px;

    color:
      #334E61;

    font-size:
      13px;

    font-weight:
      700;
  `;


// =====================================================
// INPUT WRAPPER
// =====================================================

const InputWrapper =
  styled.div`
    position:
      relative;

    display:
      flex;

    align-items:
      center;
  `;


// =====================================================
// INPUT ICON
// =====================================================

const InputIcon =
  styled.span`
    position:
      absolute;

    left:
      15px;

    font-size:
      16px;

    z-index:
      1;

    pointer-events:
      none;
  `;


// =====================================================
// INPUT
// =====================================================

const StyledInput =
  styled.input`
    width:
      100%;

    height:
      52px;

    box-sizing:
      border-box;

    padding:
      0 45px;

    border:
      1px solid #D8E1E7;

    border-radius:
      11px;

    outline:
      none;

    background:
      #F8FAFC;

    color:
      #0B263D;

    font-size:
      14px;

    transition:
      all 0.2s ease;

    &::placeholder {
      color:
        #9AAAB5;
    }

    &:hover {
      border-color:
        #A9BBC7;
    }

    &:focus {
      border-color:
        #006EAD;

      background:
        #ffffff;

      box-shadow:
        0 0 0 4px
        rgba(
          0,
          110,
          173,
          0.10
        );
    }
  `;


// =====================================================
// PASSWORD TOGGLE
// =====================================================

const PasswordToggle =
  styled.button`
    position:
      absolute;

    right:
      10px;

    border:
      none;

    background:
      transparent;

    cursor:
      pointer;

    font-size:
      16px;

    padding:
      7px;

    border-radius:
      7px;

    &:hover {
      background:
        #EEF4F7;
    }
  `;


// =====================================================
// OPTIONS
// =====================================================

const FormOptions =
  styled.div`
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    margin:
      2px 0 24px;
  `;


// =====================================================
// REMEMBER ME
// =====================================================

const RememberMe =
  styled.label`
    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    color:
      #647786;

    font-size:
      13px;

    cursor:
      pointer;

    input {
      accent-color:
        #62C51C;
    }
  `;


// =====================================================
// FORGOT PASSWORD
// =====================================================

const ForgotButton =
  styled.button`
    border:
      none;

    background:
      transparent;

    color:
      #006EAD;

    font-size:
      13px;

    font-weight:
      600;

    cursor:
      pointer;

    &:hover {
      color:
        #00527F;

      text-decoration:
        underline;
    }
  `;


// =====================================================
// LOGIN BUTTON
// =====================================================

const LoginButton =
  styled.button`
    width:
      100%;

    height:
      52px;

    border:
      none;

    border-radius:
      11px;

    background:
      linear-gradient(
        135deg,
        #006EAD,
        #00527F
      );

    color:
      #ffffff;

    font-size:
      15px;

    font-weight:
      700;

    cursor:
      pointer;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      10px;

    box-shadow:
      0 8px 18px
      rgba(
        0,
        110,
        173,
        0.24
      );

    transition:
      all 0.2s ease;

    &:hover:not(:disabled) {
      transform:
        translateY(-1px);

      background:
        linear-gradient(
          135deg,
          #0079BD,
          #005A89
        );

      box-shadow:
        0 12px 24px
        rgba(
          0,
          110,
          173,
          0.30
        );
    }

    &:active:not(:disabled) {
      transform:
        translateY(0);
    }

    &:disabled {
      opacity:
        0.65;

      cursor:
        not-allowed;
    }
  `;


// =====================================================
// ARROW
// =====================================================

const Arrow =
  styled.span`
    font-size:
      19px;
  `;


// =====================================================
// SPINNER
// =====================================================

const Spinner =
  styled.span`
    width:
      16px;

    height:
      16px;

    border:
      2px solid
      rgba(
        255,
        255,
        255,
        0.4
      );

    border-top-color:
      #ffffff;

    border-radius:
      50%;

    animation:
      spin 0.7s
      linear infinite;

    @keyframes spin {
      to {
        transform:
          rotate(360deg);
      }
    }
  `;


// =====================================================
// MESSAGE BOX
// =====================================================

const MessageBox =
  styled.div`
    display:
      flex;

    align-items:
      center;

    gap:
      10px;

    margin-bottom:
      18px;

    padding:
      11px 13px;

    border-radius:
      9px;

    background:
      ${(props) =>
        props.$error
          ? "#FEF2F2"
          : "#F0FDF4"};

    border:
      1px solid
      ${(props) =>
        props.$error
          ? "#FECACA"
          : "#BBF7D0"};

    color:
      ${(props) =>
        props.$error
          ? "#DC2626"
          : "#16A34A"};

    font-size:
      12px;
  `;


// =====================================================
// MESSAGE ICON
// =====================================================

const MessageIcon =
  styled.span`
    width:
      20px;

    height:
      20px;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    flex-shrink:
      0;

    border-radius:
      50%;

    background:
      currentColor;

    color:
      #ffffff;

    font-size:
      11px;

    font-weight:
      800;
  `;


// =====================================================
// DIVIDER
// =====================================================

const Divider =
  styled.div`
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin:
      26px 0 20px;

    color:
      #94A3AE;

    font-size:
      9px;

    font-weight:
      700;

    &::before,
    &::after {
      content:
        "";

      flex:
        1;

      height:
        1px;

      background:
        #E0E7EC;
    }
  `;


// =====================================================
// SIGNUP TEXT
// =====================================================

const SignupText =
  styled.div`
    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      4px;

    color:
      #647786;

    font-size:
      13px;
  `;


// =====================================================
// SIGNUP LINK
// =====================================================

const SignupLink =
  styled(Link)`
    color:
      #006EAD;

    font-weight:
      700;

    text-decoration:
      none;

    &:hover {
      color:
        #00527F;

      text-decoration:
        underline;
    }
  `;


// =====================================================
// FOOTER
// =====================================================

const FooterText =
  styled.div`
    margin-top:
      28px;

    text-align:
      center;

    color:
      #9AAAB5;

    font-size:
      10px;
  `;


// =====================================================
// EXPORT
// =====================================================

export default LoginPage;