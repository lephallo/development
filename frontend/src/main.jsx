import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddItemForm from './pages/AddItemForm';
import Order from "./pages/Order";
import TrackOrder from "./pages/TrackOrder";
import Notification from "./pages/Notification";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
     <Route path="/adminDashboard" element={<AdminDashboard />} />
     <Route path="/customerDashboard" element={<CustomerDashboard />} />
     <Route path="/vendorDashboard" element={<VendorDashboard />} />
     <Route path="/add-item" element={<AddItemForm />} /> 
     <Route path="/order" element={<Order />} /> 
      <Route path="/trackorder" element={<TrackOrder />} /> 
       <Route
          path="/notification" element={<Notification vendorId={1} />}
        />
        
        

      
    </Routes>
  </BrowserRouter>
);
