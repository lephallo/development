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

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      {/* Top Navbar */}
      <div style={navbarStyle}>
        <FaArrowLeft
          style={backIconStyle}
          onClick={() => navigate("/vendorDashboard")}
        />
        <h1 style={{ color: "white", margin: 0, marginLeft: "10px" }}>
          Available Orders
        </h1>
      </div>

      <div style={{ padding: "20px", marginTop: "20px" }}>
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Total Price</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  style={{ borderBottom: "1px solid #ddd" }}
                >
                  <td style={tdStyle}>
                    {order.customer_name} {order.customer_surname}
                  </td>
                  <td style={tdStyle}>{order.product_name}</td>
                  <td style={tdStyle}>{order.quantity}</td>
                  <td style={tdStyle}>M{order.total_price}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        color:
                          order.status === "Pending"
                            ? "orange"
                            : order.status === "Approved"
                            ? "green"
                            : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={approveButtonStyle}
                      onClick={() => handleApprove(order.order_id)}
                    >
                      {order.status === "Approved" ? "✅ Approved" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ------------------- Styles -------------------
const navbarStyle = {
  backgroundColor: "#6A0DAD", // Purple
  padding: "15px 30px",
  display: "flex",
  alignItems: "center",
};

const backIconStyle = {
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
};

const thStyle = { padding: "10px", textAlign: "left", border: "1px solid #ddd" };
const tdStyle = { padding: "10px", border: "1px solid #ddd" };
const approveButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Notification;
