import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerId) {
        alert("⚠️ You must be logged in to track orders.");
        navigate("/"); // redirect home if not logged in
        return;
      }

      try {
        const res = await fetch(`http://localhost:3003/api/orders/customer/${customerId}`);
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
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/customerDashboard")}
        style={{
          marginBottom: "20px",
          backgroundColor: "#6f42c1",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2 style={{ textAlign: "center", color: "#4CAF50", marginBottom: "20px" }}>
        📦 My Orders
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Total (M)</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{order.id}</td>
                <td style={tdStyle}>{order.product_name}</td>
                <td style={tdStyle}>{order.quantity}</td>
                <td style={tdStyle}>{order.total_price}</td>
                <td style={tdStyle}>
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td style={{ ...tdStyle, fontWeight: "bold", color: getStatusColor(order.status) }}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "12px",
  fontSize: "14px",
  color: "#333",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  fontSize: "14px",
  color: "#555",
};

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "#ff9800";
    case "confirmed":
      return "#2196f3";
    case "delivered":
      return "#4caf50";
    case "cancelled":
      return "#f44336";
    default:
      return "#555";
  }
}
