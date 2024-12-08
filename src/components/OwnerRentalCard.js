import axios from "axios";
import React, { useEffect, useState } from "react";
import DropOffModal from "./DropOffModal";
const OwnerRentalCard = ({rental, vehicles, error }) => {
  // Extract the customer's name from the email (prefix before @)
  const rentedBy = rental.customerId?.firstName || "Unknown";
  const [showDropOffModal, setShowDropOffModal] = useState(false);
  const [dropOffOdometer, setDropOffOdometer] = useState("");
  const [odometerDifference, setOdometerDifference] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const [currentRental, setCurrentRental] = useState(null);
  const [rentals, setRentals] = useState([]);


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
        alert("Vehicle drop-off completed successfully!....Page will Fetching Latest Data...");
        setShowDropOffModal(false);
        window.location.reload();
      } 
    } catch (error) {
      
    }
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
            </div>
          </div>
        </div>
      </div>{" "}
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
