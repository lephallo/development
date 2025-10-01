// src/pages/TrackOrder.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user?.id;

  useEffect(() => {
    if (!customerId) {
      alert("⚠️ You must be logged in to track orders.");
      navigate("/"); 
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://development-gttd.onrender.com/api/orders/customer/${customerId}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        alert("Failed to load orders. Check backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId, navigate]);

  return (
    <div className="track-page">
      <button className="back-btn" onClick={() => navigate("/customerDashboard")}>←</button>
      <h2>📦 My Orders</h2>

      {loading ? (
        <p className="center-text">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="center-text">No orders found.</p>
      ) : (
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span>
            <span>Product</span>
            <span>Qty</span>
            <span>Total (M)</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="table-row">
              <span>{order.id}</span>
              <span>{order.product_name}</span>
              <span>{order.quantity}</span>
              <span>{order.total_price}</span>
              <span>{new Date(order.created_at).toLocaleString()}</span>
              <span className={`status ${order.status?.toLowerCase()}`}>{order.status}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .track-page {
          max-width: 900px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-family: 'Outfit', sans-serif;
        }

        .back-btn {
          background-color: #6b46c1;
          color: #fff;
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          margin-bottom: 15px;
        }

        h2 {
          text-align: center;
          color: #4CAF50;
          margin-bottom: 20px;
        }

        .center-text {
          text-align: center;
        }

        .orders-table {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          border-top: 2px solid #ddd;
        }

        .table-header, .table-row {
          display: contents;
        }

        .table-header span {
          font-weight: bold;
          padding: 10px;
          border-bottom: 2px solid #ddd;
        }

        .table-row span {
          padding: 10px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
          color: #555;
        }

        .status.pending { color: #ff9800; font-weight: bold; }
        .status.confirmed { color: #2196f3; font-weight: bold; }
        .status.delivered { color: #4caf50; font-weight: bold; }
        .status.cancelled { color: #f44336; font-weight: bold; }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .orders-table {
            display: flex;
            flex-direction: column;
          }

          .table-header {
            display: none;
          }

          .table-row {
            display: flex;
            flex-direction: column;
            margin-bottom: 12px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }

          .table-row span {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border: none;
          }

          .table-row span:first-child { font-weight: bold; }
        }
      `}</style>
    </div>
  );
}
