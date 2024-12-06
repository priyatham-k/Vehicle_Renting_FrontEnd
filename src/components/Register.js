import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !driverLicense ||
      !address1 ||
      !state ||
      !zipcode ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("Please fill in all required fields.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      driverLicense,
      address1,
      address2,
      state,
      zipcode,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/customers/register",
        payload
      );
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

  const inputStyle = {
    fontSize: "12px",
    borderRadius: "0px",
    height: "30px",
    padding: "2px 5px",
  };

  const buttonStyle = {
    fontSize: "12px",
    padding: "2px 10px",
    height: "25px",
  };

  const textStyle = {
    fontSize: "12px",
  };

  return (
    <div className="bg-gradient-primary appStyle" style={{ fontSize: "12px" }}>
      <div className="container p-1">
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4" style={textStyle}>
                      Create an Account!
                    </h1>
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger" style={textStyle}>
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success" style={textStyle}>
                      {successMessage}
                    </div>
                  )}

                  <form className="user" onSubmit={handleRegister}>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          className="form-control"
                          style={inputStyle}
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          style={inputStyle}
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        style={inputStyle}
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        style={inputStyle}
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        style={inputStyle}
                        placeholder="Driver License Number"
                        value={driverLicense}
                        onChange={(e) => setDriverLicense(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        style={inputStyle}
                        placeholder="Address Line 1"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        style={inputStyle}
                        placeholder="Address Line 2 (Optional)"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          className="form-control"
                          style={inputStyle}
                          placeholder="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          style={inputStyle}
                          placeholder="Zipcode"
                          value={zipcode}
                          onChange={(e) => setZipcode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="password"
                          className="form-control"
                          style={inputStyle}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="password"
                          className="form-control"
                          style={inputStyle}
                          placeholder="Repeat Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      style={buttonStyle}
                    >
                      Register Account
                    </button>
                  </form>

                  <hr />
                  <div className="text-center">
                    <Link to="/" className="small" style={textStyle}>
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
