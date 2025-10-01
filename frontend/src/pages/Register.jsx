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
      await axios.post("https://development-gttd.onrender.com/api/register", {
        name,
        surname,
        role,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html, #root { height: 100%; font-family: Arial, sans-serif; }

        .register-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 10px;
          background-color: #ffffff;
        }

        .register-form {
          position: relative;
          background: #fff;
          padding: 30px 20px 40px 20px;
          border-radius: 25px;
          border: 3px solid transparent;
          border-image-slice: 1;
          border-image-source: linear-gradient(45deg, #4facfe, #6b46c1);
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: border 0.3s ease, box-shadow 0.3s ease;
        }

        .register-form:hover {
          border-image-source: linear-gradient(45deg, #4facfe, #553c9a);
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        }

        .back-icon {
          position: absolute;
          top: 15px;
          left: 15px;
          cursor: pointer;
          font-size: 20px;
          color: #6b46c1;
          font-weight: bold;
          transition: transform 0.2s ease;
        }

        .back-icon:hover {
          transform: translateX(-3px);
        }

        .register-form h2 {
          text-align: center;
          font-size: 26px;
          color: #333;
          margin-bottom: 20px;
        }

        .register-form input[type="text"],
        .register-form input[type="email"],
        .register-form input[type="password"] {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 12px;
          font-size: 16px;
        }

        .role-group {
          margin-bottom: 15px;
          text-align: left;
        }

        .role-label {
          margin-right: 15px;
          font-size: 16px;
        }

        .register-form button {
          width: 100%;
          padding: 12px;
          background-color: #6b46c1;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .register-form button:hover {
          background-color: #553c9a;
        }

        .error-message {
          color: red;
          margin-bottom: 15px;
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .register-form {
            padding: 25px 15px 30px 15px;
          }
          .register-form h2 { font-size: 22px; }
          .register-form input[type="text"],
          .register-form input[type="email"],
          .register-form input[type="password"] {
            padding: 10px;
            font-size: 15px;
          }
          .register-form button { padding: 10px; font-size: 15px; }
          .back-icon { font-size: 18px; }
        }
      `}</style>

      <form className="register-form" onSubmit={handleSubmit}>
        {/* Back Arrow */}
        <div className="back-icon" onClick={() => navigate(-1)}>
          ←
        </div>

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

        <div className="role-group">
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
  );
}
