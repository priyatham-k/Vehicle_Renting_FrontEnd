import React from "react";
import { Link } from "react-router-dom";

const OwnerSidebar = ({ activeSection, setActiveSection }) => (
  <ul
    className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
    id="accordionSidebar"
  >
    {/* Dashboard Nav Item */}
    <li className={`nav-item ${activeSection === "vehicles" ? "active" : ""}`}>
      <a
        className="nav-link d-flex align-items-center"
        onClick={() => setActiveSection("dashboard")}
      >
        <i
          className="fas fa-tachometer-alt"
          style={{ fontSize: "18px", marginRight: "10px" }}
        ></i>
        <span>OWNER DASHBOARD</span>
      </a>
    </li>

    <hr className="sidebar-divider" />

    {/* Vehicles Nav Item */}
    <li
      className={`nav-item ${activeSection === "vehicles" ? "active" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <a
        className="nav-link d-flex align-items-center"
        onClick={() => setActiveSection("vehicles")}
      >
        <i
          className="fas fa-car"
          style={{ fontSize: "18px", marginRight: "10px" }}
        ></i>
        <span>Vehicles</span>
      </a>
    </li>

    {/* Rentals Nav Item */}
    <li
      className={`nav-item ${activeSection === "rentals" ? "active" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <a
        className="nav-link d-flex align-items-center"
        onClick={() => setActiveSection("rentals")}
      >
        <i
          className="fas fa-clipboard-list"
          style={{ fontSize: "18px", marginRight: "10px" }}
        ></i>
        <span>Rentals</span>
      </a>
    </li>

    {/* Earnings Nav Item */}
    {/* <li
      className={`nav-item ${activeSection === "earnings" ? "active" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <a
        className="nav-link d-flex align-items-center"
        onClick={() => setActiveSection("earnings")}
      >
        <i
          className="fas fa-dollar-sign"
          style={{ fontSize: "18px", marginRight: "10px" }}
        ></i>
        <span>Earnings</span>
      </a>
    </li> */}
    <li
      className={`nav-item ${activeSection === "locations" ? "active" : ""}`}
      onClick={() => setActiveSection("locations")}
      style={{ cursor: "pointer" }}
    >
      <a className="nav-link">
        <i className="fas fa-map-marker-alt"></i>
        <span>Locations</span>
      </a>
    </li>
    <li
      className={`nav-item ${activeSection === "ownerPayments" ? "active" : ""}`}
      onClick={() => setActiveSection("ownerPayments")}
      style={{ cursor: "pointer" }}
    >
      <a className="nav-link">
        <i
          className="fas fa-money-check-alt"
          style={{ fontSize: "18px", marginRight: "10px" }}
        ></i>
        <span>Owner Payments</span>
      </a>
    </li>
    <hr className="sidebar-divider" />

    {/* Logout Nav Item */}
    <li className="nav-item">
      <Link
        to="/"
        className="nav-link d-flex align-items-center text-white"
        style={{ textDecoration: "none" }}
      >
        <i
          className="fas fa-sign-out-alt"
          style={{ fontSize: "18px", marginRight: "10px" }}
        ></i>
        <span>Logout</span>
      </Link>
    </li>
  </ul>
);

export default OwnerSidebar;
