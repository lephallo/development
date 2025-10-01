// src/pages/Notification.jsx
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Notification() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://development-gttd.onrender.com/api/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleApprove = async (orderId) => {
    try {
      const res = await fetch(`https://development-gttd.onrender.com/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (!res.ok) throw new Error("Failed to approve order");

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === updatedOrder.order.order_id
            ? { ...o, status: "Approved" }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to approve order");
    }
  };

  if (loading) return <p style={{ padding: "20px", textAlign: "center" }}>Loading orders...</p>;

  return (
    <div className="notification-page">
      {/* Top Navbar */}
      <div className="navbar">
        <FaArrowLeft className="back-icon" onClick={() => navigate("/vendorDashboard")} />
        <h1>Available Orders</h1>
      </div>

      <div className="orders-container">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <div className="orders-table">
            {/* Header for large screens */}
            <div className="table-header">
              <span>Customer</span>
              <span>Product</span>
              <span>Quantity</span>
              <span>Total Price</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {orders.map((order) => (
              <div key={order.order_id} className="table-row">
                <span>{order.customer_name} {order.customer_surname}</span>
                <span>{order.product_name}</span>
                <span>{order.quantity}</span>
                <span>M{order.total_price}</span>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                <span>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(order.order_id)}
                    disabled={order.status === "Approved"}
                  >
                    {order.status === "Approved" ? "✅ Approved" : "Approve"}
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ----------------- Styles ----------------- */}
      <style>{`
        .navbar {
          background-color: #6A0DAD;
          padding: 15px 20px;
          display: flex;
          align-items: center;
        }
        .back-icon {
          color: white;
          font-size: 24px;
          cursor: pointer;
          margin-right: 10px;
        }
        .navbar h1 {
          color: white;
          font-size: 20px;
          flex: 1;
          margin: 0;
        }
        .orders-container {
          padding: 20px;
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
          border-bottom: 1px solid #ddd;
        }
        .status.pending { color: orange; font-weight: bold; }
        .status.approved { color: green; font-weight: bold; }
        .approve-btn {
          padding: 6px 12px;
          background-color: #28a745;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .approve-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .orders-table {
            display: flex;
            flex-direction: column;
          }
          .table-header { display: none; }
          .table-row {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
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

export default Notification;
