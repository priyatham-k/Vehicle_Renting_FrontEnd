import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import VehicleCard from "./VehicleCard";
import DropOffModal from "./DropOffModal";
import profileImage from "../assets/undraw_profile_1.svg";

const CustomerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [activeSection, setActiveSection] = useState("vehicles");
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showDropOffModal, setShowDropOffModal] = useState(false);
  const [dropOffOdometer, setDropOffOdometer] = useState("");
  const [currentRental, setCurrentRental] = useState(null);
  const [creditCard, setCreditCard] = useState({ number: "", expiry: "", cvv: "" });
  const [odometerDifference, setOdometerDifference] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/customers/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    const fetchRentals = async () => {
      try {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (userDetails && userDetails._id) {
          const apiUrl = `http://localhost:3001/api/customers/rentals/${userDetails._id}`;
          const rentalsResponse = await axios.get(apiUrl);
          setRentals(rentalsResponse.data);
        } else {
          throw new Error("User ID not found in session storage.");
        }
      } catch (err) {
        setError("Failed to fetch rentals data.");
        console.error(err);
      }
    };

    fetchVehicles();
    fetchRentals();
  }, []);

  const handleDropOffClick = (rental) => {
    setCurrentRental(rental);
    setShowDropOffModal(true);
  };

  const handleCancelRental = async (rentalId) => {
    try {
      const cancelUrl = `http://localhost:3001/api/customers/cancel/${rentalId}`;
      const cancelResponse = await axios.put(cancelUrl);

      if (cancelResponse.status === 200) {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const rentalsResponse = await axios.get(
          `http://localhost:3001/api/customers/rentals/${userDetails._id}`
        );
        setRentals(rentalsResponse.data);
        alert(
          "Rental canceled successfully!...Money will be refunded in 4-7 business days."
        );
      } else {
        alert("Failed to cancel rental. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling rental:", error);
      alert("Failed to cancel rental. Please try again.");
    }
  };

  const handleDropOffSubmit = () => {
    if (
      parseInt(dropOffOdometer) <=
      parseInt(currentRental?.vehicleId?.currentOdoMeter)
    ) {
      alert(
        "Drop-off odometer reading should be higher than the previous reading."
      );
      return;
    }
    const difference =
      parseInt(dropOffOdometer) - parseInt(currentRental?.vehicleId?.currentOdoMeter);
    const charge = difference * parseInt(currentRental?.vehicleId?.pricePerDay);
    setOdometerDifference(difference);
    setTotalCharge(charge);
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setCreditCard((prev) => ({ ...prev, [name]: value }));
  };

  const validateCreditCard = () => {
    const cardRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;
    return (
      cardRegex.test(creditCard.number) &&
      expiryRegex.test(creditCard.expiry) &&
      cvvRegex.test(creditCard.cvv)
    );
  };

  const handlePaymentSubmit = async () => {
    if (!validateCreditCard()) {
      alert("Invalid credit card details. Please check and try again.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/customers/rentals/dropoff/${currentRental._id}`,
        {
          totalCharge,
        }
      );
      if (response?.data?.rental?.vehicleId !== null) {
        alert("Vehicle drop-off completed successfully!");
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const rentalsResponse = await axios.get(
          `http://localhost:3001/api/customers/rentals/${userDetails._id}`
        );
        setRentals(rentalsResponse.data);
      } else {
        alert("Vehicle drop-off failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in vehicle drop-off:", error);
      alert("Vehicle drop-off failed. Please try again.");
    }
    setShowDropOffModal(false);
  };

  return (
    <div id="page-top" style={{ minHeight: "100vh", display: "flex" }}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="content-wrapper" style={{ flex: 1}}>
        <Topbar profileImage={profileImage} />
        <div className="container-fluid" style={{ padding: "20px" }}>
          <div className="row justify-content-center">
            {activeSection === "vehicles" && vehicles.length === 0 && (
              <p className="text-center" style={{ color: "#666", fontSize: "18px" }}>
                No vehicles available at the moment.
              </p>
            )}
            {activeSection === "rentals" && rentals.length === 0 && (
              <p className="text-center" style={{ color: "#666", fontSize: "18px" }}>
                No rentals available at the moment.
              </p>
            )}
            {activeSection === "vehicles" &&
              vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            {activeSection === "rentals" &&
              rentals.map((rental) => (
                <VehicleCard
                  key={rental._id}
                  vehicle={rental}
                  isRental
                  onDropOff={handleDropOffClick}
                  onCancelRental={handleCancelRental}
                />
              ))}
          </div>
        </div>
      </div>
      <DropOffModal
        isOpen={showDropOffModal}
        onClose={() => setShowDropOffModal(false)}
        rental={currentRental}
        dropOffOdometer={dropOffOdometer}
        setDropOffOdometer={setDropOffOdometer}
        onCalculate={handleDropOffSubmit}
        totalCharge={totalCharge}
        odometerDifference={odometerDifference}
        onPaymentSubmit={handlePaymentSubmit}
        creditCard={creditCard}
        handleCreditCardChange={handleCreditCardChange}
      />
    </div>
  );
};

export default CustomerDashboard;
