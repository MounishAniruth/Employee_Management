import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate fields
    if (!formData.identifier || !formData.password) {
      setError("Both fields are required!");
      return;
    }

    try {
      // Login API
      const response = await api.post(
        "/auth/login",
        {
          identifier: formData.identifier,
          password: formData.password,
        }
      );

      // Save JWT token
      localStorage.setItem(
        "authToken",
        response.data.token
      );

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert(response.data.message);

      // Navigate to Home page
      navigate("/home");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
        "Invalid credentials!"
      );
    }
  };

  return (
    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleSubmit}
      >

        <h2>Login</h2>

        <input
          type="text"
          name="identifier"
          placeholder="Email or Phone Number"
          value={formData.identifier}
          onChange={handleInputChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
};

export default Login;