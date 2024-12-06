import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const VehicleCard = ({ vehicle, isRental, onCancelRental, onDropOff,reviewAdded }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [newReview, setNewReview] = useState("");

  const customerId = JSON.parse(sessionStorage.getItem("userDetails"))?.customer
    ?.id;

  const fetchReviews = async () => {
    setLoadingReviews(true);
    setReviewError("");
    console.log(vehicle);
    console.log(isRental)
    try {
      const Id = isRental ? vehicle?.vehicleId?._id:vehicle._id
      const response = await axios.get(
        `http://localhost:3001/api/reviews/${Id}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviewError("Failed to load reviews. Please try again later.");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleViewReviewsClick = () => {
    setShowReviews(!showReviews);
    if (!showReviews) {
      fetchReviews();
    }
  };

  const handleAddReviewSubmit = async () => {
    try {
      await axios.post("http://localhost:3001/api/reviews/add", {
        customer: customerId,
        rentalId: vehicle._id,
        comment: newReview,
      });

      alert("Review added successfully!");
      reviewAdded()
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please try again later.");
    }
  };

  return (
    <div className="col-md-6 mb-3">
      <div
        className="card card-custom"
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="row g-0">
          <div className="col-md-6">
            <img
              src={vehicle.imageUrl || ""}
              className="img-fluid rounded-start"
              alt={`${vehicle.make || "N/A"} ${vehicle.model || "N/A"}`}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            className="col-md-6"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div>
              <h5
                className="card-title"
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {vehicle.make || "N/A"} {vehicle.model || "N/A"}
                {isRental && (
                  <span
                    className={`badge ${
                      vehicle.status === "active"
                        ? "badge-success"
                        : vehicle.status === "Completed"
                        ? "badge-info"
                        : "badge-danger"
                    }`}
                    style={{
                      fontSize: "10px",
                      padding: "3px 6px",
                      position: "absolute",
                      top: "0",
                      right: "0",
                      borderRadius: "4px",
                    }}
                  >
                    {vehicle.status.charAt(0).toUpperCase() +
                      vehicle.status.slice(1)}
                  </span>
                )}
              </h5>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>Capacity:</strong>{" "}
                <span style={{ fontSize: "10px" }}>5 persons</span>
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>Type:</strong> {vehicle.type || "N/A"}
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>Insurance Cost:</strong>{" "}
                <span style={{ fontSize: "10px" }}>
                  ${vehicle.insurance || "N/A"}
                </span>
              </p>
              <p style={{ fontSize: "12px", margin: "2.5px 0", color: "#555" }}>
                <strong>ODO Meter Reading:</strong>{" "}
                {isRental
                  ? vehicle.vehicleId?.currentOdoMeter
                  : vehicle.currentOdoMeter || "N/A"}
              </p>
            </div>
            <div
              className="text-right"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                className="btn btn-info btn-sm"
                onClick={handleViewReviewsClick}
                style={{
                  fontSize: "10px",
                  padding: "5px 7px",
                  borderRadius: "4px",
                  color:"white"
                }}
              >
                {showReviews ? "Hide Reviews" : "View Reviews"}
              </button>
              {isRental && vehicle.status === "active" ? (
                <>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onCancelRental(vehicle._id)}
                    style={{
                      fontSize: "10px",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      marginLeft: "5px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => onDropOff(vehicle)}
                    style={{
                      fontSize: "10px",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    Drop Off
                  </button>
                </>
              ) : (
                !isRental && (
                  <Link
                    to={`/vehicle/${vehicle._id}`}
                    className="btn btn-primary btn-sm"
                    style={{
                      fontSize: "10px",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      marginTop: "10px",
                    }}
                  >
                    Book
                  </Link>
                )
              )}
            </div>
            {showReviews && (
              <div style={{ marginTop: "10px", fontSize: "12px" }}>
                {loadingReviews && <p>Loading reviews...</p>}
                {reviewError && <p className="text-danger">{reviewError}</p>}
                {!loadingReviews && !reviewError && reviews.length === 0 && (
                  <p>No reviews available.</p>
                )}
                <ul className="list-group">
                  {reviews.map((review) => (
                    <li
                      key={review._id}
                      className="list-group-item"
                      style={{ fontSize: "12px" }}
                    >
                      <strong>
                        {review.customer?.firstName} {review.customer?.lastName}
                        :
                      </strong>{" "}
                      {review.comment}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {isRental &&
              vehicle.status === "Completed" &&
              !vehicle.reviewAdded && (
                <div style={{ marginTop: "10px" }}>
                  <textarea
                    placeholder="Add your review"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "12px",
                      padding: "5px",
                      borderRadius: "4px",
                    }}
                  ></textarea>
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={handleAddReviewSubmit}
                    style={{
                      fontSize: "10px",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    Submit Review
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
