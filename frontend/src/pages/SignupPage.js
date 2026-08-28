import React, { useState } from "react";
import api from "../utils/api";
import {
  Snackbar,
  Container as MuiContainer,
} from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import rigLogo from "../assets/images/rig_logo.jpg";


// =====================================================
// SIGNUP PAGE
// =====================================================

const SignupPage = () => {
  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    userType: "",
  });

  // =====================================================
  // UI STATES
  // =====================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // HANDLE SIGNUP
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ===================================================
    // REQUIRED FIELD VALIDATION
    // ===================================================

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.userType
    ) {
      setError(
        "All fields are required."
      );
      return;
    }

    // ===================================================
    // NAME VALIDATION
    // ===================================================

    if (
      formData.name.trim().length < 2
    ) {
      setError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    // ===================================================
    // PHONE VALIDATION
    // ===================================================

    if (
      !/^\d{10}$/.test(
        formData.phone
      )
    ) {
      setError(
        "Phone number must be exactly 10 digits."
      );
      return;
    }

    // ===================================================
    // EMAIL VALIDATION
    // ===================================================

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    // ===================================================
    // PASSWORD VALIDATION
    // ===================================================

    if (
      formData.password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // SIGNUP API
      // =================================================

      const response = await api.post(
        "/auth/signup",
        formData
      );

      // =================================================
      // SUCCESS
      // =================================================

      const successMessage =
        response.data.message ||
        "Account created successfully.";

      setSuccess(
        successMessage
      );

      setError("");
      setOpenSnackbar(true);

      // =================================================
      // CLEAR FORM
      // =================================================

      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        userType: "",
      });

      // =================================================
      // REDIRECT
      // =================================================

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      console.error(
        "Signup error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again."
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

      <SignupWrapper>

        {/* =================================================
            BRAND SECTION
        ================================================= */}

        <BrandSection>

          <BrandOverlay />

          <BrandContent>

            {/* LOGO */}

            <LogoContainer>

              <Logo
  src={rigLogo}
  alt="Sri Murugan Rig Service"
/>

            </LogoContainer>


            {/* COMPANY */}

            <CompanyName>
              Sri Murugan
              <br />
              Rig Service
            </CompanyName>


            {/* TAGLINE */}

            <Tagline>
              Reliable Rig Service.
              <br />
              Trusted Every Depth.
            </Tagline>


            <BrandDivider />


            <BrandDescription>
              Professional rig and drilling
              services built on reliability,
              experience and quality.
            </BrandDescription>

          </BrandContent>

        </BrandSection>


        {/* =================================================
            SIGNUP SECTION
        ================================================= */}

        <SignupSection>

          <SignupCard>

            {/* MOBILE BRAND */}

            <MobileBrand>

              <MobileLogo
  src={rigLogo}
  alt="Sri Murugan Rig Service"
/>

              <MobileCompanyName>
                Sri Murugan Rig Service
              </MobileCompanyName>

              <MobileTagline>
                Reliable Rig Service.
                Trusted Every Depth.
              </MobileTagline>

            </MobileBrand>


            {/* HEADER */}

            <SignupHeader>

              <SignupTitle>
                Create Account
              </SignupTitle>

              <SignupSubtitle>
                Register your account to get started.
              </SignupSubtitle>

            </SignupHeader>


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
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* NAME */}

              <FormGroup>

                <InputLabel>
                  Full Name
                </InputLabel>

                <InputWrapper>

                  <InputIcon>
                    👤
                  </InputIcon>

                  <StyledInput
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </InputWrapper>

              </FormGroup>


              {/* PHONE + EMAIL */}

              <TwoColumnFields>

                <FormGroup>

                  <InputLabel>
                    Phone Number
                  </InputLabel>

                  <InputWrapper>

                    <InputIcon>
                      📱
                    </InputIcon>

                    <StyledInput
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="10 digit number"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      required
                    />

                  </InputWrapper>

                </FormGroup>


                <FormGroup>

                  <InputLabel>
                    Email Address
                  </InputLabel>

                  <InputWrapper>

                    <InputIcon>
                      ✉
                    </InputIcon>

                    <StyledInput
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />

                  </InputWrapper>

                </FormGroup>

              </TwoColumnFields>


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
                      formData.password
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
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

                <PasswordHint>
                  Minimum 6 characters
                </PasswordHint>

              </FormGroup>


              {/* USER TYPE */}

              <FormGroup>

                <InputLabel>
                  Account Type
                </InputLabel>

                <SelectWrapper>

                  <SelectIcon>
                    👥
                  </SelectIcon>

                  <StyledSelect
                    name="userType"
                    value={
                      formData.userType
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select account type
                    </option>

                    <option value="owner">
                      Owner
                    </option>

                    <option value="manager">
                      Manager
                    </option>

                    <option value="lorry_manager">
                      Lorry Manager
                    </option>

                  </StyledSelect>

                  <SelectArrow>
                    ▼
                  </SelectArrow>

                </SelectWrapper>

              </FormGroup>


              {/* SIGNUP BUTTON */}

              <SignupButton
                type="submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <Spinner />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <Arrow>
                      →
                    </Arrow>
                  </>
                )}

              </SignupButton>

            </form>


            {/* DIVIDER */}

            <Divider>
              <span>
                ALREADY REGISTERED?
              </span>
            </Divider>


            {/* LOGIN */}

            <LoginText>

              <span>
                Already have an account?
              </span>

              <LoginButton
                type="button"
                onClick={() =>
                  navigate("/login")
                }
              >
                Sign In
              </LoginButton>

            </LoginText>


            {/* FOOTER */}

            <FooterText>
              © {new Date().getFullYear()} Sri Murugan Rig Service
            </FooterText>

          </SignupCard>

        </SignupSection>

      </SignupWrapper>


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
          circle at 10% 10%,
          rgba(
            98,
            197,
            28,
            0.12
          ),
          transparent 30%
        ),

        radial-gradient(
          circle at 90% 90%,
          rgba(
            0,
            110,
            173,
            0.15
          ),
          transparent 35%
        ),

        #0B263D;

      @media (max-width: 600px) {
        padding: 12px;
      }
    }
  `;


// =====================================================
// WRAPPER
// =====================================================

const SignupWrapper =
  styled.div`
    width: 100%;

    max-width: 1100px;

    min-height: 690px;

    display: grid;

    grid-template-columns:
      0.95fr 1.05fr;

    overflow: hidden;

    border-radius: 24px;

    background: #ffffff;

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
// BRAND
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
        #071E30 0%,
        #0B3553 55%,
        #006EAD 100%
      );

    color: white;

    @media (max-width: 850px) {
      display: none;
    }
  `;


const BrandOverlay =
  styled.div`
    position: absolute;

    width: 420px;
    height: 420px;

    right: -200px;
    bottom: -200px;

    border-radius: 50%;

    border:
      60px solid
      rgba(
        98,
        197,
        28,
        0.12
      );

    pointer-events: none;
  `;


const BrandContent =
  styled.div`
    position: relative;

    z-index: 2;

    max-width: 400px;
  `;


// =====================================================
// LOGO
// =====================================================

const LogoContainer =
  styled.div`
    width: 150px;
    height: 110px;

    display: flex;

    align-items: center;
    justify-content: center;

    padding: 8px;

    margin-bottom: 28px;

    border-radius: 16px;

    background: #ffffff;

    box-shadow:
      0 12px 30px
      rgba(
        0,
        0,
        0,
        0.2
      );

    overflow: hidden;
  `;


const Logo =
  styled.img`
    width: 100%;
    height: 100%;

    object-fit: contain;

    display: block;
  `;


// =====================================================
// COMPANY
// =====================================================

const CompanyName =
  styled.h1`
    margin: 0;

    font-size: 38px;

    line-height: 1.08;

    font-weight: 800;

    letter-spacing:
      -1px;

    color: #ffffff;
  `;


const Tagline =
  styled.p`
    margin: 16px 0 0;

    font-size: 17px;

    line-height: 1.5;

    font-weight: 600;

    color: #7BD52F;
  `;


const BrandDivider =
  styled.div`
    width: 70px;

    height: 4px;

    margin:
      28px 0;

    border-radius: 10px;

    background:
      linear-gradient(
        90deg,
        #62C51C,
        #00A4E4
      );
  `;


const BrandDescription =
  styled.p`
    margin: 0;

    max-width: 360px;

    color:
      rgba(
        255,
        255,
        255,
        0.75
      );

    font-size: 14px;

    line-height: 1.7;
  `;


// =====================================================
// SIGNUP SECTION
// =====================================================

const SignupSection =
  styled.div`
    display: flex;

    align-items: center;

    justify-content: center;

    padding:
      40px 60px;

    background: #ffffff;

    @media (max-width: 600px) {
      padding:
        35px 24px;
    }
  `;


// =====================================================
// CARD
// =====================================================

const SignupCard =
  styled.div`
    width: 100%;

    max-width: 520px;
  `;


// =====================================================
// MOBILE BRAND
// =====================================================

const MobileBrand =
  styled.div`
    display: none;

    text-align: center;

    margin-bottom: 28px;

    @media (max-width: 850px) {
      display: block;
    }
  `;


const MobileLogo =
  styled.img`
    width: 115px;
    height: 80px;

    object-fit: contain;

    display: block;

    margin: 0 auto 12px;
  `;


const MobileCompanyName =
  styled.div`
    color: #0B263D;

    font-size: 21px;

    font-weight: 800;
  `;


const MobileTagline =
  styled.div`
    margin-top: 5px;

    color: #62A92B;

    font-size: 12px;

    font-weight: 600;
  `;


// =====================================================
// HEADER
// =====================================================

const SignupHeader =
  styled.div`
    margin-bottom: 27px;
  `;


const SignupTitle =
  styled.h2`
    margin: 0 0 8px;

    color: #0B263D;

    font-size: 30px;

    font-weight: 800;

    letter-spacing:
      -0.8px;
  `;


const SignupSubtitle =
  styled.p`
    margin: 0;

    color: #64748B;

    font-size: 14px;
  `;


// =====================================================
// FORM
// =====================================================

const FormGroup =
  styled.div`
    margin-bottom: 16px;
  `;


const TwoColumnFields =
  styled.div`
    display: grid;

    grid-template-columns:
      1fr 1fr;

    gap: 14px;

    @media (max-width: 600px) {
      grid-template-columns:
        1fr;

      gap: 0;
    }
  `;


const InputLabel =
  styled.label`
    display: block;

    margin-bottom: 7px;

    color: #334155;

    font-size: 12px;

    font-weight: 700;
  `;


const InputWrapper =
  styled.div`
    position: relative;

    display: flex;

    align-items: center;
  `;


const InputIcon =
  styled.span`
    position: absolute;

    left: 14px;

    font-size: 15px;

    z-index: 1;

    pointer-events: none;
  `;


const StyledInput =
  styled.input`
    width: 100%;

    height: 48px;

    box-sizing: border-box;

    padding:
      0 42px;

    border:
      1px solid #D9E1E8;

    border-radius: 11px;

    outline: none;

    background:
      #F8FAFC;

    color: #0F172A;

    font-size: 13px;

    transition:
      all 0.2s ease;

    &::placeholder {
      color: #94A3B8;
    }

    &:focus {
      border-color:
        #0078B8;

      background:
        #ffffff;

      box-shadow:
        0 0 0 4px
        rgba(
          0,
          120,
          184,
          0.1
        );
    }
  `;


// =====================================================
// PASSWORD
// =====================================================

const PasswordToggle =
  styled.button`
    position: absolute;

    right: 9px;

    border: none;

    background:
      transparent;

    cursor: pointer;

    font-size: 15px;

    padding: 7px;

    border-radius: 7px;

    &:hover {
      background:
        #EEF2F6;
    }
  `;


const PasswordHint =
  styled.div`
    margin-top: 5px;

    color: #94A3B8;

    font-size: 10px;
  `;


// =====================================================
// SELECT
// =====================================================

const SelectWrapper =
  styled.div`
    position: relative;
  `;


const SelectIcon =
  styled.span`
    position: absolute;

    left: 14px;

    top: 50%;

    transform:
      translateY(-50%);

    z-index: 1;

    pointer-events: none;
  `;


const StyledSelect =
  styled.select`
    width: 100%;

    height: 48px;

    box-sizing: border-box;

    appearance: none;

    -webkit-appearance: none;

    padding:
      0 40px;

    border:
      1px solid #D9E1E8;

    border-radius: 11px;

    outline: none;

    background:
      #F8FAFC;

    color: #334155;

    font-size: 13px;

    cursor: pointer;

    &:focus {
      border-color:
        #0078B8;

      background:
        #ffffff;

      box-shadow:
        0 0 0 4px
        rgba(
          0,
          120,
          184,
          0.1
        );
    }
  `;


const SelectArrow =
  styled.span`
    position: absolute;

    right: 14px;

    top: 50%;

    transform:
      translateY(-50%);

    font-size: 9px;

    color: #64748B;

    pointer-events: none;
  `;


// =====================================================
// SIGNUP BUTTON
// =====================================================

const SignupButton =
  styled.button`
    width: 100%;

    height: 52px;

    margin-top: 5px;

    border: none;

    border-radius: 11px;

    background:
      linear-gradient(
        135deg,
        #62B91F,
        #4E9E15
      );

    color: #ffffff;

    font-size: 14px;

    font-weight: 700;

    cursor: pointer;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 10px;

    box-shadow:
      0 8px 18px
      rgba(
        98,
        185,
        31,
        0.25
      );

    transition:
      all 0.2s ease;

    &:hover:not(:disabled) {
      transform:
        translateY(-1px);

      box-shadow:
        0 12px 24px
        rgba(
          98,
          185,
          31,
          0.32
        );
    }

    &:disabled {
      opacity: 0.65;

      cursor:
        not-allowed;
    }
  `;


const Arrow =
  styled.span`
    font-size: 19px;
  `;


// =====================================================
// SPINNER
// =====================================================

const Spinner =
  styled.span`
    width: 16px;
    height: 16px;

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

    border-radius: 50%;

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
// MESSAGES
// =====================================================

