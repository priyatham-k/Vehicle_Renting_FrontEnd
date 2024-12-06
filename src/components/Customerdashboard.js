import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import VehicleCard from "./VehicleCard";
import DropOffModal from "./DropOffModal";
import profileImage from "../assets/undraw_profile_1.svg";
import CustomerPayment from "./CustomerPayment";
const CustomerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [activeSection, setActiveSection] = useState("vehicles");
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showDropOffModal, setShowDropOffModal] = useState(false);
  const [dropOffOdometer, setDropOffOdometer] = useState("");
  const [currentRental, setCurrentRental] = useState(null);
  const [creditCard, setCreditCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [odometerDifference, setOdometerDifference] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const fetchRentals = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    try {
      const response = await axios.get(
        `http://localhost:3001/api/rentals/customer/${userDetails?.customer?.id}`
      );
      setRentals(response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };
  useEffect(() => {
    fetchVehicles();
    fetchRentals();
  }, []);
  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/vehicles/");
      const availableVehicles = response.data.filter(
        (vehicle) => vehicle.status === "available"
      );
      setVehicles(availableVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };
  // const handleDropOffClick = (rental) => {
  //   console.log(rental)
  //   setCurrentRental(rental);
  //   setShowDropOffModal(true);
  // };



  const handleDropOffClick = async (rental) => {
    if (rental.rentalDuration > 1) {
      setCurrentRental(rental);
      setOdometerDifference("");
      setDropOffOdometer("");
      setShowDropOffModal(true);
      setCreditCard({
        number: "",
        expiry: "",
        cvv: "",
      });
    } else {
      try {
        const response = await axios.put(
          `http://localhost:3001/api/rentals/dropoff/${rental._id}`,
          {
            totalCharge: rental?.totalPrice,
            newOdometer: rental?.vehicleId?.currentOdoMeter,
          }
        );
        console.log(response);
        if (
          response?.data?.rental?.vehicleId !== null
        ) {
          alert("Vehicle drop-off completed successfully!");
          fetchRentals();
        } else {
          alert("Vehicle drop-off failed. Please try again.");
        }
      } catch (error) {
        console.error("Error in vehicle drop-off:", error);
        alert("Vehicle drop-off failed. Please try again.");
      }
    }
  };






  const lastedrentals = () => {
    fetchRentals();
  };
  const handleCancelRental = async (rentalId) => {
    try {
      const cancelUrl = `http://localhost:3001/api/rentals/cancel/${rentalId}`;
      const cancelResponse = await axios.put(cancelUrl);

      if (cancelResponse.status === 200) {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const rentalsResponse = await axios.get(
          `http://localhost:3001/api/rentals/customer/${userDetails?.customer?.id}`
        );
        setRentals(rentalsResponse.data);
        fetchVehicles();
        alert("Rental canceled successfully!... Amount will be refunded in 4-7 bussines days (Except Deposit, Insurance) ");
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
      parseInt(dropOffOdometer) -
      parseInt(currentRental?.vehicleId?.currentOdoMeter);
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

    const rentalDuration = currentRental?.rentalDuration || 0;

    // For rentals with a duration of 1 day
    if (rentalDuration === 1) {
      // Direct drop-off logic
      try {
        const response = await axios.put(
          `http://localhost:3001/api/rentals/dropoff/${currentRental._id}`,
          {
            totalCharge: currentRental.totalPrice, // No additional charges for a 1-day rental
            newOdometer: currentRental.vehicleId.currentOdoMeter, // Maintain the same odometer reading
          }
        );

        if (response?.data?.rental?.vehicleId) {
          alert("Vehicle drop-off completed successfully!");
          const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
          const rentalsResponse = await axios.get(
            `http://localhost:3001/api/rentals/customer/${userDetails?.customer?.id}`
          );
          setRentals(rentalsResponse.data);
          fetchVehicles();
        } else {
          alert("Vehicle drop-off failed. Please try again.");
        }
      } catch (error) {
        console.error("Error in vehicle drop-off:", error);
        alert("Vehicle drop-off failed. Please try again.");
      }
    } else {
      // For rentals exceeding 1 day
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
        parseInt(dropOffOdometer) -
        parseInt(currentRental?.vehicleId?.currentOdoMeter);
      const charge =
        difference * parseInt(currentRental?.vehicleId?.pricePerDay);

      try {
        const response = await axios.put(
          `http://localhost:3001/api/rentals/dropoff/${currentRental._id}`,
          {
            totalCharge: currentRental.totalPrice + charge, // Add calculated charge to total
            newOdometer: dropOffOdometer, // Update the odometer
          }
        );

        if (response?.data?.rental?.vehicleId) {
          alert("Vehicle drop-off completed successfully!");
          const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
          const rentalsResponse = await axios.get(
            `http://localhost:3001/api/rentals/customer/${userDetails?.customer?.id}`
          );
          setRentals(rentalsResponse.data);
          fetchVehicles();
        } else {
          alert("Vehicle drop-off failed. Please try again.");
        }
      } catch (error) {
        console.error("Error in vehicle drop-off:", error);
        alert("Vehicle drop-off failed. Please try again.");
      }
    }

    setShowDropOffModal(false);
  };

  return (
    <div id="page-top" style={{ minHeight: "100vh", display: "flex" }}>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="content-wrapper" style={{ flex: 1 }}>
        <Topbar profileImage={profileImage} />
        <div className="container-fluid" style={{ padding: "20px" }}>
          <div className="row justify-content-center">
            {activeSection === "vehicles" && vehicles.length === 0 && (
              <p
                className="text-center"
                style={{ color: "#666", fontSize: "18px" }}
              >
                No vehicles available at the moment.
              </p>
            )}
            {activeSection === "rentals" && rentals.length === 0 && (
              <p
                className="text-center"
                style={{ color: "#666", fontSize: "18px" }}
              >
                No rentals available at the moment.
              </p>
            )}
            {activeSection === "vehicles" &&
              vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
              {activeSection === "payments" &&
              
                <CustomerPayment />
              }
            {activeSection === "rentals" &&
              rentals.map((rental) => (
                <VehicleCard
                  key={rental._id}
                  vehicle={rental}
                  isRental
                  onDropOff={handleDropOffClick}
                  reviewAdded={lastedrentals}
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
