import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VehicleDetails() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [booking, setBooking] = useState(null);
  const [locations, setLocations] = useState([]); // State for locations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await axios.get("http://localhost:3001/api/vehicles/");
        setVehicles(response.data);

        const selectedVehicle = response.data.find((v) => v._id === id);
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (selectedVehicle) {
          setVehicle(selectedVehicle);
          setBooking({
            customerId: userDetails?.customer?.id || "",
            vehicleId: selectedVehicle._id,
            make: selectedVehicle.make,
            model: selectedVehicle.model,
            pickupDate: today,
            returnDate: today,
            rentalDuration: 1,
            pickupAddress: "",
            dropOffAddress: "",
            deposit: 100,
            insurance: selectedVehicle.insurance || 0,
            totalPrice: (selectedVehicle.dailyPrice || 0) + 100 + (selectedVehicle.insurance || 0),
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            imageUrl: selectedVehicle.imageUrl,
            type: selectedVehicle.type,
            status: "active",
            returnDeposit: "yes",
            pricePerDay: selectedVehicle.pricePerDay || 0,
            currentOdoMeter: selectedVehicle.currentOdoMeter,
          });
        } else {
          setError("Vehicle not found");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to fetch vehicles");
      }
    }

    async function fetchLocations() {
      try {
        const response = await axios.get("http://localhost:3001/api/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setError("Failed to fetch locations");
      }
    }

    fetchVehicles();
    fetchLocations();
  }, [id, today]);

  const calculateRentalDuration = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    return returnD <= pickup
      ? 1
      : Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (rentalDuration, pickupAddress, dropOffAddress) => {
    const locationFee = pickupAddress !== dropOffAddress ? 100 : 0;
    const insurance = booking.insurance || 0;
    const deposit = booking.deposit || 0;

    if (rentalDuration > 1) {
      return deposit + (insurance * rentalDuration) + locationFee;
    } else {
      const basePrice = vehicle?.dailyPrice || 0;
      return basePrice + deposit + insurance + locationFee;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBooking((prevBooking) => {
      const updatedBooking = {
        ...prevBooking,
        [name]: value,
      };

      if (name === "pickupDate" || name === "returnDate") {
        updatedBooking.rentalDuration = calculateRentalDuration(
          updatedBooking.pickupDate,
          updatedBooking.returnDate
        );
      }

      updatedBooking.totalPrice = calculateTotalPrice(
        updatedBooking.rentalDuration,
        updatedBooking.pickupAddress,
        updatedBooking.dropOffAddress
      );

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
      await axios.post("http://localhost:3001/api/rentals/rent", booking, {
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

  if (!vehicle) {
    return <div style={{ fontSize: "12px" }}>Vehicle not found</div>;
  }

  return (
    <div className="vehicle-details container mt-3" style={{ fontSize: "12px" }}>
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
                <p><strong>Capacity:</strong> {vehicle.capacity || "5"} people</p>
                <p><strong>Insurance:</strong> ${vehicle.insurance || "N/A"}</p>
                <p><strong>Daily Price:</strong> ${vehicle.dailyPrice || "N/A"}</p>
                <p><strong>Price per Mile:</strong> ${vehicle.pricePerDay || "N/A"}</p>
                <p><strong>ODO Meter:</strong> {vehicle.currentOdoMeter || "N/A"}</p>
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
                  style={{ fontSize: "12px", padding: "6px", height: "32px" }}
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
                  style={{ fontSize: "12px", padding: "6px", height: "32px" }}
                  min={booking.pickupDate || today}
                  required
                />
              </div>
              <div className="form-group col-12 col-md-6">
                <label htmlFor="pickupAddress">Pickup location</label>
                <select
                  id="pickupAddress"
                  name="pickupAddress"
                  value={booking.pickupAddress}
                  onChange={handleInputChange}
                  className="form-control"
                  style={{ fontSize: "12px", padding: "6px", height: "32px" }}
                  required
                >
                  <option value="">Select Pickup Location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location.name}>
                      {location.name} {"("+location.address+")"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-12 col-md-6">
                <label htmlFor="dropOffAddress">
                  Drop location ($100 fee if different from pickup)
                </label>
                <select
                  id="dropOffAddress"
                  name="dropOffAddress"
                  value={booking.dropOffAddress}
                  onChange={handleInputChange}
                  className="form-control"
                  style={{ fontSize: "12px", padding: "6px", height: "32px" }}
                  required
                >
                  <option value="">Select Drop Location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location.name}>
                      {location.name} {"("+location.address+")"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Information Section */}
            <div className="d-flex flex-column align-items-end mt-3">
              <h6>Total Rental Days: {booking.rentalDuration}</h6>
              <h6>Deposit: ${booking.deposit}</h6>
              <h6>Total Price: ${booking.totalPrice}</h6>
              {booking.rentalDuration > 1 && (
                <p style={{ fontSize: "12px", color: "red" }}>
                  Note: Price per mile will apply to the rental. Additional charges can be paid during drop-off.
                </p>
              )}
            </div>

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
                  style={{ fontSize: "12px", padding: "6px", height: "32px" }}
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
                  style={{ fontSize: "12px", padding: "6px", height: "32px" }}
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
                  style={{ fontSize: "12px", padding: "6px", height: "32px" }}
                  required
                />
              </div>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ fontSize: "12px", padding: "6px 12px" }}
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
