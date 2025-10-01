import React, { memo } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Memoized chart components to reduce re-renders
const OrdersChart = memo(({ data }) => (
  <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", overflowX: "auto" }}>
    <h3>Orders Over Time</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#dc3545" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
));

const RevenueChart = memo(({ data }) => {
  const BAR_COLORS = ["#6A0DAD", "#00C49F", "#dc3545"];
  return (
    <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", overflowX: "auto" }}>
      <h3>Revenue per Product</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product" />
          <YAxis />
          <Tooltip />
          {data.map((entry, index) => (
            <Bar key={index} dataKey="revenue" fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}); // <-- fixed here

function VendorDashboard() {
  const navigate = useNavigate();
  const ordersCount = 7;

  // Dummy data
  const orderData = [
    { date: "2025-09-25", count: 5 },
    { date: "2025-09-26", count: 8 },
    { date: "2025-09-27", count: 3 },
    { date: "2025-09-28", count: 12 },
    { date: "2025-09-29", count: 14 },
  ];
  const revenueData = [
    { product: "Product A", revenue: 150 },
    { product: "Product B", revenue: 300 },
    { product: "Product C", revenue: 120 },
  ];

  const logout = () => {
    localStorage.removeItem("vendorId");
    localStorage.removeItem("vendorName");
    navigate("/login");
  };
  const handleAddProduct = () => navigate("/add-item");

  // Styles
  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#6A0DAD",
    color: "#fff",
    flexWrap: "wrap",
  };
  const logoStyle = { fontWeight: "bold", fontSize: "1.5rem" };
  const navButtonsStyle = { display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" };
  const buttonStyle = {
    backgroundColor: "#fff",
    color: "#6A0DAD",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s ease",
  };
  const badgeStyle = {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    backgroundColor: "red",
    color: "#fff",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "bold",
  };
  const mainStyle = {
    padding: "1rem",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    fontFamily: "'Outfit', sans-serif",
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={navbarStyle}>
        <div style={logoStyle}>Vendor Dashboard</div>
        <div style={navButtonsStyle}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => navigate("/notification")}>
            <FaBell size={24} />
            {ordersCount > 0 && <span style={badgeStyle}>{ordersCount}</span>}
          </div>
          <button style={buttonStyle} onClick={handleAddProduct}>Add Product</button>
          <button style={{ ...buttonStyle, backgroundColor: "#dc3545", color: "#fff" }} onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={mainStyle}>
        <h2 style={{ color: "#6A0DAD", fontWeight: "bold", textAlign: "center" }}>Welcome to Your Dashboard</h2>
        <OrdersChart data={orderData} />
        <RevenueChart data={revenueData} />
      </div>
    </div>
  );
}

export default VendorDashboard;