const MessageBox =
  styled.div`
    display: flex;

    align-items: center;

    gap: 10px;

    margin-bottom: 17px;

    padding:
      11px 13px;

    border-radius: 9px;

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

    font-size: 12px;
  `;


const MessageIcon =
  styled.span`
    width: 20px;
    height: 20px;

    display: flex;

    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border-radius: 50%;

    background:
      currentColor;

    color: #ffffff;

    font-size: 11px;

    font-weight: 800;
  `;


// =====================================================
// DIVIDER
// =====================================================

const Divider =
  styled.div`
    display: flex;

    align-items: center;

    gap: 12px;

    margin:
      24px 0 19px;

    color: #94A3B8;

    font-size: 9px;

    font-weight: 700;

    &::before,
    &::after {
      content: "";

      flex: 1;

      height: 1px;

      background:
        #E2E8F0;
    }
  `;


// =====================================================
// LOGIN
// =====================================================

const LoginText =
  styled.div`
    display: flex;

    align-items: center;

    justify-content: center;

    gap: 4px;

    color: #64748B;

    font-size: 13px;
  `;


const LoginButton =
  styled.button`
    border: none;

    background:
      transparent;

    color: #0078B8;

    font-size: 13px;

    font-weight: 700;

    cursor: pointer;

    &:hover {
      color: #005B8C;

      text-decoration:
        underline;
    }
  `;


// =====================================================
// FOOTER
// =====================================================

const FooterText =
  styled.div`
    margin-top: 27px;

    text-align: center;

    color: #A0AEC0;

    font-size: 10px;
  `;


// =====================================================
// EXPORT
// =====================================================

export default SignupPage;