import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";  // Import the EmployeePage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard/:registrationNumber" element={<DashboardPage />} />
        
        {/* Add the route for EmployeePage */}
        <Route path="/employee/:registrationNumber" element={<EmployeePage />} />
        </Routes>
    </Router>
  );
}

export default App;
