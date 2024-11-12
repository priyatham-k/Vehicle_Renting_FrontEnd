import React from "react";
import { Link } from "react-router-dom";

const VehicleCard = ({ vehicle, isRental, onCancelRental, onDropOff }) => (
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
            src={vehicle.imageUrl || ""}
            className="img-fluid rounded-start"
            alt={`${vehicle.make || "N/A"} ${vehicle.model || "N/A"}`}
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
            position: "relative",
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
              {vehicle.make || "N/A"} {vehicle.model || "N/A"}
              {isRental && (
                <span
                  className={`badge ${
                    vehicle.status === "active"
                      ? "badge-success"
                      : vehicle.status === "completed"
                      ? "badge-info"
                      : "badge-danger"
                  }`}
                  style={{
                    fontSize: "10px",
                    padding: "3px 6px",
                    position: "absolute",
                    top: "0",
                    right: "0",
                    borderRadius: "4px",
                  }}
                >
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              )}
            </h5>
            <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
              <strong>Capacity:</strong> <span style={{ fontSize: "10px" }}>5 persons</span>
            </p>
            <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
              <strong>Type:</strong> {vehicle.type || "N/A"}
            </p>
            <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
              <strong>Insurance Cost:</strong>{" "}
              <span style={{ fontSize: "10px" }}>${vehicle.insurance || "N/A"}</span>
            </p>
            <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
              <strong>ODO Meter Reading:</strong>{" "}
              {isRental ? vehicle.vehicleId?.currentOdoMeter : vehicle.currentOdoMeter || "N/A"}
            </p>
            <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
              <strong>Daily Price (For 1 day):</strong>{" "}
              <span style={{ fontSize: "10px" }}>
                ${isRental ? vehicle.vehicleId?.dailyPrice : vehicle.dailyPrice || "N/A"}
              </span>
            </p>
            <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
              <strong>Price / Mile (More than 1 day):</strong>{" "}
              <span style={{ fontSize: "10px" }}>
                ${isRental ? vehicle.vehicleId?.pricePerDay : vehicle.pricePerDay || "N/A"}
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
            {isRental && vehicle.status === "active" ? (
              <>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onCancelRental(vehicle._id)}
                  style={{
                    fontSize: "10px",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    marginRight: "5px",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onDropOff(vehicle)}
                  style={{
                    fontSize: "10px",
                    padding: "5px 10px",
                    borderRadius: "4px",
                  }}
                >
                  Drop Off
                </button>
              </>
            ) : (
              !isRental && (
                <Link
                  to={`/vehicle/${vehicle._id}`}
                  className="btn btn-primary btn-sm"
                  style={{
                    fontSize: "10px",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    marginTop: "10px",
                  }}
                >
                  Book
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default VehicleCard;
