import axios from "axios";
import React, { useEffect, useState } from "react";
import DropOffModal from "./DropOffModal";

const OwnerRentalCard = ({ rental, vehicles, error }) => {
  // Extract the customer's name from the email (prefix before @)
  const rentedBy = rental.customerId?.firstName || "Unknown";
  const [showDropOffModal, setShowDropOffModal] = useState(false);
  const [dropOffOdometer, setDropOffOdometer] = useState("");
  const [odometerDifference, setOdometerDifference] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const [startingOdometer, setStartingOdometer] = useState("");
  const [fuelLevel, setFuelLevel] = useState("full");
  const [pickupTime, setPickupTime] = useState("");
  const [showApproveFields, setShowApproveFields] = useState(false);

  const handleDropOff = async () => {
    setOdometerDifference("");
    setDropOffOdometer("");
    setShowDropOffModal(true);
  };

  const handlePaymentSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/rentals/dropoff/${rental._id}`,
        {
          totalCharge: rental.totalPrice,
          newOdometer: dropOffOdometer,
        }
      );
      if (response?.data?.rental?.vehicleId !== null) {
        alert(
          "Vehicle drop-off completed successfully!....Page will Fetching Latest Data..."
        );
        setShowDropOffModal(false);
        window.location.reload();
      }
    } catch (error) {}
  };

  const handleDropOffSubmit = () => {
    if (parseInt(dropOffOdometer) <= parseInt(rental.currentOdoMeter)) {
      alert(
        "Drop-off odometer reading should be higher than the previous reading."
      );
      return;
    }
    const difference =
      parseInt(dropOffOdometer) - parseInt(rental.currentOdoMeter);
    const charge =
      parseInt(difference) * parseInt(rental?.vehicleId?.pricePerDay);
    setOdometerDifference(difference);
    setTotalCharge(charge);
  };

  const handleApprove = async () => {
    try {
      const payload = {
        startingOdometer,
        fuelLevel,
        pickupTime,
      };
  
      // Log the fields for debugging
      console.log("Payload for approval:", payload);
  
      // Make an API call to update the rental
      const response = await axios.put(
        `http://localhost:3001/api/rentals/rentalUpdate/${rental._id}`, // Adjust the URL to your backend route
        payload
      );
  
      if (response.status === 200) {
        alert("Approval process completed successfully!");
        // Optionally refresh or update the UI
        window.location.reload();
      } else {
        alert("Failed to approve rental. Please try again.");
      }
    } catch (error) {
      console.error("Error approving rental:", error);
      alert("An error occurred while approving the rental.");
    }
  };
  

  return (
    <div className="col-md-6 mb-3">
      <div className="card card-custom position-relative">
        <div className="row g-0">
          <div className="col-md-4" style={{ width: "40%" }}>
            <img
              src={rental.imageUrl}
              className="img-fluid rounded-start"
              alt={`${rental.make} ${rental.model}`}
              style={{
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="col-md-8" style={{ width: "60%" }}>
            {/* Status Badge */}
            <span
              className={`badge position-absolute top-0 end-0 ${
                rental.status === "Cancelled"
                  ? "bg-danger"
                  : rental.status === "Completed"
                  ? "bg-success"
                  : "bg-primary"
              }`}
              style={{
                fontSize: "12px",
                color: "#fff",
                padding: "3px 6px",
                borderRadius: "4px",
                margin: "8px",
              }}
            >
              {rental.status}
            </span>

            <div className="card-body d-flex flex-column">
              <h5
                className="card-title"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                {rental.make} {rental.model}
              </h5>
              <p
                className="card-rental-date"
                style={{
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "#555",
                }}
              >
                <strong>Rented by:</strong> {rentedBy}
              </p>
              <p
                className="card-rental-date"
                style={{
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "#555",
                }}
              >
                <strong>Pickup Date:</strong> {rental.pickupDate}
              </p>
              <p
                className="card-return-date"
                style={{
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "#555",
                }}
              >
                <strong>Return Date:</strong> {rental.returnDate}
              </p>
              <p
                className="card-total-price"
                style={{
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "#555",
                }}
              >
                <strong>Total Price:</strong> ${rental.totalPrice}
              </p>
              <p
                className="card-total-price"
                style={{
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "#555",
                }}
              >
                <strong>Days Rented:</strong> {rental.rentalDuration} days
              </p>
            </div>
            <div
              className="text-right"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              {rental.status === "active" && (
                <button
                  className="btn btn-info btn-sm"
                  onClick={handleDropOff}
                  style={{
                    fontSize: "10px",
                    padding: "5px 7px",
                    borderRadius: "4px",
                    color: "white",
                  }}
                >
                  Drop Off
                </button>
              )}

              {rental.status === "Waiting For Approval" && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setShowApproveFields(true)}
                  style={{
                    fontSize: "10px",
                    padding: "5px 7px",
                    borderRadius: "4px",
                    color: "white",
                  }}
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Approval Fields */}
        {showApproveFields && (
          <div className="approval-fields" style={{ marginTop: "10px" }}>
            <div>
              <label>Starting Odometer:</label>
              <input
                type="number"
                className="form-control"
                value={startingOdometer}
                onChange={(e) => setStartingOdometer(e.target.value)}
              />
            </div>
            <div>
              <label>Fuel Level:</label>
              <select
                className="form-control"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
              >
                <option value="Full">Full</option>
                <option value="Half">Half</option>
                <option value="Almost Empty">Almost Empty</option>
              </select>
            </div>
            <div>
              <label>Pickup Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={handleApprove}
            >
              Submit Approval
            </button>
          </div>
        )}
      </div>
      <DropOffModal
        isOpen={showDropOffModal}
        onClose={() => setShowDropOffModal(false)}
        rental={rental}
        setDropOffOdometer={setDropOffOdometer}
        totalCharge={totalCharge}
        odometerDifference={odometerDifference}
        onPaymentSubmit={handlePaymentSubmit}
        onCalculate={handleDropOffSubmit}
      />
    </div>
  );
};

export default OwnerRentalCard;
