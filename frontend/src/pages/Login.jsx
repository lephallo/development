import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://development-gttd.onrender.com/api/login", { email, password });

      // ✅ Save the logged-in user to localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const userRole = res.data.user.role.toLowerCase();

      if (userRole === "admin") navigate("/adminDashboard");
      else if (userRole === "customer") navigate("/customerDashboard");
      else if (userRole === "vendor") navigate("/vendorDashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
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
        .login-form {
          background-color: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .login-form h2 {
          margin-bottom: 20px;
          font-size: 28px;
          color: #333;
        }
        .login-form input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 16px;
        }
        .login-form button {
          width: 100%;
          padding: 12px;
          background-color: #6b46c1;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
        }
        .login-form button:hover {
          background-color: #553c9a;
        }
        .register-link {
          margin-top: 15px;
          font-size: 14px;
          color: #555;
        }
        .register-link a {
          color: #6b46c1;
          font-weight: bold;
          text-decoration: none;
        }
        .register-link a:hover {
          text-decoration: underline;
        }
        .error-message {
          color: red;
          margin-bottom: 15px;
        }
      `}</style>

      <div className="container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>

          {error && <div className="error-message">{error}</div>}

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

          <button type="submit">Login</button>

          <div className="register-link">
            Not a member yet?{" "}
            <a href="#" onClick={() => navigate("/register")}>
              Create your account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
