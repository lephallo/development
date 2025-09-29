import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showVendors, setShowVendors] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const navigate = useNavigate();

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://development-gttd.onrender.com/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  // ---------------- FETCH VENDORS ----------------
  const fetchVendors = async () => {
    try {
      const res = await fetch("https://development-gttd.onrender.com/api/vendors");
      const data = await res.json();
      setVendors(data.vendors || []);
      setShowVendors(true);
      setShowCustomers(false);
    } catch (err) {
      console.error("❌ Error fetching vendors:", err);
    }
  };

  // ---------------- FETCH CUSTOMERS ----------------
  const fetchCustomers = async () => {
    try {
      const res = await fetch("https://development-gttd.onrender.com/api/customers");
      const data = await res.json();
      setCustomers(data.customers || []);
      setShowCustomers(true);
      setShowVendors(false);
    } catch (err) {
      console.error("❌ Error fetching customers:", err);
    }
  };

  // ---------------- DELETE PRODUCT ----------------
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`https://development-gttd.onrender.com/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Product deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    // You can clear auth tokens or session here
    navigate("/");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      {/* Topbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ color: "#4CAF50", margin: 0 }}>Admin Dashboard</h2>
        <div>
          <button onClick={fetchVendors} style={topBtnStyle}>
            View Vendors
          </button>
          <button onClick={fetchCustomers} style={topBtnStyle}>
            View Customers
          </button>
          <button
            onClick={handleLogout}
            style={{ ...topBtnStyle, backgroundColor: "#dc3545" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "2rem" }}>
        {/* Vendors List */}
        {showVendors && (
          <>
            <h3>Street Vendors List</h3>
            <ul style={listStyle}>
              {vendors.map((v) => (
                <li key={v.id} style={listItemStyle}>
                  {v.name}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Customers List */}
        {showCustomers && (
          <>
            <h3>Customers List</h3>
            <ul style={listStyle}>
              {customers.map((c) => (
                <li key={c.id} style={listItemStyle}>
                  {c.name} {c.surname}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Products Table */}
        <div style={tableContainerStyle}>
          {/* Header */}
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <h3 style={{ margin: 0 }}>Create Your Domain Name</h3>
            <p style={{ margin: 0 }}>Table #03</p>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>#</th>
                  <th style={headerCellStyle}>Image</th>
                  <th style={headerCellStyle}>Product</th>
                  <th style={headerCellStyle}>Vendor</th>
                  <th style={headerCellStyle}>Location</th>
                  <th style={headerCellStyle}>Price (M)</th>
                  <th style={headerCellStyle}>Phone</th>
                  <th style={headerCellStyle}>🛠</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#f2f2f2" : "white",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e0e0e0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          i % 2 === 0 ? "#f2f2f2" : "white")
                      }
                    >
                      <td style={cellStyle}>{i + 1}</td>
                      <td style={cellStyle}>
                        {p.photo ? (
                          <img
                            src={`https://development-gttd.onrender.com/uploads/${p.photo}`}
                            alt={p.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={noImageStyle}>No Img</div>
                        )}
                      </td>
                      <td style={cellStyle}>{p.name}</td>
                      <td style={cellStyle}>{p.owner_name || "N/A"}</td>
                      <td style={cellStyle}>{p.location || "N/A"}</td>
                      <td style={cellStyle}>{p.price}</td>
                      <td style={cellStyle}>{p.owner_phone || "N/A"}</td>
                      <td style={cellStyle}>
                        <span
                          onClick={() => handleDeleteProduct(p.id)}
                          style={deleteIconStyle}
                          title="Delete Product"
                        >
                          🗑
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                      No products available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- STYLES -----------------
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

const listStyle = { listStyle: "none", padding: 0, maxHeight: "300px", overflowY: "auto" };
const listItemStyle = { padding: "0.5rem 0", borderBottom: "1px solid #ddd" };

const tableContainerStyle = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 0 15px rgba(0,0,0,0.05)",
  padding: "20px",
  maxWidth: "100%",
  margin: "0 auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const headerCellStyle = {
  backgroundColor: "#6f42c1",
  color: "white",
  padding: "12px",
  fontWeight: "bold",
  fontSize: "0.9rem",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
};

const cellStyle = {
  padding: "12px",
  fontSize: "0.9rem",
  verticalAlign: "middle",
};

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

const deleteIconStyle = {
  cursor: "pointer",
  color: "#dc3545",
  fontSize: "1.2rem",
  display: "inline-block",
  padding: "0.2rem",
};