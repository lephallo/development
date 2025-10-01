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
    <div className="login-page">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html, #root { height: 100%; font-family: Arial, sans-serif; }

        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 10px;
          background-color: #ffffff;
        }

        .login-form {
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

        .login-form:hover {
          border-image-source: linear-gradient(45deg, #4facfe, #553c9a);
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        }

        .login-form h2 {
          text-align: center;
          font-size: 26px;
          color: #333;
          margin-bottom: 20px;
        }

        .login-form input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 12px;
          font-size: 16px;
        }

        .login-form button {
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

        .login-form button:hover {
          background-color: #553c9a;
        }

        .register-link {
          margin-top: 15px;
          font-size: 14px;
          color: #555;
          text-align: center;
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
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .login-form {
            padding: 25px 15px 30px 15px;
          }
          .login-form h2 { font-size: 22px; }
          .login-form input { padding: 10px; font-size: 15px; }
          .login-form button { padding: 10px; font-size: 15px; }
        }
      `}</style>

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
  );
}
