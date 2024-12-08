import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/api/customers/bothLogin", { email, password });

      if (response.status === 200) {
        const { token, customer, admin } = response.data;

        // Store user details in session storage
        if (customer) {
          sessionStorage.setItem(
            "userDetails",
            JSON.stringify({ token, ...response.data })
          );
          navigate("/customerdashboard");
        } else if (admin) {
          sessionStorage.setItem(
            "userDetails",
            JSON.stringify({ token, ...response.data })
          );
          navigate("/ownerdashboard");
        } else {
          setError("Invalid user role detected. Please try again.");
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div
      className="bg-gradient-primary appStyle d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card o-hidden border-0 shadow-lg login-container">
        <div className="row no-gutters">
          {/* Left Side with Background Image */}
          <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>

          {/* Right Side Login Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="card-body p-4">
              <h2 className="shiny-title text-center mb-3">
                VEHICLE RENTING PLATFORM
              </h2>
              <h4 className="text-gray-900 text-center mb-3 small-title">
                Welcome!
              </h4>
              <form>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-user small-input"
                    placeholder="Enter Email Address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-user small-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-danger text-center small-text">{error}</p>
                )}
                <button
                  className="btn btn-primary btn-user btn-block small-btn"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </form>
              <hr />
              <div className="text-center">
                <Link to="/Register" className="small-link">
                  Create Customer Account!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          max-width: 700px;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
        }

        .small-input {
          font-size: 12px;
          padding: 5px;
          height: 30px;
        }

        .small-btn {
          font-size: 12px;
          padding: 5px;
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
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(255, 255, 255, 0.5);
          animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5),
              0 0 10px rgba(255, 255, 255, 0.3);
          }
          to {
            text-shadow: 0 0 15px rgba(255, 255, 255, 1),
              0 0 30px rgba(255, 255, 255, 0.7);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
