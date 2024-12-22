import React, { useState } from "react";
import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css"; // You can uncomment this if you're using bootstrap
import "../styles/Signup.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    userType: "",
  });

  const [error, setError] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error message before submitting

    // Validate form fields
    if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.userType) {
      setError("All fields are required!");
      return;
    }

    try {
      // Make API call to signup endpoint
      const response = await axios.post("http://localhost:5001/api/auth/signup", formData);
      alert(response.data.message);

      // Clear form after successful submission
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        userType: "",
      });
    } catch (err) {
      // Handle errors and display appropriate message
      setError(
        err.response?.data?.message || "Something went wrong! Please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
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
          <select
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select User Type
            </option>
            <option value="owner">Owner</option>
            <option value="manager">Manager</option>
            <option value="lorry_manager">Lorry Manager</option>
          </select>

          {/* Error message display */}
          {error && <p className="error-message">{error}</p>}

          {/* Sign Up button */}
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
