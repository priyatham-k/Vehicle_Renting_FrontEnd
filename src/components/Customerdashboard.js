import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import profileImage from "../assets/undraw_profile_1.svg";

function Customerdashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [activeSection, setActiveSection] = useState("vehicles");
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showDropOffModal, setShowDropOffModal] = useState(false);
  const [dropOffOdometer, setDropOffOdometer] = useState("");
  const [currentRental, setCurrentRental] = useState(null);
  const [creditCard, setCreditCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [odometerDifference, setOdometerDifference] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/customers/vehicles"
        );
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }

    fetchVehicles();
    fetchRentals();
  }, []);
  const fetchRentals = async () => {
    try {
      const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
      if (userDetails && userDetails._id) {
        const apiUrl = `http://localhost:3001/api/customers/rentals/${userDetails._id}`;
        const rentalsResponse = await axios.get(apiUrl);
        setRentals(rentalsResponse.data);
      } else {
        throw new Error("User ID not found in session storage.");
      }
    } catch (err) {
      setError("Failed to fetch rentals data.");
      console.error(err);
    }
  };
  const filteredVehicles =
    selectedFilter === ""
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.type === selectedFilter);

  const handleCancelRental = async (rentalId) => {
    try {
      const cancelUrl = `http://localhost:3001/api/customers/cancel/${rentalId}`;
      const cancelResponse = await axios.put(cancelUrl);

      if (cancelResponse.status === 200) {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const rentalsResponse = await axios.get(
          `http://localhost:3001/api/customers/rentals/${userDetails._id}`
        );
        setRentals(rentalsResponse.data);
        alert(
          "Rental canceled successfully!...Money will be refunded in 4-7 business days."
        );
      } else {
        alert("Failed to cancel rental. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling rental:", error);
      alert("Failed to cancel rental. Please try again.");
    }
  };

  const handleDropOffClick = async (rental) => {
    const dayDifference =
      (new Date(rental?.returnDate) - new Date(rental?.pickupDate)) /
      (1000 * 60 * 60 * 24);

    if (dayDifference > 1) {
      setCurrentRental(rental);
      setOdometerDifference("");
      setDropOffOdometer("");
      setShowDropOffModal(true);
      setCreditCard({
        number: "",
        expiry: "",
        cvv: "",
      });
    } else {
      try {
        const response = await axios.put(
          `http://localhost:3001/api/customers/rentals/dropoff/${rental._id}`,
          {
            totalCharge: 0,
          }
        );
        console.log(response);
        if (
          response?.data?.rental?.vehicleId !== null
        ) {
          alert("Vehicle drop-off completed successfully!");
          fetchRentals();
        } else {
          alert("Vehicle drop-off failed. Please try again.");
        }
      } catch (error) {
        console.error("Error in vehicle drop-off:", error);
        alert("Vehicle drop-off failed. Please try again.");
      }
    }
  };

  const handleDropOffSubmit = async () => {
    if (
      parseInt(dropOffOdometer) <=
      parseInt(currentRental?.vehicleId?.currentOdoMeter)
    ) {
      alert(
        "Drop-off odometer reading should be higher than the previous reading."
      );
      return;
    }
    const difference =
      parseInt(dropOffOdometer) -
      parseInt(currentRental?.vehicleId?.currentOdoMeter);
    const charge = difference * parseInt(currentRental?.vehicleId?.pricePerDay);
    setOdometerDifference(difference);
    setTotalCharge(charge);
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setCreditCard({ ...creditCard, [name]: value });
  };

  const validateCreditCard = () => {
    const cardRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    return (
      cardRegex.test(creditCard.number) &&
      expiryRegex.test(creditCard.expiry) &&
      cvvRegex.test(creditCard.cvv)
    );
  };

  const handlePaymentSubmit = (currentRental) => {
    console.log(currentRental);
    if (!validateCreditCard()) {
      alert("Invalid credit card details. Please check and try again.");
      return;
    }

    try {
      const response = axios.put(
        `http://localhost:3001/api/customers/rentals/dropoff/${currentRental._id}`,
        {
          totalCharge,
        }
      );

      if (response?.data?.rental?.vehicleId !== null) {
        alert("Vehicle drop-off completed successfully!");
        fetchRentals();
      } else {
        alert("Vehicle drop-off failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in vehicle drop-off:", error);
      alert("Vehicle drop-off failed. Please try again.");
    }
    setShowDropOffModal(false);
  };

  const VehicleCard = ({ vehicle, isRental }) => {
    if (!vehicle) return null;

    const isPickupDateBeforeToday = vehicle.pickupDate
      ? new Date(vehicle.pickupDate) <= new Date()
      : false;

    return (
      <div key={vehicle.id || vehicle._id} className="col-md-6 mb-3">
        <div
          className="card card-custom position-relative"
          style={{
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          {isRental && (
            <span
              className="badge badge-info position-absolute"
              style={{ top: "10px", right: "10px", fontSize: "12px" }}
            >
              Status: {vehicle.status}
            </span>
          )}
          <div className="row g-0">
            <div className="col-md-5" style={{ width: "40%" }}>
              <img
                src={vehicle.imageUrl || ""}
                className="img-fluid rounded-start"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                alt={`${vehicle.make || ""} ${vehicle.model || ""}`}
              />
            </div>
            <div className="col-md-7" style={{ width: "60%", padding: "15px" }}>
              <div
                className="card-body d-flex flex-column"
                style={{ fontSize: "12px" }}
              >
                <h5
                  className="card-title"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {vehicle.make || "N/A"} {vehicle.model || "N/A"}
                </h5>
                {!isRental && (
                  <>
                    <p
                      className="card-type"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Type:</strong> {vehicle.type || "N/A"}
                    </p>
                    <p
                      className="card-capacity"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Capacity:</strong> {vehicle?.capacity || "5"}{" "}
                      people
                    </p>
                    <p
                      className="card-insurance"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Insurance:</strong> ${vehicle.insurance || "N/A"}
                    </p>
                    <p
                      className="card-price"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Daily Price (For 1 day):</strong> $
                      {vehicle.dailyPrice || "N/A"}
                    </p>
                    <p
                      className="card-price"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Price per day (More than 1 day):</strong> $
                      {vehicle.pricePerDay || "N/A"}
                    </p>
                    <p
                      className="card-price"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>ODO Meter :</strong>{" "}
                      {vehicle.currentOdoMeter || "N/A"}
                    </p>
                  </>
                )}
                {isRental && (
                  <>
                    <p
                      className="card-pickup"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Pickup Date:</strong>{" "}
                      {vehicle.pickupDate || "N/A"}
                    </p>
                    <p
                      className="card-dropoff"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Dropoff Date:</strong>{" "}
                      {vehicle.returnDate || "N/A"}
                    </p>
                    <p
                      className="card-deposit"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Deposit:</strong> ${vehicle.deposit || "N/A"}
                    </p>
                    <p
                      className="card-total-price"
                      style={{ margin: "2.5px 0", color: "#555" }}
                    >
                      <strong>Total Price:</strong> $
                      {vehicle.totalPrice || "N/A"}
                    </p>
                  </>
                )}
                <div className="book-btn mt-auto d-flex justify-content-end">
                  {isRental && vehicle.status === "active" && (
                    <>
                      {isPickupDateBeforeToday && (
                        <button
                          className="btn btn-danger btn-sm mt-2 me-2"
                          style={{ height: "30px", fontSize: "12px" }}
                          onClick={() => handleCancelRental(vehicle._id)}
                        >
                          Cancel Rental
                        </button>
                      )}
                      <button
                        className="btn btn-success btn-sm mt-2 me-2"
                        style={{
                          height: "30px",
                          fontSize: "12px",
                          marginLeft: "10px",
                        }}
                        onClick={() => handleDropOffClick(vehicle)}
                      >
                        Drop Off
                      </button>
                    </>
                  )}
                  {!isRental && vehicle?._id && (
                    <Link
                      to={`/vehicle/${vehicle?._id}`}
                      className="btn btn-primary mt-2"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        right: "10px",
                        bottom: "10px",
                        padding: "5px 10px",
                      }}
                    >
                      Book
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="customerdashboard-container">
      <div id="page-top">
        <div id="wrapper">
          <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
            style={{ fontSize: "12px" }}
          >
            <li
              className={`nav-item ${
                activeSection === "dashboard" ? "active" : ""
              }`}
            >
              <a
                className="nav-link text-white"
                onClick={() => setActiveSection("dashboard")}
              >
                <b>CUSTOMER DASHBOARD</b>
              </a>
            </li>
            <hr className="sidebar-divider" />
            <li
              className={`nav-item ${
                activeSection === "vehicles" ? "active" : ""
              }`}
            >
              <a
                className="nav-link"
                onClick={() => setActiveSection("vehicles")}
              >
                <b>Vehicles</b>
                <i
                  className="fas fa-car"
                  style={{ marginLeft: "12px", fontSize: "1.1rem" }}
                ></i>
              </a>
            </li>
            <li
              className={`nav-item ${
                activeSection === "rentals" ? "active" : ""
              }`}
            >
              <a
                className="nav-link"
                onClick={() => setActiveSection("rentals")}
              >
                <b>Rentals</b>
                <i
                  className="fas fa-clipboard-list"
                  style={{ marginLeft: "12px", fontSize: "1.1rem" }}
                ></i>
              </a>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <b>Logout</b>
              </Link>
            </li>
          </ul>

          <div
            id="content-wrapper"
            className="d-flex flex-column"
            style={{ fontSize: "12px" }}
          >
            <div id="content">
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item dropdown no-arrow d-sm-none">
                    <a className="nav-link dropdown-toggle" id="searchDropdown">
                      <i className="fas fa-search fa-fw"></i>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                      aria-labelledby="searchDropdown"
                    >
                      <form className="form-inline mr-auto w-100 navbar-search">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control bg-light border-0 small"
                            placeholder="Search for..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                          />
                          <div className="input-group-append">
                            <button className="btn btn-primary" type="button">
                              <i className="fas fa-search fa-sm"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </li>
                  <div className="topbar-divider d-none d-sm-block"></div>
                  <li className="nav-item dropdown no-arrow">
                    <a
                      className="d-flex align-items-center"
                      style={{
                        textDecoration: "none",
                        color: "grey",
                        marginRight: "10px",
                      }}
                    >
                      <img
                        className="img-profile rounded-circle"
                        src={profileImage}
                        alt="Profile"
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "8px",
                        }}
                      />
                      <span
                        className="d-none d-lg-inline text-bold-600"
                        style={{ fontSize: "12px" }}
                      >
                        {JSON.parse(sessionStorage.getItem("userDetails"))
  ?.email.split("@")[0] || ""}

                        <br></br>Role: Customer
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid" style={{ fontSize: "12px" }}>
                {activeSection === "vehicles" && (
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <select
                        className="form-select"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        style={{ fontSize: "12px" }}
                      >
                        <option value="">All Vehicles</option>
                        <option value="car">Cars</option>
                        <option value="truck">Trucks</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="row" style={{ fontSize: "12px" }}>
                  {activeSection === "vehicles" &&
                  filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle, index) => (
                      <VehicleCard
                        key={vehicle._id || index}
                        vehicle={vehicle}
                      />
                    ))
                  ) : activeSection === "rentals" && rentals.length > 0 ? (
                    rentals.map((rental, index) => (
                      <VehicleCard
                        key={rental._id || index}
                        vehicle={rental}
                        isRental={true}
                      />
                    ))
                  ) : (
                    <h3 style={{ fontSize: "12px" }}>No Vehicles available.</h3>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDropOffModal && currentRental && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowDropOffModal(false)}
            >
              &times;
            </button>
            <h4>Drop Off Vehicle</h4>
            <label className="modal-label">
              Drop-off Odometer:
              <input
                type="number"
                value={dropOffOdometer}
                onChange={(e) => setDropOffOdometer(e.target.value)}
                className="modal-input"
              />
            </label>
            <button onClick={handleDropOffSubmit} className="calculate-button">
              Calculate Total
            </button>

            {odometerDifference > 0 && (
              <div className="payment-section">
                <p>
                  <strong>Odometer Difference:</strong> {odometerDifference}{" "}
                  miles
                </p>
                <p>
                  <strong>Total Charge:</strong> ${totalCharge}
                </p>
                <h5>Enter Payment Details</h5>
                <div className="credit-card-fields">
                  <label className="modal-label">
                    Card Number:
                    <input
                      type="text"
                      name="number"
                      maxLength="16"
                      value={creditCard.number}
                      onChange={handleCreditCardChange}
                      className="modal-input"
                    />
                  </label>
                  <label className="modal-label">
                    Expiry (MM/YY):
                    <input
                      type="text"
                      name="expiry"
                      maxLength="5"
                      value={creditCard.expiry}
                      onChange={handleCreditCardChange}
                      className="modal-input"
                    />
                  </label>
                  <label className="modal-label">
                    CVV:
                    <input
                      type="text"
                      name="cvv"
                      maxLength="3"
                      value={creditCard.cvv}
                      onChange={handleCreditCardChange}
                      className="modal-input"
                    />
                  </label>
                </div>
                <button
                  onClick={() => handlePaymentSubmit(currentRental)}
                  className="pay-button"
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          overflow-y: auto;
        }
        .modal-content {
          position: relative;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          font-family: Arial, sans-serif;
        }
        .close-button {
          position: absolute;
          top: 5px;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          color: #333;
          cursor: pointer;
        }
        h4 {
          font-size: 16px;
          margin-bottom: 15px;
        }
        .modal-label {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          color: #333;
        }
        .modal-input {
          width: 100%;
          padding: 6px;
          margin-top: 4px;
          border-radius: 4px;
          border: 1px solid #ddd;
          font-size: 12px;
        }
        .calculate-button,
        .pay-button {
          margin-top: 12px;
          padding: 8px 14px;
          border-radius: 4px;
          border: none;
          font-size: 12px;
          color: #fff;
          cursor: pointer;
        }
        .calculate-button {
          background-color: #007bff;
        }
        .pay-button {
          background-color: #28a745;
          margin-top: 10px;
          float: right;
        }
        .payment-section {
          margin-top: 12px;
          text-align: left;
          font-size: 12px;
          position: relative;
        }
        .credit-card-fields {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .credit-card-fields .modal-label {
          flex: 1;
          margin-top: 6px;
        }
        .credit-card-fields .modal-input {
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default Customerdashboard;
