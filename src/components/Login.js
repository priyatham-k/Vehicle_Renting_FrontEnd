import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link } from "react-router-dom";
function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setfullName] = useState("a");
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
      if (response.data.message === "Login successful") {
        navigate("/Customerdashboard");
      } else if (userType === "owner") {
        navigate("/Ownerdashboard");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };
  return (
    <div>
      <div class="bg-gradient-primary appStyle">
        <div class="container p-1">
          <div class="row justify-content-center">
            <h2 className="text-white text-bold">VEHICLE RENTING PLATFORM</h2>
            <div class="col-xl-10 col-lg-12 col-md-9">
              <div class="card o-hidden border-0 shadow-lg my-5">
                <div class="card-body p-0">
                  <div class="row">
                    <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                    <div class="col-lg-6">
                      <div class="p-5">
                        <div class="text-center">
                          <h1 class="h4 text-gray-900 mb-4">Welcome!</h1>
                        </div>

                        <form class="user" onSubmit={handleLogin}>
                          <div class="form-group">
                            <input
                              type="text"
                              class="form-control form-control-user"
                              id="exampleInputEmail"
                              aria-describedby="emailHelp"
                              placeholder="Enter Email Address..."
                              onChange={(e) => setemail(e.target.value)}
                            ></input>
                          </div>
                          <div class="form-group">
                            <input
                              type="password"
                              class="form-control form-control-user"
                              id="exampleInputPassword"
                              placeholder="Password"
                              onChange={(e) => setPassword(e.target.value)}
                            ></input>
                          </div>
                          {error && <p style={{ color: "red" }}>{error}</p>}
                          <button class="btn btn-primary btn-user btn-block" onClick={(e) => handleLogin(e, "customer")}>
                            Customer Login
                          </button>
                          {/* <hr></hr> */}
                          <button class="btn btn-google btn-user btn-block" onClick={(e) => handleLogin(e, "owner")}>
                            Owner Login
                          </button>
                        </form>
                        <hr></hr>
                        <div class="text-center">
                          <a class="small">
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
    </div>
  );
}

export default Login;
