import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showVendors, setShowVendors] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const navigate = useNavigate();

  // ----------------- Fetch Vendors -----------------
  const fetchVendors = async () => {
    try {
      const res = await fetch("https://development-gttd.onrender.com/api/vendors");
      if (!res.ok) throw new Error("Failed to fetch vendors");
      const data = await res.json();
      setVendors(data.vendors || []);
      setShowVendors((prev) => !prev); // toggle dropdown
    } catch (err) {
      console.error("Error fetching vendors:", err);
      alert("Failed to load vendors. Check backend server.");
    }
  };

  // ----------------- Fetch Products -----------------
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://development-gttd.onrender.com/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to load products. Check backend server.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleVendorClick = (vendorId) => {
    setSelectedVendorId(vendorId);
    if (vendorId) {
      const filtered = products.filter((p) => p.user_id === vendorId);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setShowVendors(false); // hide after selection
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <div style={navbarStyle}>
        <h2 style={{ color: "white", margin: 0 }}>Customer Dashboard</h2>
        <div>
          <button onClick={fetchVendors} style={topBtnStyle}>
            View Vendors
          </button>
          <button onClick={() => navigate("/trackorder")} style={topBtnStyle}>
            Track Orders
          </button>
          <button onClick={handleLogout} style={{ ...topBtnStyle, backgroundColor: "#dc3545" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Vendor Dropdown */}
      {showVendors && (
        <ul style={vendorDropdownStyle}>
          {vendors.length === 0 ? (
            <li style={{ padding: "0.5rem", color: "#555" }}>No vendors found</li>
          ) : (
            <>
              {vendors.map((vendor) => (
                <li
                  key={vendor.id}
                  onClick={() => handleVendorClick(vendor.id)}
                  style={{
                    ...vendorDropdownItem,
                    backgroundColor: selectedVendorId === vendor.id ? "#f0e6ff" : "white",
                  }}
                >
                  {vendor.name}
                </li>
              ))}
              <li
                onClick={() => handleVendorClick(null)}
                style={{ ...vendorDropdownItem, fontWeight: "bold", color: "#6f42c1" }}
              >
                Show All
              </li>
            </>
          )}
        </ul>
      )}

      {/* Main content */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {/* Products Grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "center",
          }}
        >
          {filteredProducts.map((product) => (
            <div key={product.id} style={productCardStyle}>
              {product.photo && (
                <img
                  src={`https://development-gttd.onrender.com/uploads/${product.photo}`}
                  alt={product.name}
                  style={productImageStyle}
                />
              )}
              <div style={{ padding: "1rem" }}>
                <h3 style={productNameStyle}>{product.name}</h3>
                <p style={productTextStyle}>Price: M{product.price}</p>
                <p style={productTextStyle}>Location: {product.location || "N/A"}</p>
                <p style={productTextStyle}>Owner: {product.owner_name || "N/A"}</p>
                <p style={productTextStyle}>Phone: {product.owner_phone || "N/A"}</p>
              </div>
              <div style={{ padding: "0 1rem 1rem" }}>
                <button
                  style={orderBtnStyle}
                  onClick={() => navigate("/order", { state: { product } })}
                >
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------- Styles -----------------
const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  backgroundColor: "#6f42c1",
  borderBottomLeftRadius: "20px",
  borderBottomRightRadius: "20px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

const topBtnStyle = {
  backgroundColor: "#6f42c1",
  color: "#fff",
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.9rem",
  marginLeft: "0.5rem",
};

const vendorDropdownStyle = {
  listStyle: "none",
  margin: "0.5rem auto",
  padding: "0.5rem",
  backgroundColor: "#fff",
  borderRadius: "8px",
  maxWidth: "300px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
};

const vendorDropdownItem = {
  padding: "0.5rem",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
};

// Reuse product card styles
const productCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  width: "300px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const productImageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
};

const productNameStyle = {
  margin: "0 0 0.5rem",
  fontSize: "1.2rem",
  color: "#6f42c1",
};

const productTextStyle = { margin: "0.25rem 0", color: "#555" };

const orderBtnStyle = {
  backgroundColor: "#6f42c1",
  color: "#fff",
  padding: "0.75rem",
  border: "none",
  borderRadius: "25px",
  width: "100%",
  fontSize: "1rem",
  cursor: "pointer",
};
