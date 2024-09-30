import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making API requests
import { useNavigate } from "react-router-dom";
function Register() {
  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer"); // Default role as "customer"
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(""); // For displaying success messages
  const navigate = useNavigate();
  // Form validation
  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    setErrorMessage(""); // Clear error if validation passes
    return true;
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    if (!validateForm()) return; // Stop if form is not valid

    const fullName = `${firstName} ${lastName}`;
    const payload = {
      name: fullName,
      email,
      password,
      role,
    };

    try {
      const response = await axios.post("http://localhost:3001/api/auth/register", payload);
      if (response.status === 201) {
        setSuccessMessage("Registration successful! Please log in.");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="bg-gradient-primary appStyle">
      <div className="container p-1">
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                  </div>

                  {/* Error and Success Messages */}
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {successMessage && <div className="alert alert-success">{successMessage}</div>}

                  <form className="user" onSubmit={handleRegister}>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleFirstName"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleLastName"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control form-control-user"
                        id="exampleInputEmail"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="password"
                          className="form-control form-control-user"
                          id="exampleInputPassword"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="password"
                          className="form-control form-control-user"
                          id="exampleRepeatPassword"
                          placeholder="Repeat Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="form-group">
                      {/* Add a label for accessibility */}
                      <select
                        className="form-control"
                        id="roleSelect" // Add an ID to associate with the label
                        value={role}
                        onChange={(e) => {
                          console.log(`Selected role: ${e.target.value}`); // Log the selected role
                          setRole(e.target.value); // Update the role in state
                        }}
                      >
                        <option value="customer">Customer</option>
                        {/* If you want to add more roles, you can uncomment and add options here */}
                        {/* <option value="owner">Owner</option> */}
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-user btn-block">
                      Register Account
                    </button>
                  </form>

                  <hr />
                  <div className="text-center">
                    <Link to="/" className="small">
                      Already have an account? Login!
                    </Link>
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

export default Register;
