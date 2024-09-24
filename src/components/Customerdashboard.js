import React, { useEffect, useState } from "react";
import axios from "axios"; // You can use axios or fetch for API requests
import { Link } from "react-router-dom";
function Customerdashboard() {
  const [vehicles, setVehicles] = useState([]); // State to store vehicle data

  // Fetch data from the API on component mount
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await axios.get("http://localhost:3001/api/customers/vehicles");
        setVehicles(response.data); // Set vehicles data in the state
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }
    fetchVehicles();
  }, []);
  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-laugh-wink"></i>
              </div>
              <div className="sidebar-brand-text mx-3">
                SB Admin <sup>2</sup>
              </div>
            </a>
            <hr className="sidebar-divider my-0"></hr>
            <li className="nav-item active">
              <a className="nav-link">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <hr className="sidebar-divider"></hr>
            <div className="sidebar-heading">Interface</div>
            <li className="nav-item">
              <a className="nav-link collapsed">
                <span>Payments</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed">
                <span>Rentals</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed">
              <Link to="/">
                <span>Logout</span>
              </Link>
              </a>
            </li>
          </ul>
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
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
                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                      <form className="form-inline mr-auto w-100 navbar-search">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control bg-light border-0 small"
                            placeholder="Search for..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                          ></input>
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
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                      <a className="dropdown-item">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                      </a>
                      <a className="dropdown-item">
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Settings
                      </a>
                      <a className="dropdown-item">
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                        Activity Log
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" data-toggle="modal" data-target="#logoutModal">
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>
              <div className="container-fluid">
                <div className="row">
                  {vehicles.map((vehicle, index) => (
                    <div key={vehicle.id || index} className="col-md-6 mb-3">
                      <div className="card card-custom">
                        <div className="row g-0">
                          <div className="col-md-4">
                            <img src={vehicle.imageUrl} className="img-fluid rounded-start" alt={`${vehicle.make} ${vehicle.model}`} />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title">
                                {vehicle.make} {vehicle.model}
                              </h5>
                              <p className="card-capacity">Capacity: {vehicle.capacity} persons</p>
                              <p className="card-type">Type: {vehicle.type}</p>
                              <p className="card-insurance">Insurance Cost: {vehicle.insuranceCost}%</p>
                              <p className="card-price">Price per day: ${vehicle.dailyPrice}</p>
                              <div className="book-btn mt-auto">
                                <a className="btn btn-primary"><Link to={`/vehicle/${vehicle._id}`} className="btn btn-primary mt-auto">Book</Link></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customerdashboard;
