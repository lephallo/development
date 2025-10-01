import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AddItemForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorName: "",
    name: "",
    price: "",
    qty: "",
    photo: null,
    location: "",
    category: "",
    phone: "",
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.display_name;
          setFormData({ ...formData, location: address });
        } catch (err) {
          console.error(err);
          alert("Unable to get address from location. Please type it manually.");
        }
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve location. Please type it manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("vendor_name", formData.vendorName);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("qty", formData.qty);
    data.append("photo", formData.photo);
    data.append("location", formData.location);
    data.append("category", formData.category);
    data.append("phone_number", formData.phone);

    fetch("https://development-gttd.onrender.com/api/products", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        alert("Item submitted successfully!");
        setFormData({
          vendorName: "",
          name: "",
          price: "",
          qty: "",
          photo: null,
          location: "",
          category: "",
          phone: "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit item.");
      });
  };

  return (
    <div>
      <style>{`
        body, html, #root {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .item-form {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 500px;
        }
        .item-form h2 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 28px;
          color: #333;
        }
        .item-form label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
        }
        .item-form input[type="text"],
        .item-form input[type="number"],
        .item-form input[type="file"],
        .item-form input[type="tel"] {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 16px;
          box-sizing: border-box;
        }
        .item-form button {
          width: 100%;
          padding: 12px;
          background-color: #6b46c1;
          color: white;
          font-weight: bold;
          font-size: 16px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          margin-top: 10px;
        }
        .item-form button:hover {
          background-color: #553c9a;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .location-button {
          background-color: #6b46c1;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          padding: 10px;
          cursor: pointer;
          margin-bottom: 15px;
        }
        .location-button:hover {
          background-color: #553c9a;
        }
        .back-icon {
          cursor: pointer;
          font-size: 24px;
          color: black;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="container">
        <form className="item-form" onSubmit={handleSubmit}>
          {/* Back Icon */}
          <FaArrowLeft
            className="back-icon"
            onClick={() => navigate("/vendorDashboard")}
          />

          <h2>Add / Update Item</h2>

          <label>Vendor Name:</label>
          <input
            type="text"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Product Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required />

          <label>Quantity Available:</label>
          <input type="number" name="qty" value={formData.qty} onChange={handleChange} required />

          <label>Photo:</label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} required />

          <label>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />

          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{8,15}"
            placeholder="Enter phone number"
            required
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}   // ✅ now user can type
            placeholder="Click 'Use My Location' or type manually"
          />
          <button type="button" className="location-button" onClick={getLocation}>
            Use My Location
          </button>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddItemForm;
