import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function WelcomeScreen() {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/logo.png" alt="AlertFi Logo" style={styles.logo} />
        <h1 style={styles.title}>AlertFi Admin</h1>
        <p style={styles.subtitle}>Stay alert, Fire alert!</p>
        <div style={styles.buttonContainer}>
          <Link
            to="/register"
            style={{
              ...styles.button,
              ...(hoveredButton === 'register' ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton('register')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Register
          </Link>
          <span style={styles.linkSeparator}>|</span>
          <Link
            to="/login"
            style={{
              ...styles.button,
              ...(hoveredButton === 'login' ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton('login')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(to bottom right, #FFFFFF, #8b0000)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '24px',
    padding: '40px 30px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    maxWidth: 500,
    width: '100%',
  },
  logo: {
    width: '120px',
    marginBottom: '20px',
  },
  title: {
    fontSize: 40,
    fontWeight: 800,
    marginBottom: 10,
    background: 'linear-gradient(to right, #ff1744, #ff8a80)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 18,
    color: '#8b0000',
    fontWeight: 500,
    marginBottom: 30,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    background: 'linear-gradient(to right, #ff4e50, #ff1c1c)',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 30,
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: 16,
    boxShadow: '0 4px 10px rgba(255, 70, 70, 0.6)',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
  buttonHover: {
    transform: 'scale(1.05)',
    filter: 'brightness(1.1)',
  },
  linkSeparator: {
    fontSize: 20,
    color: '#8b0000',
    fontWeight: 'bold',
  },
};