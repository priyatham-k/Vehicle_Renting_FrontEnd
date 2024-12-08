import React from "react";
import OwnerRentalCard from "./OwnerRentalCard";

const OwnerRentalsSection = ({ rentals,vehicles, error }) => (
  <div className="container-fluid">
    <div className="row">
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : rentals.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "20px", marginTop: "50px" }}>No rentals found</p>
      ) : (
        rentals.map((rental) => <OwnerRentalCard key={rental.id} rental={rental} vehicles={vehicles} />)
      )}
    </div>
  </div>
);

export default OwnerRentalsSection;
