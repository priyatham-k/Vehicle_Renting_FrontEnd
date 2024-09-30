import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VehicleDetails({ vehicles }) {
  const { id } = useParams();
  const vehicle = vehicles.find((v) => v._id === id);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

  const [booking, setBooking] = useState({
    customerId: JSON.parse(sessionStorage.getItem("userDetails"))?._id || "",
    vehicleId: vehicle._id,
    make: vehicle.make,
    model: vehicle.model,
    pickupDate: today,
    returnDate: today,
    rentalDuration: 1,
    pickupAddress: "",
    dropOffAddress: "",
    deposit: 100,
    insurance: vehicle.insurance,
    totalPrice: vehicle.dailyPrice + 100 + vehicle.insurance,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    imageUrl: vehicle.imageUrl,
    type: vehicle.type,
    status: "active",
    returnDeposit: "yes"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  const calculateRentalDuration = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    return returnD <= pickup ? 1 : Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (rentalDuration, pickupAddress, dropOffAddress) => {
    const dailyPrice = vehicle.dailyPrice * rentalDuration;
    const locationFee = pickupAddress !== dropOffAddress ? 100 : 0;
    return dailyPrice + booking.deposit + booking.insurance + locationFee;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBooking((prevBooking) => {
      const updatedBooking = {
        ...prevBooking,
        [name]: value,
      };

      // Calculate rental duration and total price
      if (name === "pickupDate" || name === "returnDate") {
        updatedBooking.rentalDuration = calculateRentalDuration(
          updatedBooking.pickupDate,
          updatedBooking.returnDate
        );
      }

      // Calculate total price whenever pickupAddress or dropOffAddress is changed
      if (name === "pickupAddress" || name === "dropOffAddress") {
        updatedBooking.totalPrice = calculateTotalPrice(
          updatedBooking.rentalDuration,
          updatedBooking.pickupAddress,
          updatedBooking.dropOffAddress
        );
      }

      return updatedBooking;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (booking.cardNumber.length !== 16) {
      setError("Card number must be exactly 16 digits.");
      setLoading(false);
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(booking.expiryDate)) {
      setError("Expiry date must be in MM/YY format.");
      setLoading(false);
      return;
    }

    if (booking.cvv.length !== 3) {
      setError("CVV must be exactly 3 digits.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/customers/rent", booking, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Booking confirmed!");
      navigate("/Customerdashboard");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to confirm the booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-details container mt-3">
      <div className="mt-5">
        <div className="card p-4">
          <div className="row g-0">
            <div className="col-12 col-md-4">
              <img
                src={vehicle.imageUrl}
                className="img-fluid rounded-start"
                alt={`${vehicle.make} ${vehicle.model}`}
              />
            </div>
            <div className="col-12 col-md-8">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {vehicle.make} {vehicle.model}
                </h5>
                <p className="card-capacity">Capacity: 5 persons</p>
                <p className="card-type">Type: {vehicle.type}</p>
                <p className="card-insurance">
                  Insurance Cost: ${vehicle.insurance}
                </p>
                <p className="card-price">Price per day: ${vehicle.dailyPrice}</p>
              </div>
            </div>
          </div>
          <hr />
          <h5>Rental Information</h5>
          <form onSubmit={handleFormSubmit}>
            <div className="form-row row">
              <div className="form-group col-12 col-md-6">
                <label htmlFor="pickupDate">Pickup Date</label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={booking.pickupDate}
                  onChange={handleInputChange}
                  className="form-control"
                  min={today}
                  required
                />
              </div>
              <div className="form-group col-12 col-md-6">
                <label htmlFor="returnDate">Return Date</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={booking.returnDate}
                  onChange={handleInputChange}
                  className="form-control"
                  min={booking.pickupDate || today}
                  required
                />
              </div>
              <div className="form-group col-12">
                <label htmlFor="pickupAddress">Pickup location</label>
                <input
                  type="text"
                  id="pickupAddress"
                  name="pickupAddress"
                  value={booking.pickupAddress}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group col-12">
                <label htmlFor="dropOffAddress">Drop location</label>
                <input
                  type="text"
                  id="dropOffAddress"
                  name="dropOffAddress"
                  value={booking.dropOffAddress}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <h6 className="mt-3">Total Rental Days: {booking.rentalDuration}</h6>
            <h6 className="mt-3">Deposit: ${booking.deposit}</h6>
            <h6 className="mt-3">Total Price: ${booking.totalPrice}</h6>

            <hr />

            <h5>Payment Information</h5>
            <div className="form-row row">
              <div className="form-group col-12">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={booking.cardNumber}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="1234 5678 9123 4567"
                  required
                />
              </div>
              <div className="form-group col-12 col-md-6">
                <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={booking.expiryDate}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group col-12 col-md-6">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={booking.cvv}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
