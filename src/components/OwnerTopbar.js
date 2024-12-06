import React from "react";
import profileImage from "../assets/undraw_profile_1.svg";

const OwnerTopbar = () => {
  // Retrieve user details from session storage
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  // Extract name and role
  const userName = userDetails?.admin?.name || "User";
  const userRole = userDetails?.role || "Admin";

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle Button for Mobile View */}
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>

      {/* User Profile Section */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown no-arrow">
          <a
            className="d-flex align-items-center p-2"
            style={{
              textDecoration: "none",
              color: "#555",
              cursor: "pointer",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#333")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            {/* Profile Image */}
            <img
              className="img-profile rounded-circle shadow-sm"
              src={profileImage}
              alt="Profile"
              style={{ width: "36px", height: "36px", marginRight: "10px" }}
            />

            {/* User Info */}
            <span
              className="d-none d-lg-inline text-bold-600"
              style={{
                fontSize: "13px",
                lineHeight: "1.2",
                fontWeight: "600",
                color: "#333",
              }}
            >
              {userName}
              <br />
              <span style={{ fontSize: "12px", color: "#777" }}>Role: {userRole}</span>
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default OwnerTopbar;
