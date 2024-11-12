import React from "react";

const OwnerVehicleCard = ({ vehicle, handleDeleteVehicle }) => (
  <div className="col-md-6 mb-3">
    <div
      className="card card-custom"
      style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
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
              <span style={{ fontSize: "10px" }}>5 persons</span>
            </p>
            <p
              style={{
                fontSize: "12px",
                margin: "2.5px 0",
                color: "#555",
              }}
            >
              <strong>Type:</strong> {vehicle.type}
            </p>
            <p
              style={{
                fontSize: "12px",
                margin: "2.5px 0",
                color: "#555",
              }}
            >
              <strong>Insurance Cost:</strong>{" "}
              <span style={{ fontSize: "10px" }}>${vehicle.insurance}</span>
            </p>
            <p
              style={{
                fontSize: "12px",
                margin: "2.5px 0",
                color: "#555",
              }}
            >
              <strong>ODO Meter Reading:</strong> {vehicle.currentOdoMeter}
            </p>
            <p
              style={{
                fontSize: "12px",
                margin: "2.5px 0",
                color: "#555",
              }}
            >
              <strong>Daily Price (For 1 day):</strong>{" "}
              <span style={{ fontSize: "10px" }}>${vehicle.dailyPrice}</span>
            </p>
            <p
              style={{
                fontSize: "12px",
                margin: "2.5px 0",
                color: "#555",
              }}
            >
              <strong>Price / Mile (More than 1 day):</strong>{" "}
              <span style={{ fontSize: "10px" }}>${vehicle.pricePerDay}</span>
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
  </div>
);

export default OwnerVehicleCard;
