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
      const res = await fetch("http://localhost:3003/api/vendors");
      if (!res.ok) throw new Error("Failed to fetch vendors");
      const data = await res.json();
      setVendors(data.vendors || []);
      setShowVendors(true);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      alert("Failed to load vendors. Check backend server.");
    }
  };

  // ----------------- Fetch Products -----------------
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3003/api/products");
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
        overflowX: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#D8BFD8",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100vh",
          borderTopRightRadius: "50px",
          borderBottomRightRadius: "50px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        }}
      >
        {/* Top buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* View Vendors Button */}
          <button onClick={fetchVendors} style={buttonStyle}>
            View list of street vendors
          </button>

          {/* Track Order Button */}
          <button onClick={() => navigate("/trackorder")} style={buttonStyle}>
            Track My Orders
          </button>
        </div>

        {/* Vendor list */}
        {showVendors && (
          <ul style={vendorListStyle}>
            {vendors.length === 0 ? (
              <li style={{ padding: "0.5rem", color: "#555" }}>No vendors found</li>
            ) : (
              <>
                {vendors.map((vendor) => (
                  <li
                    key={vendor.id}
                    onClick={() => handleVendorClick(vendor.id)}
                    style={{
                      ...vendorItemStyle,
                      backgroundColor: selectedVendorId === vendor.id ? "#e0f7fa" : "transparent",
                    }}
                  >
                    {vendor.name}
                  </li>
                ))}
                <li
                  onClick={() => handleVendorClick(null)}
                  style={{
                    padding: "0.75rem",
                    cursor: "pointer",
                    color: "#007bff",
                    textAlign: "center",
                  }}
                >
                  Show All
                </li>
              </>
            )}
          </ul>
        )}

        {/* Spacer */}
        <div style={{ flexGrow: 1 }} />

        {/* Logout button */}
        <button onClick={handleLogout} style={logoutBtnStyle}>
          Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <h1 style={mainHeadingStyle}>Customer Dashboard</h1>

        {/* Products Grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={productCardStyle}>
              {product.photo && (
                <img
                  src={`http://localhost:3003/uploads/${product.photo}`}
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

// ------------------- Styles -------------------
const buttonStyle = {
  backgroundColor: "#6A0DAD",
  color: "#fff",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
};

const logoutBtnStyle = {
  backgroundColor: "#dc3545",
  color: "#fff",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "1rem",
  width: "100%",
  marginTop: "1rem",
};

const vendorListStyle = {
  listStyle: "none",
  padding: 0,
  maxHeight: "200px",
  overflowY: "auto",
  backgroundColor: "#fff",
  borderRadius: "15px",
  marginTop: "1rem",
  padding: "0.5rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const vendorItemStyle = {
  padding: "0.75rem",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "background-color 0.3s",
};

const mainHeadingStyle = {
  fontSize: "2rem",
  color: "#6A0DAD",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "2rem",
};

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
  color: "#6A0DAD",
};

const productTextStyle = { margin: "0.25rem 0", color: "#555" };

const orderBtnStyle = {
  backgroundColor: "#6A0DAD",
  color: "#fff",
  padding: "0.75rem",
  border: "none",
  borderRadius: "25px",
  width: "100%",
  fontSize: "1rem",
  cursor: "pointer",
};
