import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ activeSection, setActiveSection }) => (
  <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" style={{ fontSize: "14px" }}>
    {/* Dashboard Link */}
    <li className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}>
      <a className="nav-link d-flex align-items-center text-white" onClick={() => setActiveSection("dashboard")}>
        <i className="fas fa-tachometer-alt" style={{ fontSize: "1.2rem", marginRight: "8px" }}></i>
        <b>CUSTOMER DASHBOARD</b>
      </a>
    </li>

    <hr className="sidebar-divider" />

    {/* Vehicles Link */}
    <li className={`nav-item ${activeSection === "vehicles" ? "active" : ""}`}>
      <a className="nav-link d-flex align-items-center" onClick={() => setActiveSection("vehicles")}>
        <i className="fas fa-car" style={{ fontSize: "1.2rem", marginRight: "8px" }}></i>
        <b>Vehicles</b>
      </a>
    </li>

    {/* Rentals Link */}
    <li className={`nav-item ${activeSection === "rentals" ? "active" : ""}`}>
      <a className="nav-link d-flex align-items-center" onClick={() => setActiveSection("rentals")}>
        <i className="fas fa-clipboard-list" style={{ fontSize: "1.2rem", marginRight: "8px" }}></i>
        <b>Rentals</b>
      </a>
    </li>

    {/* Logout Link */}
    <li className="nav-item">
      <Link to="/" className="nav-link d-flex align-items-center">
        <i className="fas fa-sign-out-alt" style={{ fontSize: "1.2rem", marginRight: "8px" }}></i>
        <b>Logout</b>
      </Link>
    </li>
  </ul>
);

export default Sidebar;
