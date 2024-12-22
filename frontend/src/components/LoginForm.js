import React, { useState } from "react";
import axios from "axios";
import "./styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
