import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Customerdashboard() {
  const [vehicles, setVehicles] = useState([]); // State to store vehicle data
  const [rentals, setRentals] = useState([]); // State to store rental data
  const [activeSection, setActiveSection] = useState("vehicles");
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(""); // State to track the selected filter

  // Fetch data from the API on component mount
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/customers/vehicles"
        );
        setVehicles(response.data); // Set vehicles data in the state
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }

    const fetchRentals = async () => {
      try {
        // Retrieve the userDetails object from sessionStorage
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

        // Check if userDetails and _id exist
        if (userDetails && userDetails._id) {
          // Construct the API URL using the _id from userDetails
          const apiUrl = `http://localhost:3001/api/customers/rentals/${userDetails._id}`;

          // Fetch the rentals data specific to the customer
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

    fetchVehicles();
    fetchRentals();
  }, []);

  // Filter vehicles based on selected type (only for vehicles section)
  const filteredVehicles =
    selectedFilter === ""
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.type === selectedFilter);

  // Function to cancel a rental
  const handleCancelRental = async (rentalId) => {
    try {
      // Call the API to cancel the rental using the rental's unique _id
      const cancelUrl = `http://localhost:3001/api/customers/cancel/${rentalId}`;

      // Await the response from the cancellation
      const cancelResponse = await axios.put(cancelUrl);

      // Check if the cancellation was successful
      if (cancelResponse.status === 200) {
        // After successful cancellation, refetch the rentals data
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const rentalsResponse = await axios.get(
          `http://localhost:3001/api/customers/rentals/${userDetails._id}`
        );
        setRentals(rentalsResponse.data);

        alert("Rental canceled successfully!... Money will be refunded... Except the deposit.");
      } else {
        alert("Failed to cancel rental. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling rental:", error);
      alert("Failed to cancel rental. Please try again.");
    }
  };
  const handleDropOffVehicle = async (rentalId) => {
    try {
      // Call the API to drop off the vehicle using the rental's unique _id
      const dropOffUrl = `http://localhost:3001/api/customers/rentals/dropoff/${rentalId}`;

      // Await the response from the drop-off API
      const dropOffResponse = await axios.put(dropOffUrl);

      // Check if the drop-off was successful
      if (dropOffResponse.status === 200) {
        // After successful drop-off, refetch the rentals data
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const rentalsResponse = await axios.get(
          `http://localhost:3001/api/customers/rentals/${userDetails._id}`
        );
        setRentals(rentalsResponse.data);

        alert("Vehicle drop-off completed successfully!");
      } else {
        alert("Failed to complete vehicle drop-off. Please try again.");
      }
    } catch (error) {
      console.error("Error completing vehicle drop-off:", error);
      alert("Failed to complete vehicle drop-off. Please try again.");
    }
  };

  // Card Component for Vehicles and Rentals
  const VehicleCard = ({ vehicle, isRental }) => {
    const isPickupDateBeforeToday = new Date(vehicle.pickupDate) <= new Date(); // Check if pickup date is before today

    return (
      <div key={vehicle.id || vehicle._id} className="col-md-6 mb-3">
        <div className="card card-custom position-relative">
          {/* Status Badge */}
          {isRental && (
            <span
              className="badge badge-info position-absolute"
              style={{ top: "10px", right: "10px" }}
            >
              Status: {vehicle.status}
            </span>
          )}
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={vehicle.imageUrl}
                className="img-fluid rounded-start"
                alt={`${vehicle.make} ${vehicle.model}`}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {vehicle.make} {vehicle.model}
                </h5>
                {!isRental && (
                  <>
                    <p className="card-capacity">
                      Capacity: {vehicle.capacity} people
                    </p>
                    <p className="card-type">Type: {vehicle.type}</p>
                    <p className="card-insurance">
                      Insurance: ${vehicle.insurance}
                    </p>
                    <p className="card-price">
                      Price per day: ${vehicle.dailyPrice}
                    </p>
                  </>
                )}
                {isRental && (
                  <>
                    <p className="card-pickup">
                      Pickup Date: {vehicle.pickupDate}
                    </p>
                    <p className="card-dropoff">
                      Dropoff Date: {vehicle.returnDate}
                    </p>
                    {/* <p className="card-total-days">
                      Total Days: {vehicle.totalDays}
                    </p> */}

                    <p className="card-deposit">Deposit: ${vehicle.deposit}</p>
                    <p className="card-total-price">
                      Total Price: ${vehicle.totalPrice}
                    </p>
                  </>
                )}

                {/* Show buttons for rentals based on status and pickup date */}
                <div className="book-btn mt-auto">
                  {isRental && vehicle.status === "active" && (
                    <>
                      {new Date(vehicle.pickupDate) <= new Date() ? (
                        // Show Cancel button if the pickup date is today or before
                        <button
                          className="btn btn-danger mt-2 me-2"
                          style={{ height: "38px" }}
                          onClick={() => handleCancelRental(vehicle._id)} // Using _id to cancel rental
                        >
                          Cancel Rental
                        </button>
                      ) : null}

                      {/* Always show Drop Off button if the rental is active */}
                      <button
                        className="btn btn-success mt-2"
                        style={{ height: "38px", marginLeft: "10px" }} // Adjust the height to match badge size
                        onClick={() => handleDropOffVehicle(vehicle._id)}
                      >
                        Drop Off
                      </button>
                    </>
                  )}
                  {!isRental && (
                    <Link
                      to={`/vehicle/${vehicle._id}`}
                      className="btn btn-primary mt-auto"
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
    <div>
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
                className="nav-link text-white"
                onClick={() => setActiveSection("dashboard")}
              >
                <b>CUSTOMER DASHBOARD</b>
              </a>
            </li>

            <hr className="sidebar-divider" />
            <div className="sidebar-heading"></div>

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
                <b>Vehicles</b>
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

            {/* Logout Nav Item */}
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <b>Logout</b>
              </Link>
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
                  <li className="nav-item dropdown no-arrow d-sm-none">
                    <a
                      className="nav-link dropdown-toggle"
                      id="searchDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
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
                    <a>
                      <span className="mr-2 d-none d-lg-inline text-bold-600 ">
                        {JSON.parse(sessionStorage.getItem("userDetails"))
                          ?.name || ""}
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid">
                
                {/* Filter Section only for Vehicles */}
                {activeSection === "vehicles" && (
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <select
                        className="form-select"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                      >
                        <option value="">All Vehicles</option>
                        <option value="car">Cars</option>
                        <option value="truck">Trucks</option>
                      </select>
                    </div>
                    <div className="col-md-6 text-end">
                      {/* <button
                        className="btn btn-secondary"
                        onClick={() => setSelectedFilter("")}
                      >
                        Clear Filter
                      </button> */}
                    </div>
                  </div>
                )}

                <div className="row">
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
                        key={rental._id || index} // Using _id as rental ID
                        vehicle={rental}
                        isRental={true} // Pass true for rentals
                      />
                    ))
                  ) : (
                    <h3>No Vehicles available.</h3>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customerdashboard;
