import React from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function VendorDashboard() {
  const navigate = useNavigate();

  // Dummy data for charts
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

  const ordersCount = 7; // Example notification count

  const logout = () => {
    localStorage.removeItem("vendorId");
    localStorage.removeItem("vendorName");
    navigate("/login");
  };

  const handleAddProduct = () => {
    navigate("/add-item");
  };

  // ---------------- Styles ----------------
  const sidebarStyle = {
    width: "300px",
    backgroundColor: "#D8BFD8",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "2rem 1rem",
    borderTopRightRadius: "50px",
    borderBottomRightRadius: "50px",
    minHeight: "100vh",
    boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
    fontFamily: "'Outfit', sans-serif",
    position: "fixed",
    overflowY: "auto",
  };

  const topSectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  };

  const iconContainerStyle = {
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
  };

  const iconStyle = {
    fontSize: "36px",
    color: "#6A0DAD",
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
    zIndex: 1,
  };

  const buttonStyle = {
    backgroundColor: "#6A0DAD",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    transition: "0.3s ease",
  };

  const logoutStyle = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
  };

  const buttonHoverStyle = {
    backgroundColor: "#553c9a",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  };

  const mainStyle = {
    marginLeft: "300px",
    padding: "2rem",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Outfit', sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  };

  const chartBoxStyle = {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const BAR_COLORS = ["#6A0DAD", "#00C49F", "#dc3545"]; // Purple, Green, Red
  const LINE_COLOR = "#dc3545"; // Red line

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={topSectionStyle}>
          {/* Notification Icon */}
          <div style={iconContainerStyle} onClick={() => navigate("/notification")}>
            <FaBell style={iconStyle} />
            {ordersCount > 0 && <span style={badgeStyle}>{ordersCount}</span>}
          </div>

          {/* Add Product Button */}
          <button
            style={buttonStyle}
            onClick={handleAddProduct}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          >
            Add Product
          </button>
        </div>

        {/* Logout Button */}
        <button
          style={logoutStyle}
          onClick={logout}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "#b52a3a" })}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, logoutStyle)}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        <h1 style={{ color: "#6A0DAD", fontWeight: "bold", textAlign: "center" }}>Welcome to Vendor Dashboard</h1>

        {/* Line Chart: Orders Over Time */}
        <div style={chartBoxStyle}>
          <h3>Orders Over Time</h3>
          <LineChart width={500} height={250} data={orderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke={LINE_COLOR} strokeWidth={3} />
          </LineChart>
        </div>

        {/* Bar Chart: Revenue per Product */}
        <div style={chartBoxStyle}>
          <h3>Revenue per Product</h3>
          <BarChart width={500} height={250} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            {revenueData.map((entry, index) => (
              <Bar key={index} dataKey="revenue" fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
