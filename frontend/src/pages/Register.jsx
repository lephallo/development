import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3003/api/register", {
        name,
        surname,
        role,
        email,
        password,
      });
      console.log("User registered:", res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      {/* Internal CSS */}
      <style>{`
        body, html, #root {
          height: 100%;
          margin: 0;
          font-family: Arial, sans-serif;
          background-color: #ffffff;
        }
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 10px;
        }
        .register-form {
          background-color: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .register-form h2 {
          margin-bottom: 20px;
          font-size: 28px;
          color: #333;
        }
        .register-form input[type="text"],
        .register-form input[type="email"],
        .register-form input[type="password"] {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 16px;
        }
        .register-form .role-label {
          margin-right: 15px;
          font-size: 16px;
        }
        .register-form button {
          width: 100%;
          padding: 12px;
          background-color: #6b46c1; /* purple */
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
        }
        .register-form button:hover {
          background-color: #553c9a;
        }
        .error-message {
          color: red;
          margin-bottom: 15px;
        }
      `}</style>

      <div className="container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>

          {error && <div className="error-message">{error}</div>}

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />

          <div className="mb-3" style={{ marginBottom: "15px", textAlign: "left" }}>
            <p style={{ marginBottom: "5px", fontWeight: "bold" }}>Role</p>
            <label className="role-label">
              <input
                type="radio"
                name="role"
                value="admin"
                onChange={(e) => setRole(e.target.value)}
                required
              /> Admin
            </label>
            <label className="role-label">
              <input
                type="radio"
                name="role"
                value="customer"
                onChange={(e) => setRole(e.target.value)}
                required
              /> Customer
            </label>
            <label className="role-label">
              <input
                type="radio"
                name="role"
                value="vendor"
                onChange={(e) => setRole(e.target.value)}
                required
              /> Street Vendor
            </label>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
