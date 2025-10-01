import React, { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

// Memoized components to reduce re-renders
const VendorList = memo(({ vendors }) => (
  <ul style={listStyle}>
    {vendors.map((v) => (
      <li key={v.id} style={listItemStyle}>{v.name}</li>
    ))}
  </ul>
));

const CustomerList = memo(({ customers }) => (
  <ul style={listStyle}>
    {customers.map((c) => (
      <li key={c.id} style={listItemStyle}>{c.name} {c.surname}</li>
    ))}
  </ul>
));

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showVendors, setShowVendors] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const navigate = useNavigate();

  // ---------------- FETCH DATA ----------------
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("https://development-gttd.onrender.com/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  }, []);

  const fetchVendors = useCallback(async () => {
    try {
      const res = await fetch("https://development-gttd.onrender.com/api/vendors");
      const data = await res.json();
      setVendors(data.vendors || []);
      setShowVendors(true);
      setShowCustomers(false);
    } catch (err) {
      console.error("❌ Error fetching vendors:", err);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch("https://development-gttd.onrender.com/api/customers");
      const data = await res.json();
      setCustomers(data.customers || []);
      setShowCustomers(true);
      setShowVendors(false);
    } catch (err) {
      console.error("❌ Error fetching customers:", err);
    }
  }, []);

  const handleDeleteProduct = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`https://development-gttd.onrender.com/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Error deleting product:", err);
    }
  }, []);

  const handleLogout = () => navigate("/");

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Topbar */}
      <div style={topbarStyle}>
        <h2 style={{ color: "#f9f9f9", margin: 0 }}>Admin Dashboard</h2>
        <div style={topBtnContainerStyle}>
          <button onClick={fetchVendors} style={topBtnStyle}>View Vendors</button>
          <button onClick={fetchCustomers} style={topBtnStyle}>View Customers</button>
          <button onClick={handleLogout} style={{ ...topBtnStyle, backgroundColor: "#dc3545" }}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "1rem" }}>
        {showVendors && <>
          <h3>Street Vendors List</h3>
          <VendorList vendors={vendors} />
        </>}

        {showCustomers && <>
          <h3>Customers List</h3>
          <CustomerList customers={customers} />
        </>}

        {/* Products Table */}
        <div style={tableContainerStyle}>
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <h3 style={{ margin: 0 }}>Products</h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Vendor</th>
                  <th>Location</th>
                  <th>Price (M)</th>
                  <th>Phone</th>
                  <th>🛠</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.photo ? <img src={`https://development-gttd.onrender.com/uploads/${p.photo}`} alt={p.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} /> : <div style={noImageStyle}>No Img</div>}</td>
                    <td>{p.name}</td>
                    <td>{p.owner_name || "N/A"}</td>
                    <td>{p.location || "N/A"}</td>
                    <td>{p.price}</td>
                    <td>{p.owner_phone || "N/A"}</td>
                    <td><span onClick={() => handleDeleteProduct(p.id)} style={deleteIconStyle}>🗑</span></td>
                  </tr>
                )) : <tr><td colSpan="8" style={{ textAlign: "center" }}>No products available.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- Styles -----------------
const topbarStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem",
  backgroundColor: "#6f42c1", // purple navbar
  color: "#fff",               // white text
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  marginBottom: "1rem",
  gap: "0.5rem",
};

const topBtnContainerStyle = { display: "flex", flexWrap: "wrap", gap: "0.5rem" };



// Buttons on the navbar
const topBtnStyle = {
  backgroundColor: "#fff",  // white button background
  color: "#6f42c1",         // purple text
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

// Vendor & customer lists
const listStyle = { listStyle: "none", padding: 0, maxHeight: "300px", overflowY: "auto" };
const listItemStyle = { padding: "0.5rem 0", borderBottom: "1px solid #ddd" };

// Products table
const tableContainerStyle = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 0 15px rgba(0,0,0,0.05)",
  padding: "1rem",
  overflowX: "auto",
};

const tableStyle = { width: "100%", borderCollapse: "collapse" };

// Product images
const noImageStyle = {
  width: "50px",
  height: "50px",
  background: "#eee",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.8rem",
  color: "#999",
  borderRadius: "4px",
};

// Delete icon
const deleteIconStyle = { cursor: "pointer", color: "#dc3545", fontSize: "1rem" };

