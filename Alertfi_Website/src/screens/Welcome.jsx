import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <div className="welcome-card">
        <img src={logo} alt="AlertFi Logo" className="logo" />
        <h1>Welcome to AlertFi</h1>
        <p>Stay alert, Fire alert!</p>
        <Link to="/login" className="btn">
          Login
        </Link>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap");

        .welcome-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #f6e7e5, #b6403c, #731414);
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
          font-family: "Outfit", sans-serif;
          overflow: hidden;
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

        .welcome-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 60px 60px;
          border-radius: 18px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          width: 90%;
          max-width: 460px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .welcome-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.3);
        }

        .logo {
          width: 120px;
          height: auto;
          margin-bottom: 20px;
          filter: drop-shadow(0 2px 4px rgba(214, 60, 45, 0.3));
        }

        h1 {
          color: #b92d1d;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        p {
          color: #555;
          font-size: 1.1rem;
          margin-bottom: 40px;
        }

        .btn {
          text-decoration: none;
          background: linear-gradient(90deg, #c43b2f, #e85a42);
          color: #fff;
          padding: 12px 50px;
          border-radius: 35px;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 12px rgba(214, 60, 45, 0.25);
          transition: all 0.25s ease;
        }

        .btn:hover {
          background: linear-gradient(90deg, #a82c24, #d94938);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(214, 60, 45, 0.4);
        }

        @media (max-width: 768px) {
          .welcome-card {
            padding: 45px 35px;
            width: 85%;
          }

          h1 {
            font-size: 1.9rem;
          }

          p {
            font-size: 1rem;
          }

          .btn {
            padding: 10px 35px;
          }
        }
      `}</style>
    </div>
  );
}

export default WelcomeScreen;
