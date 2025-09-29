import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state; // product from dashboard
  const [quantity, setQuantity] = useState(1);
  const [orderSlip, setOrderSlip] = useState(null); // slip data

  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user?.id;

  const ownerDisplayName =
    product.vendor_name ||
    (product.owner_name && product.owner_surname
      ? `${product.owner_name} ${product.owner_surname}`
      : "N/A");

  const totalPrice = product.price
    ? (product.price * quantity).toFixed(2)
    : "N/A";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      alert("⚠️ You must be logged in to place an order.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3003/api/orders", {
        productId: product.id,
        customerId,
        quantity,
      });

      const order = res.data.order;

      setOrderSlip({
        orderId: order.id,
        productName: product.name,
        quantity,
        totalPrice: order.total_price,
        date: order.created_at,
        owner: ownerDisplayName,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to place order");
    }
  };

  const downloadPDF = () => {
    if (!orderSlip) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("🧾 Order Confirmation", 20, 20);
    doc.setFontSize(14);
    doc.text(`Order ID: ${orderSlip.orderId}`, 20, 40);
    doc.text(`Product: ${orderSlip.productName}`, 20, 50);
    doc.text(`Quantity: ${orderSlip.quantity}`, 20, 60);
    doc.text(`Total Paid: M${orderSlip.totalPrice}`, 20, 70);
    doc.text(`Vendor: ${orderSlip.owner}`, 20, 80);
    doc.text(
      `Date: ${new Date(orderSlip.date).toLocaleString()}`,
      20,
      90
    );
    doc.save(`Order_${orderSlip.orderId}.pdf`);
  };

  return (
    <div className="order-container">
      {/* 🔙 Back Button */}
      <button className="back-button" onClick={() => navigate("/customerDashboard")}>
        ← Back
      </button>

      <h2 className="order-title">Order: {product.name || "N/A"}</h2>

      <div className="order-details">
        <p>Price per item: <span className="highlight">M{product.price ?? "N/A"}</span></p>
        <p>Location: <span className="highlight">{product.location || "N/A"}</span></p>
        <p>Owner: <span className="highlight">{ownerDisplayName}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <label className="label">
          Quantity:
          <input
            type="number"
            min="1"
            max={product.qty ?? 1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            className="quantity-input"
          />
        </label>

        <p className="total-price">
          Total Price: <strong>M{totalPrice}</strong>
        </p>

        <button type="submit" className="order-button">Place Order</button>
      </form>

      {orderSlip && (
        <div className="order-slip">
          <h3>🧾 Order Confirmation</h3>
          <p><strong>Order ID:</strong> {orderSlip.orderId}</p>
          <p><strong>Product:</strong> {orderSlip.productName}</p>
          <p><strong>Quantity:</strong> {orderSlip.quantity}</p>
          <p><strong>Total Paid:</strong> M{orderSlip.totalPrice}</p>
          <p><strong>Date:</strong> {new Date(orderSlip.date).toLocaleString()}</p>
          <p><strong>Vendor:</strong> {orderSlip.owner}</p>
          <button onClick={downloadPDF} className="download-button">
            Download Slip
          </button>
        </div>
      )}

      {/* Internal CSS */}
      <style jsx>{`
        .order-container {
          max-width: 400px;
          margin: 50px auto;
          padding: 30px;
          background-color: #f3e5f5;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          font-family: 'Arial', sans-serif;
          text-align: center;
          position: relative;
        }
        .order-title {
          font-size: 24px;
          color: #4b0082;
          margin-bottom: 20px;
        }
        .highlight { font-weight: bold; }
        .order-form { margin-top: 20px; }
        .label { display: block; font-size: 14px; margin-bottom: 10px; color: #4b0082; }
        .quantity-input { width: 60px; padding: 5px; margin-left: 10px; border: 2px solid #8e24aa; border-radius: 4px; font-size: 14px; }
        .quantity-input:focus { border-color: #6a1b9a; }
        .total-price { margin-top: 15px; font-size: 16px; color: #4b0082; }
        .order-button { margin-top: 20px; padding: 12px 24px; background-color: #6f42c1; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background-color 0.3s ease; }
        .order-button:hover { background-color: #5a3eaa; }
        .order-slip { margin-top: 30px; padding: 20px; border: 2px dashed #6f42c1; border-radius: 10px; background-color: #f3e5f5; text-align: left; }
        .order-slip h3 { text-align: center; color: #4b0082; }
        .order-slip p { margin: 5px 0; font-size: 16px; color: #4b0082; }
        .download-button { margin-top: 10px; padding: 10px 20px; background-color: #6b46c1; color: #fff; border: none; border-radius: 5px; cursor: pointer; }
        .download-button:hover { background-color: #553c9a; }

        /* Back button style */
        .back-button {
          position: absolute;
          top: 15px;
          left: 15px;
          background: none;
          border: none;
          font-size: 18px;
          color: #4b0082;
          cursor: pointer;
        }
        .back-button:hover {
          color: #6f42c1;
        }
      `}</style>
    </div>
  );
}
