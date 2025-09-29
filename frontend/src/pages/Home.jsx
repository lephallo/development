import { useNavigate } from "react-router-dom";
import taxiImage from "../assets/taxi.jpg";


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Taxi Image */}
      <img
        src={taxiImage}
        alt="Taxi"
        className="w-72 md:w-96 mb-6 rounded-lg shadow-lg object-cover"
      />

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        Maburu Marketplace
      </h1>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-lg shadow"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 transition text-white font-semibold rounded-lg shadow"
        >
          Register
        </button>
      </div>
    </div>
  );
}
