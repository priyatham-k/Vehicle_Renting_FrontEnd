import React, { useState, useEffect } from "react";
import axios from "axios";

const OwnerLocationsSection = () => {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    id: null,
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/locations");
        setLocations(response.data);
      } catch (err) {
        setError("Failed to fetch locations.");
      }
    };

    fetchLocations();
  }, []);

  const validateForm = () => {
    let errors = {};
    if (!currentLocation.name) errors.name = "Location name is required.";
    if (!currentLocation.address) errors.address = "Address is required.";
    if (!currentLocation.city) errors.city = "City is required.";
    if (!currentLocation.state) errors.state = "State is required.";
    if (!currentLocation.zipCode) errors.zipCode = "Zip code is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        if (isEditing) {
          // Update location
          const response = await axios.put(
            `http://localhost:3001/api/locations/${currentLocation.id}`,
            {
              name: currentLocation.name,
              address: currentLocation.address,
              city: currentLocation.city,
              state: currentLocation.state,
              zipCode: currentLocation.zipCode,
            }
          );
          setLocations((prevLocations) =>
            prevLocations.map((loc) =>
              loc._id === currentLocation.id ? response.data.location : loc
            )
          );
        } else {
          // Add new location
          const response = await axios.post(
            "http://localhost:3001/api/locations/add",
            {
              name: currentLocation.name,
              address: currentLocation.address,
              city: currentLocation.city,
              state: currentLocation.state,
              zipCode: currentLocation.zipCode,
            }
          );
          setLocations((prevLocations) => [...prevLocations, response.data.location]);
        }
        setCurrentLocation({
          id: null,
          name: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
        });
        setShowModal(false);
        setIsEditing(false);
      } catch (err) {
        setError("Failed to save location.");
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleEditClick = (location) => {
    setCurrentLocation({
      id: location._id,
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await axios.delete(`http://localhost:3001/api/locations/${id}`);
        setLocations((prevLocations) =>
          prevLocations.filter((location) => location._id !== id)
        );
      } catch (err) {
        setError("Failed to delete location.");
      }
    }
  };

  return (
    <div className="locations-section">
      <h2 style={{ fontSize: "14px", fontWeight: "bold" }}>Locations</h2>
      <button
        className="btn btn-primary btn-sm mb-3"
        onClick={() => {
          setCurrentLocation({
            id: null,
            name: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
          });
          setShowModal(true);
          setIsEditing(false);
        }}
        style={{
          top: "10px",
          right: "10px",
          fontSize: "12px",
          padding: "5px 10px",
          float: "right",
        }}
      >
        Add Location
      </button>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ fontSize: "12px" }}>Location Name</th>
            <th style={{ fontSize: "12px" }}>Address</th>
            <th style={{ fontSize: "12px" }}>City</th>
            <th style={{ fontSize: "12px" }}>State</th>
            <th style={{ fontSize: "12px" }}>Zip Code</th>
            <th style={{ fontSize: "12px", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location._id}>
              <td style={{ fontSize: "12px" }}>{location.name}</td>
              <td style={{ fontSize: "12px" }}>{location.address}</td>
              <td style={{ fontSize: "12px" }}>{location.city}</td>
              <td style={{ fontSize: "12px" }}>{location.state}</td>
              <td style={{ fontSize: "12px" }}>{location.zipCode}</td>
              <td style={{ textAlign: "center" }}>
                <button
                  className="btn btn-sm btn-warning mx-1"
                  onClick={() => handleEditClick(location)}
                  style={{ fontSize: "10px" }}
                >
                  <i className="fas fa-edit"></i>
                </button>
                {/* <button
                  className="btn btn-sm btn-danger mx-1"
                  onClick={() => handleDeleteClick(location._id)}
                  style={{ fontSize: "10px" }}
                >
                  <i className="fas fa-trash"></i>
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="modal-dialog"
            role="document"
            style={{
              maxWidth: "300px",
              margin: "auto",
            }}
          >
            <div
              className="modal-content"
              style={{
                padding: "15px",
                fontSize: "12px",
              }}
            >
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {isEditing ? "Edit Location" : "Add Location"}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                  style={{
                    fontSize: "14px",
                    color: "#999",
                    background: "none",
                    border: "none",
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" style={{ fontSize: "12px" }}>
                      Location Name
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formErrors.name && "is-invalid"
                      }`}
                      id="name"
                      value={currentLocation.name}
                      onChange={(e) =>
                        setCurrentLocation({
                          ...currentLocation,
                          name: e.target.value,
                        })
                      }
                      style={{
                        fontSize: "12px",
                        padding: "5px",
                      }}
                    />
                    {formErrors.name && (
                      <div
                        className="invalid-feedback"
                        style={{ fontSize: "10px" }}
                      >
                        {formErrors.name}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="address" style={{ fontSize: "12px" }}>
                      Address
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formErrors.address && "is-invalid"
                      }`}
                      id="address"
                      value={currentLocation.address}
                      onChange={(e) =>
                        setCurrentLocation({
                          ...currentLocation,
                          address: e.target.value,
                        })
                      }
                      style={{
                        fontSize: "12px",
                        padding: "5px",
                      }}
                    />
                    {formErrors.address && (
                      <div
                        className="invalid-feedback"
                        style={{ fontSize: "10px" }}
                      >
                        {formErrors.address}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="city" style={{ fontSize: "12px" }}>
                      City
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formErrors.city && "is-invalid"
                      }`}
                      id="city"
                      value={currentLocation.city}
                      onChange={(e) =>
                        setCurrentLocation({
                          ...currentLocation,
                          city: e.target.value,
                        })
                      }
                      style={{
                        fontSize: "12px",
                        padding: "5px",
                      }}
                    />
                    {formErrors.city && (
                      <div
                        className="invalid-feedback"
                        style={{ fontSize: "10px" }}
                      >
                        {formErrors.city}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state" style={{ fontSize: "12px" }}>
                      State
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formErrors.state && "is-invalid"
                      }`}
                      id="state"
                      value={currentLocation.state}
                      onChange={(e) =>
                        setCurrentLocation({
                          ...currentLocation,
                          state: e.target.value,
                        })
                      }
                      style={{
                        fontSize: "12px",
                        padding: "5px",
                      }}
                    />
                    {formErrors.state && (
                      <div
                        className="invalid-feedback"
                        style={{ fontSize: "10px" }}
                      >
                        {formErrors.state}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode" style={{ fontSize: "12px" }}>
                      Zip Code
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formErrors.zipCode && "is-invalid"
                      }`}
                      id="zipCode"
                      value={currentLocation.zipCode}
                      onChange={(e) =>
                        setCurrentLocation({
                          ...currentLocation,
                          zipCode: e.target.value,
                        })
                      }
                      style={{
                        fontSize: "12px",
                        padding: "5px",
                      }}
                    />
                    {formErrors.zipCode && (
                      <div
                        className="invalid-feedback"
                        style={{ fontSize: "10px" }}
                      >
                        {formErrors.zipCode}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm w-100"
                    style={{
                      fontSize: "12px",
                      padding: "5px",
                    }}
                  >
                    {isEditing ? "Update Location" : "Add Location"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerLocationsSection;
