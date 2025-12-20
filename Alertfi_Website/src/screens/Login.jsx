import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://alertfi.onrender.com/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid email or password");

      const data = await response.json();
      if (data.access) localStorage.setItem("accessToken", data.access);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <img src={logo} alt="AlertFi Logo" className="logo" />
        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
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

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap");

        .login-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f6e7e5, #b6403c, #731414);
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
          font-family: "Outfit", sans-serif;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px 45px;
          border-radius: 18px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
          width: 90%;
          max-width: 380px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .logo {
          width: 85px;
          height: auto;
          filter: drop-shadow(0 2px 4px rgba(214, 60, 45, 0.3));
        }

        h1 {
          color: #b92d1d;
          font-size: 1.9rem;
          font-weight: 700;
          margin-bottom: 30px;
        }

        .subtitle {
          color: #555;
          font-size: 0.95rem;
          margin-bottom: 25px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        input:focus {
          border-color: #c43b2f;
          outline: none;
          box-shadow: 0 0 6px rgba(214, 60, 45, 0.3);
        }

        .error {
          color: #d32f2f;
          font-weight: 600;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        button {
          width: 40%;
          align-self: center; 
          background: linear-gradient(90deg, #c43b2f, #e85a42);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          padding: 10px;
          border-radius: 35px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          margin-top: 10px;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(214, 60, 45, 0.4);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .login-card {
            width: 85%;
            padding: 35px 30px;
          }

          h1 {
            font-size: 1.7rem;
          }

          .subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
