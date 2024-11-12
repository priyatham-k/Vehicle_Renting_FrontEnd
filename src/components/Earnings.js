import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDollarSign, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const Earnings = () => {
  const [earningsData, setEarningsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/api/owners/rentals");
        const rentals = response.data;

        // Calculate total earnings, canceled, and completed rentals
        let total = 0;
        let canceled = 0;
        let completed = 0;

        rentals.forEach((rental) => {
          if (rental.status === "Cancelled") {
            canceled += 1;
            total += 100; // Add 100 for each canceled rental as per your requirement
          } else if (rental.status === "Completed") {
            completed += 1;
            total += rental.totalPrice; // Assuming `totalPrice` is the earnings for each completed rental
          }
        });

        setEarningsData(rentals);
        setTotalEarnings(total);
        setCanceledCount(canceled);
        setCompletedCount(completed);
        setLoading(false);
      } catch (err) {
        setError("Failed to load earnings data");
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <p>Loading earnings data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h5 className="mb-4">Earnings Overview</h5>

      {/* Summary Cards */}
      <div className="row">
        <div className="col-md-4">
          <div className="summary-card" style={styles.card}>
            <FaDollarSign style={styles.icon} />
            <h5>Total Earnings</h5>
            <p style={styles.totalEarnings}>${totalEarnings.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-card" style={styles.card}>
            <FaTimesCircle style={styles.icon} />
            <h5>Canceled Rentals</h5>
            <p style={styles.canceled}>{canceledCount}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-card" style={styles.card}>
            <FaCheckCircle style={styles.icon} />
            <h5>Completed Rentals</h5>
            <p style={styles.completed}>{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Earnings List */}
      <div className="earnings-list mt-4">
        <h5>Recent Earnings</h5>
        <ul className="list-group">
          {earningsData.map((rental, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>{rental.pickupDate}</strong> - {rental.status}
              </span>
              <span>${rental.status === "Cancelled" ? 100 : rental.totalPrice}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: "20px",
    backgroundColor: "#f8f9fc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginBottom: "20px",
  },
  icon: {
    fontSize: "30px",
    color: "#4e73df",
    marginBottom: "10px",
  },
  totalEarnings: {
    fontSize: "24px",
    color: "#28a745",
    fontWeight: "bold",
  },
  canceled: {
    fontSize: "24px",
    color: "#dc3545",
    fontWeight: "bold",
  },
  completed: {
    fontSize: "24px",
    color: "#17a2b8",
    fontWeight: "bold",
  },
};

export default Earnings;
