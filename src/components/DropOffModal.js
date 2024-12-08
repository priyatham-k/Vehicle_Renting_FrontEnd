import React from "react";

const DropOffModal = ({
  isOpen,
  onClose,
  rental,
  dropOffOdometer,
  setDropOffOdometer,
  onCalculate,
  totalCharge,
  onPaymentSubmit,
  creditCard,
  handleCreditCardChange,
  odometerDifference,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h4 className="modal-title">Drop Off Vehicle</h4>
        <div className="modal-body">
          <label className="modal-label">
            Drop-off Odometer:
            <input
              type="number"
              value={dropOffOdometer}
              onChange={(e) => setDropOffOdometer(e.target.value)}
              className="modal-input"
              placeholder="Enter odometer reading"
            />
          </label>

          {rental.rentalDuration > 1 ? (
            <button className="calculate-button" onClick={onCalculate}>
              Calculate Total
            </button>
          ) : (
            <button
              className="pay-button"
              onClick={() => onPaymentSubmit(rental)}
            >
              Drop Off
            </button>
          )}
          {odometerDifference > 0 && rental.rentalDuration > 1 && (
            <div className="summary-section">
              <p className="total-charge">
                <strong>Odometer Difference:</strong> {odometerDifference} miles
              </p>
              <p className="total-charge">
                <strong>Total Charge:</strong> ${totalCharge}
              </p>
            </div>
          )}

          {totalCharge > 0 && rental?.rentalDuration > 1 && (
            <div className="payment-section">
              {rental?.rentalDuration > 1 && (
                <p>
                  Money will be debited from the card ending:{" "}
                  <strong>{rental?.cardLastFour}</strong>
                </p>
              )}

              <button
                className="pay-button"
                onClick={() => onPaymentSubmit(rental)}
              >
                Submit Drop Off
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          overflow-y: auto;
          padding: 20px;
        }
        .modal-content {
          position: relative;
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          max-width: 450px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          font-family: Arial, sans-serif;
          text-align: center;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          color: #888;
          cursor: pointer;
        }
        .modal-title {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }
        .modal-body {
          font-size: 14px;
          color: #555;
        }
        .modal-label {
          display: block;
          font-size: 14px;
          color: #333;
          margin-top: 10px;
          text-align: left;
        }
        .modal-input {
          width: 100%;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ddd;
          margin-top: 5px;
          font-size: 14px;
        }
        .calculate-button {
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          font-size: 14px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .summary-section {
          font-size: 14px;
          color: #007bff;
          margin-top: 15px;
          font-weight: bold;
          text-align: left;
        }
        .total-charge {
          font-size: 16px;
          color: #333;
          margin-top: 5px;
          font-weight: bold;
          text-align: center;
        }
        .payment-section {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .credit-card-fields .row {
          display: flex;
          gap: 10px;
          justify-content: space-between;
        }
        .modal-label.half-width {
          width: 48%;
        }
        .modal-label.full-width {
          width: 100%;
        }
        .modal-input.small-input {
          width: 100%;
        }
        .pay-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #28a745;
          color: #fff;
          font-size: 14px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default DropOffModal;
