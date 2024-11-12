import React, { useEffect } from "react";

// Helper function to calculate days between two dates
const calculateDaysRented = (pickupDate, returnDate) => {
  const pickup = new Date(pickupDate);
  const drop = new Date(returnDate);
  return Math.floor((drop - pickup) / (1000 * 60 * 60 * 24));
};

const OwnerRentalCard = ({ rental }) => {
  // Extract the customer's name from the email (prefix before @)
  const rentedBy = rental.customerId?.email.split("@")[0] || "Unknown";

  // Calculate the days rented
  const daysRented = calculateDaysRented(rental.pickupDate, rental.returnDate);

  // Log rental details
  useEffect(() => {
    console.log("Rental Details:", rental);
  }, [rental]);

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
                <strong>Days Rented:</strong> {daysRented} days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRentalCard;
