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
    setError(null); // Reset error state
    let loginUrl;
    if (userType === "customer") {
      loginUrl = "http://localhost:3001/api/auth/login";
    } else if (userType === "owner") {
      loginUrl = "http://localhost:3001/api/owners/login";
    }
    try {
      const response = await axios.post(loginUrl, {
        email,
        password,
      });
      if (response.data.user) {
        const userDetails = response.data.user; // Assuming the user details are in `response.data.user`
        sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
      
        // Check if user roles match with the expected role
        if (userDetails.role === "customer" && userType === "customer") {
          navigate("/Customerdashboard");
        } else if (userDetails.role === "owner" && userType === "owner") {
          navigate("/Ownerdashboard");
        } else {
          // This part handles cases where the role doesn't match
          setError("Please check your credentials.");
        }
      } else {
        // Handle case where user details are not found
        setError("Login failed. User details not found.");
      }
      
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div>
      <div className="bg-gradient-primary appStyle">
        <div className="container p-1">
          <div className="row justify-content-center">
            {/* Centered and Glowing Title */}
            <h2 className="shiny-title text-white">VEHICLE RENTING PLATFORM</h2>
            <div className="col-xl-10 col-lg-12 col-md-9">
              <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                    <div className="col-lg-6">
                      <div className="p-5">
                        <div className="text-center">
                          <h1 className="h4 text-gray-900 mb-4">Welcome!</h1>
                        </div>
                        <form className="user" onSubmit={handleLogin}>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control form-control-user"
                              id="exampleInputEmail"
                              aria-describedby="emailHelp"
                              placeholder="Enter Email Address..."
                              onChange={(e) => setemail(e.target.value)}
                            ></input>
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              className="form-control form-control-user"
                              id="exampleInputPassword"
                              placeholder="Password"
                              onChange={(e) => setPassword(e.target.value)}
                            ></input>
                          </div>
                          {error && <p style={{ color: "red" }}>{error}</p>}
                          <button
                            className="btn btn-primary btn-user btn-block"
                            onClick={(e) => handleLogin(e, "customer")}
                          >
                            Customer Login
                          </button>
                          <button
                            className="btn btn-danger btn-user btn-block"
                            onClick={(e) => handleLogin(e, "owner")}
                          >
                            Owner Login
                          </button>
                        </form>
                        <hr />
                        <div className="text-center">
                          <a className="small">
                            <Link to="/Register">Create an Account!</Link>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for glowing effect */}
      <style jsx>{`
        .shiny-title {
          text-align: center;
          font-size: 3rem;
          font-weight: bold;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
            0 0 30px rgba(255, 255, 255, 0.5);
          animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
              0 0 20px rgba(255, 255, 255, 0.3);
          }
          to {
            text-shadow: 0 0 20px rgba(255, 255, 255, 1),
              0 0 40px rgba(255, 255, 255, 0.7);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
