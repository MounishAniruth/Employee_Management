import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import OwnerPage from "./pages/OwnerPage";
import ManagerPage from "./pages/ManagerPage";
import LorryManagerPage from "./pages/LorryManagerPage";

import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";
import FuelPage from "./pages/FuelPage";
import PointDetails from "./pages/PointDetails";


function App() {

  return (

    <Router>

      <Routes>

        {/* =================================================
            DEFAULT
        ================================================= */}

        <Route
          path="/"
          element={
            <Navigate to="/login" />
          }
        />


        {/* =================================================
            AUTH
        ================================================= */}

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* =================================================
            ROLE BASED HOME PAGES
        ================================================= */}

        <Route
          path="/owner"
          element={<OwnerPage />}
        />

        <Route
          path="/manager"
          element={<ManagerPage />}
        />

        <Route
          path="/lorry-manager"
          element={<LorryManagerPage />}
        />


        {/* =================================================
            LORRY MANAGEMENT
        ================================================= */}

        <Route
          path="/dashboard/:id"
          element={<DashboardPage />}
        />

        <Route
          path="/employee/:id"
          element={<EmployeePage />}
        />

        <Route
          path="/fuel/:lorryId"
          element={<FuelPage />}
        />

        <Route
          path="/point-details/:id"
          element={<PointDetails />}
        />

      </Routes>

    </Router>

  );

}

export default App;