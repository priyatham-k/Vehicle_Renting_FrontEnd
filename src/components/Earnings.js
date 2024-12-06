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
        const response = await axios.get("http://localhost:3001/api/rentals/owner");
        const rentals = response.data;

        // Calculate total earnings, canceled, and completed rentals
        let total = 0;
        let canceled = 0;
        let completed = 0;

        rentals.forEach((rental) => {
          if (rental.status === "Cancelled") {
            canceled += 1;
            total += 100 + parseFloat(rental.insurance) * (rental.rentalDuration)
          } else if (rental.status === "Completed") {
            completed += 1;
            total += rental.totalPrice; // Total earnings for completed rentals
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
    <div className="container mt-3" style={{ fontSize: "12px" }}>
      <h5 className="mb-4">Earnings Overview</h5>

      {/* Summary Cards */}
      <div className="row">
        <div className="col-md-4">
          <div className="summary-card" style={styles.card}>
            <FaDollarSign style={styles.icon} />
            <h5>Final Earnings</h5>
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

      {/* Recent Earnings Table */}
      <div className="earnings-list mt-4">
        <h5>Recent Earnings</h5>
        <table className="table table-striped table-bordered" style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Image</th>
              <th style={styles.tableHeader}>Rented By</th>
              <th style={styles.tableHeader}>Pickup Date</th>
              <th style={styles.tableHeader}>Dropoff Date</th>
              <th style={styles.tableHeader}>Pickup Address</th>
              <th style={styles.tableHeader}>Dropoff Address</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Earnings</th>
            </tr>
          </thead>
          <tbody>
            {earningsData.map((rental, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={rental.vehicleId?.imageUrl || ""}
                    alt="Vehicle"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>{rental.customerId?.firstName || "N/A"} {rental.customerId?.lastName || ""}</td>
                <td>{rental.pickupDate || "N/A"}</td>
                <td>{rental.returnDate || "N/A"}</td>
                <td>{rental.pickupAddress || "N/A"}</td>
                <td>{rental.dropOffAddress || "N/A"}</td>
                <td>{rental.status}</td>
                <td>
                  ${rental.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: "10px",
    backgroundColor: "#f8f9fc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginBottom: "15px",
  },
  icon: {
    fontSize: "20px",
    color: "#4e73df",
    marginBottom: "5px",
  },
  totalEarnings: {
    fontSize: "18px",
    color: "#28a745",
    fontWeight: "bold",
  },
  canceled: {
    fontSize: "18px",
    color: "#dc3545",
    fontWeight: "bold",
  },
  completed: {
    fontSize: "18px",
    color: "#17a2b8",
    fontWeight: "bold",
  },
  table: {
    fontSize: "12px",
    border: "1px solid #dee2e6",
  },
  tableHeader: {
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#f8f9fc",
  },
};

export default Earnings;
