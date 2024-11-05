import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Customerdashboard = lazy(() => import("./components/Customerdashboard"));
const Ownerdashboard = lazy(() => import("./components/Ownerdashboard"));
const VehicleDetails = lazy(() => import("./components/VehicleDetails"));
function App() {
  return (
    <div className="appStyle">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/customerdashboard" element={<Customerdashboard />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/ownerdashboard" element={<Ownerdashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
