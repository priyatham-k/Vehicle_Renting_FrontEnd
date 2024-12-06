import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import OwnerRentalsSection from "./OwnerRentalsSection";
import OwnerVehiclesSection from "./OwnerVehiclesSection";
import OwnerSidebar from "./OwnerSidebar";
import OwnerTopbar from "./OwnerTopbar";
import Earnings from "./Earnings";
import OwnerLocationsSection from "./OwnerLocationsSection";
import OwnerPayment from "./OwnerPayment";

function Ownerdashboard() {
  const [locations, setLocations] = useState([]);

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
    imageUrl: "",
    vinNumber: "",
    mileage: "",
    pricePerDay: "",
    currentOdoMeter: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const labelStyle = {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#555",
    display: "inline-block",
    marginBottom: "5px",
  };

  const inputStyle = {
    fontSize: "14px",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  // Fetch vehicles and rentals data on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const customerVehiclesResponse = await axios.get(
          "http://localhost:3001/api/vehicles/"
        );
        setVehicles(customerVehiclesResponse.data);
      } catch (err) {
        setError("Failed to fetch vehicles data.");
      }
    };

    const fetchRentals = async () => {
      try {
        const rentalsResponse = await axios.get(
          "http://localhost:3001/api/rentals/owner"
        );
        setRentals(rentalsResponse.data);
      } catch (err) {
        setError("Failed to fetch rentals data.");
      }
    };

    fetchVehicles();
    fetchRentals();
  }, []);


  const handleUpdateVehicle = async (vehicleId, updatedData) => {
    try {
      // Make the API call to update the vehicle
      await axios.put(`http://localhost:3001/api/vehicles/update/${vehicleId}`, updatedData);
  
      // Fetch the updated list of vehicles
      const response = await axios.get("http://localhost:3001/api/vehicles");
      setVehicles(response.data); // Update the state with the latest data
    } catch (error) {
      setError("Failed to update the vehicle");
      console.error("Error updating vehicle:", error);
    }
  };

  // Validate form fields
  const validateForm = () => {
    let errors = {};
    if (!newVehicle.make) errors.make = "Make is required";
    if (!newVehicle.model) errors.model = "Model is required";
    if (!newVehicle.capacity) errors.capacity = "Capacity is required";
    if (!newVehicle.type) errors.type = "Type is required";
    if (!newVehicle.insurance) errors.insurance = "Insurance Cost is required";
    if (!newVehicle.dailyPrice) errors.dailyPrice = "Daily Price is required";
    if (!newVehicle.imageUrl) errors.imageUrl = "Image is required";
    if (!newVehicle.vinNumber) errors.vinNumber = "VIN Number is required";
    if (!newVehicle.mileage) errors.mileage = "Mileage is required";
    if (!newVehicle.pricePerDay)
      errors.pricePerDay = "Price per Day is required";
    if (!newVehicle.currentOdoMeter)
      errors.currentOdoMeter = "Current Odometer is required";
    return errors;
  };
  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        // Check for VIN uniqueness
        const existingVehicle = vehicles.find(
          (vehicle) => vehicle.vinNumber === newVehicle.vinNumber
        );
        if (existingVehicle) {
          setFormErrors({ vinNumber: "VIN Number must be unique" });
          return;
        }
  
        // Submit the new vehicle
        await axios.post("http://localhost:3001/api/vehicles/add", newVehicle);
  
        // Fetch the updated list of vehicles
        const response = await axios.get("http://localhost:3001/api/vehicles");
        setVehicles(response.data); // Update the state with the latest data
  
        // Reset the form and close the modal
        setNewVehicle({
          make: "",
          model: "",
          capacity: "5",
          type: "",
          insurance: "",
          dailyPrice: "",
          imageUrl: "",
          vinNumber: "",
          mileage: "",
          pricePerDay: "",
          currentOdoMeter: "",
        });
        setShowModal(false);
      } catch (error) {
        setError("Failed to submit the new vehicle");
      }
    } else {
      setFormErrors(errors);
    }
  };
  

  // Handle input changes
  const handleInputChange = (e) => {
    setNewVehicle({
      ...newVehicle,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5000000) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVehicle({ ...newVehicle, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setFormErrors({ imageUrl: "File is too large or invalid" });
    }
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/vehicles/deleteVehicle/${vehicleId}`
      );
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== vehicleId));
    } catch (error) {
      setError("Failed to delete the vehicle");
    }
  };
  return (
    <div id="page-top">
      <div id="wrapper">
        <OwnerSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <OwnerTopbar profileImage="path/to/profile-image.jpg" />
            <div className="container-fluid">
              {activeSection === "vehicles" && (
                <OwnerVehiclesSection
                  vehicles={vehicles}
                  error={error}
                  setShowModal={setShowModal}
                  handleDeleteVehicle={handleDeleteVehicle}
                  handleUpdateVehicle={handleUpdateVehicle}
                />
              )}
              {activeSection === "rentals" && (
                <OwnerRentalsSection rentals={rentals} />
              )}
              {activeSection === "ownerPayments" && (
                <OwnerPayment />
              )}
              {activeSection === "earnings" && <Earnings rentals={rentals} />}
              {activeSection === "locations" && (
                <OwnerLocationsSection
                  locations={locations}
                  setLocations={setLocations}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
            style={{ maxWidth: "500px" }}
          >
            <div
              className="modal-content"
              style={{
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Add Vehicle
                </h5>
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
                  {/* Make and Model */}
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="make" style={labelStyle}>
                        Make
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.make && "is-invalid"
                        }`}
                        id="make"
                        name="make"
                        value={newVehicle.make}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                      {formErrors.make && (
                        <div className="invalid-feedback">
                          {formErrors.make}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="model" style={labelStyle}>
                        Model
                      </label>
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
                        style={inputStyle}
                      />
                      {formErrors.model && (
                        <div className="invalid-feedback">
                          {formErrors.model}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Capacity and Type */}
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="capacity" style={labelStyle}>
                        Capacity
                      </label>
                      <select
                        className={`form-control ${
                          formErrors.capacity && "is-invalid"
                        }`}
                        id="capacity"
                        name="capacity"
                        value={newVehicle.capacity}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      >
                        <option value="5">5</option>
                        <option value="7">7</option>
                      </select>
                      {formErrors.capacity && (
                        <div className="invalid-feedback">
                          {formErrors.capacity}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="type" style={labelStyle}>
                        Type
                      </label>
                      <select
                        className={`form-control ${
                          formErrors.type && "is-invalid"
                        }`}
                        id="type"
                        name="type"
                        value={newVehicle.type}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      >
                        <option value="">Select Type</option>
                        <option value="car">Car</option>
                        <option value="truck">Truck</option>
                        <option value="suv">SUV</option>
                      </select>
                      {formErrors.type && (
                        <div className="invalid-feedback">
                          {formErrors.type}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Insurance and Daily Price */}
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="insurance" style={labelStyle}>
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
                        style={inputStyle}
                      />
                      {formErrors.insurance && (
                        <div className="invalid-feedback">
                          {formErrors.insurance}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="dailyPrice" style={labelStyle}>
                        Daily Price ($)
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.dailyPrice && "is-invalid"
                        }`}
                        id="dailyPrice"
                        name="dailyPrice"
                        value={newVehicle.dailyPrice}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                      {formErrors.dailyPrice && (
                        <div className="invalid-feedback">
                          {formErrors.dailyPrice}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Per Day and VIN Number */}
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="pricePerDay" style={labelStyle}>
                        Price / Mile (More than a day)($)
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.pricePerDay && "is-invalid"
                        }`}
                        id="pricePerDay"
                        name="pricePerDay"
                        value={newVehicle.pricePerDay}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                      {formErrors.pricePerDay && (
                        <div className="invalid-feedback">
                          {formErrors.pricePerDay}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="vinNumber" style={labelStyle}>
                        VIN Number
                      </label>
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
                        style={inputStyle}
                      />
                      {formErrors.vinNumber && (
                        <div className="invalid-feedback">
                          {formErrors.vinNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mileage and Odometer */}
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="mileage" style={labelStyle}>
                        Mileage (miles/gal)
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.mileage && "is-invalid"
                        }`}
                        id="mileage"
                        name="mileage"
                        value={newVehicle.mileage}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                      {formErrors.mileage && (
                        <div className="invalid-feedback">
                          {formErrors.mileage}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="currentOdoMeter" style={labelStyle}>
                        Current Odometer (miles)
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.currentOdoMeter && "is-invalid"
                        }`}
                        id="currentOdoMeter"
                        name="currentOdoMeter"
                        value={newVehicle.currentOdoMeter}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                      {formErrors.currentOdoMeter && (
                        <div className="invalid-feedback">
                          {formErrors.currentOdoMeter}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="form-row">
                    <div className="form-group col-md-12">
                      <label htmlFor="imageUrl" style={labelStyle}>
                        Upload Image
                      </label>
                      <input
                        type="file"
                        className={`form-control ${
                          formErrors.imageUrl && "is-invalid"
                        }`}
                        id="imageUrl"
                        onChange={handleImageUpload}
                        style={inputStyle}
                      />
                      {formErrors.imageUrl && (
                        <div className="invalid-feedback">
                          {formErrors.imageUrl}
                        </div>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
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
