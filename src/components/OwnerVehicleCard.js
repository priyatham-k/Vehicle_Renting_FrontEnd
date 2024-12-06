import React, { useState } from "react";

const OwnerVehicleCard = ({
  vehicle,
  handleDeleteVehicle,
  handleUpdateVehicle,
}) => {
  console.log(vehicle);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    make: vehicle.make,
    model: vehicle.model,
    capacity: vehicle.capacity,
    type: vehicle.type,
    insurance: vehicle.insurance,
    currentOdoMeter: vehicle.currentOdoMeter,
    dailyPrice: vehicle.dailyPrice,
    pricePerDay: vehicle.pricePerDay,
    imageUrl: vehicle.imageUrl,
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleUpdateVehicle(vehicle._id, editForm);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle. Please try again.");
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file); // Convert image to Base64
    } else {
      setEditForm((prev) => ({ ...prev, imageUrl: "" })); // Reset if no file selected
    }
  };

  return (
    <div className="col-md-6 mb-3">
      <div
        className="card card-custom"
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="row g-0">
          <div className="col-md-6">
            <img
              src={vehicle.imageUrl}
              className="img-fluid rounded-start"
              alt={`${vehicle.make} ${vehicle.model}`}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            className="col-md-6"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h5
                className="card-title"
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {vehicle.make} {vehicle.model}
              </h5>
              <p
                style={{
                  fontSize: "12px",
                  margin: "2.5px 0",
                  color: "#555",
                }}
              >
                <strong>Capacity:</strong>{" "}
                <span style={{ fontSize: "10px" }}>
                  {vehicle.capacity} persons
                </span>
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>Type:</strong> {vehicle.type}
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>Insurance Cost:</strong>{" "}
                <span style={{ fontSize: "10px" }}>${vehicle.insurance}</span>
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>ODO Meter Reading:</strong> {vehicle.currentOdoMeter}
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>Daily Price (For 1 day):</strong>{" "}
                <span style={{ fontSize: "10px" }}>${vehicle.dailyPrice}</span>
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>Price / Mile (More than 1 day):</strong>{" "}
                <span style={{ fontSize: "10px" }}>${vehicle.pricePerDay}</span>
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>Status:</strong>{" "}
                <span
                  className="text-bg-success"
                  style={{ fontSize: "10px", padding: "2px" }}
                >
                  {vehicle.status}
                </span>
              </p>
            </div>
            <div
              className="text-right"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "auto",
              }}
            >
              {vehicle.status === "available" && (
                <button
                  className="btn btn-info"
                  onClick={() => setShowEditModal(true)}
                  style={{
                    fontSize: "10px",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                >
                  Edit
                </button>
              )}
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteVehicle(vehicle._id)}
                style={{
                  fontSize: "10px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "500px" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Vehicle</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="row">
                    {/* Preview Image and Upload */}
                    <div className="col-md-4 text-center">
                      <img
                        src={editForm.imageUrl}
                        alt="Vehicle Preview"
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "150px",
                          maxWidth: "100%",
                          marginBottom: "10px",
                          border: "1px solid #ddd",
                        }}
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="form-control"
                        style={{ fontSize: "12px", padding: "6px" }}
                      />
                    </div>

                    {/* Form Fields */}
                    <div className="col-md-8">
                      <div className="row">
                        {Object.keys(editForm).map((key) => {
                          if (key === "imageUrl") return null; // Skip imageUrl field in the form
                          return (
                            <div className="col-md-6" key={key}>
                              <div className="form-group">
                                <label
                                  htmlFor={key}
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                  }}
                                >
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                {key === "capacity" ? (
                                  // Capacity Dropdown
                                  <select
                                    id={key}
                                    name={key}
                                    value={editForm[key]}
                                    onChange={handleEditChange}
                                    className="form-control"
                                    style={{
                                      fontSize: "12px",
                                      padding: "8px",
                                      marginBottom: "10px",
                                      borderRadius: "4px",
                                    }}
                                    required
                                  >
                                    <option value="5">5</option>
                                    <option value="7">7</option>
                                  </select>
                                ) : key === "type" ? (
                                  // Type Dropdown
                                  <select
                                    id={key}
                                    name={key}
                                    value={editForm[key]}
                                    onChange={handleEditChange}
                                    className="form-control"
                                    style={{
                                      fontSize: "12px",
                                      padding: "8px",
                                      marginBottom: "10px",
                                      borderRadius: "4px",
                                    }}
                                    required
                                  >
                                    <option value="car">Car</option>
                                    <option value="truck">Truck</option>
                                    <option value="suv">SUV</option>
                                  </select>
                                ) : (
                                  // Other Fields
                                  <input
                                    type={
                                      typeof editForm[key] === "number"
                                        ? "number"
                                        : "text"
                                    }
                                    id={key}
                                    name={key}
                                    value={editForm[key]}
                                    onChange={handleEditChange}
                                    className="form-control"
                                    style={{
                                      fontSize: "12px",
                                      padding: "8px",
                                      marginBottom: "10px",
                                      borderRadius: "4px",
                                    }}
                                    required
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-sm w-100"
                    style={{ marginTop: "10px" }}
                  >
                    Save Changes
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

export default OwnerVehicleCard;
