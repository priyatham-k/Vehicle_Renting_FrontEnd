import React from "react";
import OwnerVehicleCard from "./OwnerVehicleCard";

const OwnerVehiclesSection = ({ vehicles, error, setShowModal, handleDeleteVehicle ,handleUpdateVehicle}) => (
    
  <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <button onClick={() => setShowModal(true)} className="btn btn-sm btn-primary mb-3 float-right mr-4">
          Add Vehicle
        </button>
      </div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : vehicles.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "20px", marginTop: "50px" }}>No vehicles found!</p>
      ) : (
        vehicles.map((vehicle) => <OwnerVehicleCard key={vehicle.id} vehicle={vehicle} handleDeleteVehicle={handleDeleteVehicle} handleUpdateVehicle={handleUpdateVehicle}  />)
      )}
    </div>
  </div>
);

export default OwnerVehiclesSection;
