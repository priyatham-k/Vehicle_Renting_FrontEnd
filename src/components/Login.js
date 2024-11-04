import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e, userType) => {
    e.preventDefault();
    setError(null);
    let loginUrl;
    if (userType === "customer") {
      loginUrl = "http://localhost:3001/api/auth/login";
    } else if (userType === "owner") {
      loginUrl = "http://localhost:3001/api/owners/login";
    }
    try {
      const response = await axios.post(loginUrl, { email, password });
      if (response.data.user) {
        const userDetails = response.data.user;
        sessionStorage.setItem("userDetails", JSON.stringify(userDetails));

        if (userDetails.role === "customer" && userType === "customer") {
          navigate("/Customerdashboard");
        } else if (userDetails.role === "owner" && userType === "owner") {
          navigate("/Ownerdashboard");
        } else {
          setError("Please check your credentials.");
        }
      } else {
        setError("Login failed. User details not found.");
      }
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="bg-gradient-primary appStyle d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card o-hidden border-0 shadow-lg login-container">
        <div className="row no-gutters">
          {/* Left Side with Background Image */}
          <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
          
          {/* Right Side Login Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="card-body p-4">
              <h2 className="shiny-title text-center mb-3">VEHICLE RENTING PLATFORM</h2>
              <h4 className="text-gray-900 text-center mb-3 small-title">Welcome!</h4>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-user small-input"
                    placeholder="Enter Email Address..."
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-user small-input"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-danger text-center small-text">{error}</p>}
                <button className="btn btn-primary btn-user btn-block small-btn" onClick={(e) => handleLogin(e, "customer")}>
                  Customer Login
                </button>
                <button className="btn btn-danger btn-user btn-block small-btn" onClick={(e) => handleLogin(e, "owner")}>
                  Owner Login
                </button>
              </form>
              <hr />
              <div className="text-center">
                <Link to="/Register" className="small-link">Create Customer Account!</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          max-width: 700px; /* Increased width */
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
        }

        .small-input {
          font-size: 12px;
          padding: 6px;
        }
        .small-btn {
          font-size: 12px;
          padding: 5px 0;
          margin-bottom: 10px;
        }
        .small-text {
          font-size: 12px;
        }
        .small-link {
          font-size: 12px;
        }
        .small-title {
          font-size: 16px;
          font-weight: 500;
        }
        .shiny-title {
          font-size: 18px;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5);
          animation: glow 1.5s infinite alternate;
        }
        @keyframes glow {
          from {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3);
          }
          to {
            text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.7);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
