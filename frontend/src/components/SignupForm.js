import React, { useState } from "react";
import axios from "axios";
import "./styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    userType: "",
  });

  const [error, setError] = useState("");

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
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <input
          type="number"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />

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

        <select name="userType" value={formData.userType} onChange={handleInputChange} required>
          <option value="" disabled>
            Select User Type
          </option>
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="lorry_manager">Lorry Manager</option>
        </select>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
