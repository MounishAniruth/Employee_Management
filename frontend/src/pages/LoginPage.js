import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", loginData);
      const { token, message } = response.data;

      // Store token in localStorage
      localStorage.setItem("authToken", token);

      // Display success message
      setSuccess(message);
      setError(""); // Clear any existing errors
    } catch (err) {
      // Handle error from backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
      setSuccess(""); // Clear any existing success messages
    }
      
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={loginData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleInputChange}
            required
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
