import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link } from "react-router-dom";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      // API call using Axios
      const response = await axios.post("http://localhost:3001/api/user/login", {
        username,
        password,
      });
      if (response.data.message === "Login successful") {
        // Redirect to Dashboard upon successful login
        navigate("/StudentApplication");
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
                              onChange={(e) => setUsername(e.target.value)}
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
                          {error && <p style={{ color: 'red' }}>{error}</p>}
                          <button class="btn btn-primary btn-user btn-block">Student Login</button>
                          <hr></hr>
                          <a class="btn btn-google btn-user btn-block">
                            <i class="fab fa-google fa-fw"></i> Instructor Login
                          </a>
                          <a class="btn btn-facebook btn-user btn-block">
                            <i class="fab fa-facebook-f fa-fw"></i> Admin Login
                          </a>
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
