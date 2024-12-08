import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
      if (!userDetails?.customer?.id) {
        setError("Customer ID not found.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(
          `http://localhost:3001/api/payments/customer/${userDetails.customer.id}`
        );
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // If 404, no payments found
          setPayments([]);
          setError(null); // Clear any existing error messages
        } else {
          setError("Failed to fetch payments.");
        }
        setLoading(false);
      }
    };
  
    fetchPayments();
  }, []);
  

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h5 className="mb-4">Payment History</h5>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th style={{ fontSize: "12px" }}>Vehicle</th>
              <th style={{ fontSize: "12px" }}>Payment ID</th>

              <th style={{ fontSize: "12px" }}>Total Price</th>
              <th style={{ fontSize: "12px" }}>Pickup Date</th>
              <th style={{ fontSize: "12px" }}>Return Date</th>
              <th style={{ fontSize: "12px" }}>Initial Paid Amount</th>
              <th style={{ fontSize: "12px" }}>Payment Date</th>
              <th style={{ fontSize: "12px" }}>Payment Method</th>
              <th style={{ fontSize: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                {/* Vehicle Make and Model */}
                <td style={{ fontSize: "12px" }}>
                  {payment.rentalId?.make || "N/A"}{" "}
                  {payment.rentalId?.model || ""}
                </td>
                <td style={{ fontSize: "12px" }}>{payment._id}</td>

                {/* Total Price */}
                <td style={{ fontSize: "12px" }}>
                  ${payment.rentalId?.totalPrice || "N/A"}
                </td>

                {/* Pickup Date */}
                <td style={{ fontSize: "12px" }}>
                  {payment.rentalId?.pickupDate
                    ? new Date(payment.rentalId.pickupDate).toLocaleDateString()
                    : "N/A"}
                </td>

                {/* Return Date */}
                <td style={{ fontSize: "12px" }}>
                  {payment.rentalId?.returnDate
                    ? new Date(payment.rentalId.returnDate).toLocaleDateString()
                    : "N/A"}
                </td>

                {/* Initial Paid Amount */}
                <td style={{ fontSize: "12px" }}>
                  ${payment.amount.toFixed(2)}
                </td>

                {/* Payment Date */}
                <td style={{ fontSize: "12px" }}>
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>

                {/* Payment Method */}
                <td style={{ fontSize: "12px" }}>{payment.paymentMethod}</td>

                {/* Status */}
                <td
                  style={{
                    fontSize: "12px",
                    color: payment.status === "Paid" ? "green" : "red",
                  }}
                >
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerPayment;
