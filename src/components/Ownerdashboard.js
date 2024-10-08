import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Ownerdashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("vehicles");
  const [showModal, setShowModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    capacity: "5",
    type: "",
    insurance: "",
    dailyPrice: "",
    imageUrl: "", // Base64 image
    vinNumber: "", // vinNumber number
    mileage: "", // Mileage
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch vehicles and rentals data on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const customerVehiclesResponse = await axios.get(
          "http://localhost:3001/api/customers/vehicles"
        );
        setVehicles(customerVehiclesResponse.data);
      } catch (err) {
        setError("Failed to fetch vehicles data.");
      }
    };

    const fetchRentals = async () => {
      try {
        const rentalsResponse = await axios.get(
          "http://localhost:3001/api/owners/rentals"
        );
        setRentals(rentalsResponse.data);
      } catch (err) {
        setError("Failed to fetch rentals data.");
      }
    };

    fetchVehicles();
    fetchRentals();
  }, []);

  // Form validation function
  const validateForm = () => {
    let errors = {};
    if (!newVehicle.make) errors.make = "Make is required";
    if (!newVehicle.model) errors.model = "Model is required";
    if (!newVehicle.capacity) errors.capacity = "Capacity is required";
    if (!newVehicle.type) errors.type = "Type is required";
    if (!newVehicle.insurance) errors.insurance = "Insurance Cost is required";
    if (!newVehicle.dailyPrice) errors.dailyPrice = "Daily Price is required";
    if (!newVehicle.imageUrl) errors.imageUrl = "Image is required";
    if (!newVehicle.vinNumber) errors.vinNumber = "vinNumber is required";
    if (!newVehicle.mileage) errors.mileage = "Mileage is required";
    return errors;
  };

  const handleDeleteVehicle = async (vehicleId) => {
    console.log("deleteVehicle", vehicleId);
    try {
      await axios.delete(
        `http://localhost:3001/api/owners/deleteVehicle/${vehicleId}`
      );
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== vehicleId)); // Update the vehicles state
    } catch (error) {
      setError("Failed to delete the vehicle");
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/owners/vehicles",
          newVehicle
        );
        console.log("Vehicle submitted:", response.data);
        setVehicles([...vehicles, newVehicle]); // Update the vehicles state
        // Reset form
        setNewVehicle({
          make: "",
          model: "",
          capacity: "5",
          type: "",
          insurance: "",
          dailyPrice: "",
          imageUrl: "",
          vinNumber: "", // Reset vinNumber
          mileage: "", // Reset Mileage
        });
        setShowModal(false);
      } catch (error) {
        setError("Failed to submit the new vehicle");
      }
    } else {
      setFormErrors(errors);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    setNewVehicle({
      ...newVehicle,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload and convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5000000) {
      // Check if file is under 5MB
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVehicle({ ...newVehicle, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setFormErrors({ imageUrl: "File is too large or invalid" });
    }
  };

  // Calculate total price of rentals
  const calculateTotalRentalsPrice = () => {
    let totalPrice =  0;
    rentals.forEach((rental) => {
      if (rental.status === "active" || rental.status === "Completed") {
        totalPrice += rental.totalPrice;
      } else if (rental.status === "Cancelled") {
        totalPrice += 100;
      }
    });
    return totalPrice;
  };

  return (
    <div id="page-top">
      <div id="wrapper">
        <ul
          className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          {/* Dashboard Nav Item */}
          <li
            className={`nav-item ${
              activeSection === "dashboard" ? "active" : ""
            }`}
          >
            <a
              className="nav-link"
              onClick={() => setActiveSection("dashboard")}
            >
              OWNER DASHBOARD
            </a>
          </li>

          <hr className="sidebar-divider" />

          {/* Vehicles Nav Item */}
          <li
            className={`nav-item ${
              activeSection === "vehicles" ? "active" : ""
            }`}
          >
            <a
              className="nav-link"
              onClick={() => setActiveSection("vehicles")}
            >
              <span>Vehicles</span>
              <i
                className="fas fa-car"
                style={{ marginLeft: "12px", fontSize: "1.1rem" }}
              ></i>
            </a>
          </li>

          {/* Rentals Nav Item */}
          <li
            className={`nav-item ${
              activeSection === "rentals" ? "active" : ""
            }`}
          >
            <a className="nav-link" onClick={() => setActiveSection("rentals")}>
              <span>Rentals</span>
              <i
                className="fas fa-clipboard-list"
                style={{ marginLeft: "12px", fontSize: "1.1rem" }}
              ></i>
            </a>
          </li>

          {/* Logout Nav Item */}
          <li className="nav-item">
            <a className="nav-link">
              <Link to="/">
                <span className="text-white">Logout</span>
              </Link>
            </a>
          </li>
        </ul>

        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i className="fa fa-bars"></i>
              </button>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow">
                  <a>
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                      {JSON.parse(sessionStorage.getItem("userDetails"))
                        ?.name || ""}
                    </span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Show Vehicles Section */}
            <div className="container-fluid">
              {" "}
              <div class="row p-4">
                {activeSection === "rentals" && (
                  <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-primary shadow h-100 py-2">
                      <div class="card-body">
                        <div class="row no-gutters align-items-center">
                          <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Earnings
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                              ${calculateTotalRentalsPrice()}
                            </div>
                          </div>
                          <div class="col-auto">
                            <i class="fas fa-calendar fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                {activeSection === "vehicles" && (
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12 ">
                        <button
                          onClick={() => setShowModal(true)}
                          className="btn btn-primary mb-3 float-right mr-4"
                        >
                          Add Vehicle
                        </button>
                      </div>
                      {error ? (
                        <p style={{ color: "red" }}>{error}</p>
                      ) : vehicles.length === 0 ? (
                        <div className="col-12">
                          <p
                            style={{
                              textAlign: "center",
                              fontSize: "20px",
                              marginTop: "50px",
                            }}
                          >
                            No vehicles found
                          </p>
                        </div>
                      ) : (
                        vehicles.map((vehicle, index) => (
                          <div
                            key={vehicle.id || index}
                            className="col-md-6 mb-3"
                          >
                            <div className="card card-custom">
                              <div className="row g-0">
                                <div className="col-md-4">
                                  <div
                                    className="image-container"
                                    style={{ height: "262px" }}
                                  >
                                    <img
                                      src={vehicle.imageUrl}
                                      className="img-fluid rounded-start"
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover",
                                      }} // Use cover to maintain aspect ratio
                                      alt={`${vehicle.make} ${vehicle.model}`}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-8">
                                  <div className="card-body d-flex flex-column h-100">
                                    <h5 className="card-title">
                                      {vehicle.make} {vehicle.model}
                                    </h5>
                                    <p className="card-capacity">
                                      Capacity: 5 persons
                                    </p>
                                    <p className="card-type">
                                      Type: {vehicle.type}
                                    </p>
                                    <p className="card-insurance">
                                      Insurance Cost: ${vehicle.insurance}
                                    </p>
                                    <p className="card-price">
                                      Price per day: ${vehicle.dailyPrice}
                                    </p>
                                    <div className="mt-auto d-flex justify-content-between">
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          handleDeleteVehicle(vehicle._id)
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {activeSection === "rentals" && (
                  <div className="container-fluid">
                    <div className="row">
                      {error ? (
                        <p style={{ color: "red" }}>{error}</p>
                      ) : rentals.length === 0 ? (
                        <div className="col-12">
                          <p
                            style={{
                              textAlign: "center",
                              fontSize: "20px",
                              marginTop: "50px",
                            }}
                          >
                            No rentals found
                          </p>
                        </div>
                      ) : (
                        rentals.map((rental, index) => (
                          <div
                            key={rental.id || index}
                            className="col-md-6 mb-3"
                          >
                            <div className="card card-custom">
                              <div className="row g-0">
                                <div className="col-md-4">
                                  <img
                                    src={rental.imageUrl}
                                    className="img-fluid rounded-start"
                                    style={{ height: "100% !important" }}
                                    alt={`${rental.make} ${rental.model}`}
                                  />
                                </div>
                                <div className="col-md-8">
                                  <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">
                                      {rental.make} {rental.model}
                                    </h5>
                                    <p className="card-capacity">
                                      Capacity: 5 persons
                                    </p>
                                    <p className="card-rental-date">
                                      Pickup Date: {rental.pickupDate}
                                    </p>
                                    <p className="card-return-date">
                                      Return Date: {rental.returnDate}
                                    </p>
                                    <p className="card-total-price">
                                      Total Price: ${rental.totalPrice}
                                    </p>
                                    <p className="card-status">
                                      Status: {rental.status}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Vehicle</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="make">Make</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.make && "is-invalid"
                        }`}
                        id="make"
                        name="make"
                        value={newVehicle.make}
                        onChange={handleInputChange}
                        required />
                      {formErrors.make && (
                        <div className="invalid-feedback">
                          {formErrors.make}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="model">Model</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.model && "is-invalid"
                        }`}
                        id="model"
                        name="model"
                        value={newVehicle.model}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.model && (
                        <div className="invalid-feedback">
                          {formErrors.model}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="capacity">Capacity</label>
                      <select
                        className={`form-control ${
                          formErrors.capacity && "is-invalid"
                        }`}
                        id="capacity"
                        name="capacity"
                        value={newVehicle.capacity}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="5">5</option>
                        {/* <option value="7">7</option>
                        <option value="9">9</option> */}
                      </select>
                      {formErrors.capacity && (
                        <div className="invalid-feedback">
                          {formErrors.capacity}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="type">Type</label>
                      <select
                        className={`form-control ${
                          formErrors.type && "is-invalid"
                        }`}
                        id="type"
                        name="type"
                        value={newVehicle.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="car">Car</option>
                        <option value="truck">Truck</option>
                      </select>
                      {formErrors.type && (
                        <div className="invalid-feedback">
                          {formErrors.type}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="insurance">
                        Insurance Cost (per day)
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.insurance && "is-invalid"
                        }`}
                        id="insurance"
                        name="insurance"
                        value={newVehicle.insurance}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.insurance && (
                        <div className="invalid-feedback">
                          {formErrors.insurance}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="dailyPrice">Daily Price ($)</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.dailyPrice && "is-invalid"
                        }`}
                        id="dailyPrice"
                        name="dailyPrice"
                        value={newVehicle.dailyPrice}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.dailyPrice && (
                        <div className="invalid-feedback">
                          {formErrors.dailyPrice}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* New vinNumber and Mileage Fields */}
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="vinNumber">vinNumber Number</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.vinNumber && "is-invalid"
                        }`}
                        id="vinNumber"
                        name="vinNumber"
                        value={newVehicle.vinNumber}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.vinNumber && (
                        <div className="invalid-feedback">
                          {formErrors.vinNumber}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="mileage">Mileage (miles/gal)</label>)
                      <input
                        type="number"
                        min={1}
                        className={`form-control ${
                          formErrors.mileage && "is-invalid"
                        }`}
                        id="mileage"
                        name="mileage"
                        value={newVehicle.mileage}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.mileage && (
                        <div className="invalid-feedback">
                          {formErrors.mileage}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-12">
                      <label htmlFor="imageUrl">Upload Image</label>
                      <input
                        type="file"
                        className={`form-control ${
                          formErrors.imageUrl && "is-invalid "
                        }`}
                        id="imageUrl"
                        onChange={handleImageUpload}
                      />
                      {formErrors.imageUrl && (
                        <div className="invalid-feedback">
                          {formErrors.imageUrl}
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ownerdashboard;