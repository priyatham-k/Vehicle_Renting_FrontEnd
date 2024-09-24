import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Customerdashboard = lazy(() => import("./components/Customerdashboard"));
const Ownerdashboard = lazy(() => import("./components/Ownerdashboard"));
const VehicleDetails = lazy(() => import("./components/VehicleDetails"));
function App() {const [vehicles, setVehicles] = useState([]);  // Fetch the vehicles data
useEffect(() => {
  async function fetchVehicles() {
    try {
      const response = await axios.get("http://localhost:3001/api/customers/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  }
  fetchVehicles();
}, []);
  return (
    <div className="appStyle">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/customerdashboard" element={<Customerdashboard />} />
            <Route path="/vehicle/:id" element={<VehicleDetails vehicles={vehicles} />} />
            <Route path="/ownerdashboard" element={<Ownerdashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
