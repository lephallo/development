import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* Internal CSS */}
      <style>{`
        .navbar {
          background-color: #e6ccff;
          padding: 1rem 2rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .navbar h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
          color: #4b0082;
          text-align: center;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }
        .main h2 {
          font-size: 2.5rem;
          color: #6a0dad;
          margin-bottom: 1rem;
        }
        .main p {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 2rem;
          max-width: 600px;
        }

        .btn-container {
          display: flex;
          gap: 1.5rem;
        }
        .btn {
          background-color: #6a0dad;
          color: white;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .btn:hover {
          background-color: #4b0082;
        }

        .footer {
          background-color: #e6ccff;
          text-align: center;
          padding: 1rem;
          font-size: 0.9rem;
          color: #4b0082;
          box-shadow: inset 0 1px 4px rgba(0,0,0,0.1);
        }

        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #f9f9fb;
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <h1>Maseru Taxi Ranks App</h1>
      </nav>

      {/* Main Section */}
      <main className="main">
        <h2>Welcome to Maseru Taxi Ranks App</h2>
        <p>
          Helping street vendors gain more competitiveness by posting their
          products online. Customers can order easily, and products will be
          delivered right to them at the taxi ranks.
        </p>

        <div className="btn-container">
          <button onClick={() => navigate("/login")} className="btn">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="btn">
            Register
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Maseru Taxi Ranks App. All rights reserved.
      </footer>
    </div>
  );
}
