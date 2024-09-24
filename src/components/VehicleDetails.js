import React, { useState } from "react";
import { useParams } from "react-router-dom";

function VehicleDetails({ vehicles }) {
  const { id } = useParams();
  const vehicle = vehicles.find((v) => v._id === id);
  const [booking, setbooking] = useState({
    customerId: "",
    vehicleId: vehicle._id,
    rentalDuration: "",
    pickupAddress: "",
    dropOffAddress: "",
    deposit: "100",
    insurance: "",
    totalPrice: "",
  });
  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Submit", setbooking);
  };

  const handleInputChange = (e) => {
    setbooking({
      ...setbooking,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="vehicle-details container mt-3">
      <div className=" mt-5">
        <div className="card ">
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
              </div>
            </div>
          </div>
          <hr></hr>
          <h5>Rental Information</h5>
          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="days">Days</label>
                <input type="text" id="days" name="days" value={booking.rentalDuration} onChange={handleInputChange} required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="Pickup">Pickup location</label>
                <input type="text" id="Pickup" name="Pickup" value={booking.pickupAddress} onChange={handleInputChange} required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="Drop">Drop location</label>
                <input type="text" id="Drop" name="Drop" value={booking.dropOffAddress} onChange={handleInputChange} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
