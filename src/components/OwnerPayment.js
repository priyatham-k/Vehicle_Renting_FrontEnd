import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnerPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/payments/owner"
        );
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching owner payments:", err);
        setError("Failed to load payments. Please try again later.");
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h5 className="mb-4">Owner Payments</h5>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              
            <th style={{ fontSize: "12px" }}>Customer</th>
              <th style={{ fontSize: "12px" }}>Payment ID</th>
              <th style={{ fontSize: "12px" }}>Final Price</th>
              <th style={{ fontSize: "12px" }}>Initial Paid Amount</th>
              <th style={{ fontSize: "12px" }}>Payment Date</th>
              <th style={{ fontSize: "12px" }}>Payment Method</th>
              <th style={{ fontSize: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td style={{ fontSize: "12px" }}>
                  {payment.payBy?.firstName} {payment.payBy?.lastName || "N/A"}
                </td>
                <td style={{ fontSize: "12px" }}>{payment._id}</td>
                <td style={{ fontSize: "12px" }}>
                  ${payment.rentalId?.totalPrice.toFixed(2) || "N/A"}
                </td>
                <td style={{ fontSize: "12px" }}>
                  ${payment.amount.toFixed(2)}
                </td>
                <td style={{ fontSize: "12px" }}>
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td style={{ fontSize: "12px" }}>{payment.paymentMethod}</td>

                
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

export default OwnerPayment;
