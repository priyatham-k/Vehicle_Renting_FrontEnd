import React from "react";

const Topbar = ({ profileImage }) => {
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  const fullName = `${userDetails?.customer?.firstName || ""} ${userDetails?.customer?.lastName || ""}`;
  const email = userDetails?.customer?.email || "";
  const role = userDetails?.role || "Customer";

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown no-arrow">
          <a
            className="d-flex align-items-center"
            style={{
              textDecoration: "none",
              color: "#333",
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor: "#f8f9fa",
              boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              className="img-profile rounded-circle"
              src={profileImage}
              alt="Profile"
              style={{
                width: "35px",
                height: "35px",
                marginRight: "10px",
                border: "2px solid #007bff",
              }}
            />
            <span
              className="d-none d-lg-inline font-weight-bold"
              style={{
                fontSize: "14px",
                color: "#007bff",
                textAlign: "left",
              }}
            >
              {fullName}
              <br />
              <span style={{ fontSize: "12px", color: "#666" }}>Role: {role}</span>
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Topbar;
