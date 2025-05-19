// src/screens/HomeScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SemiCircleGauge from '../components/SemiCircleGauge';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [sensorOn, setSensorOn] = useState(true);
  const [ppm, setPpm] = useState(0);
  const [systemStatus, setSystemStatus] = useState('Safe');
  const socketRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !sensorOn) return;

    const socket = new WebSocket(`wss://alertfi-web-7jgc.onrender.com/ws/sensor/?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const { ppm } = JSON.parse(event.data);
        setPpm(ppm);
        const newStatus = ppm > 400 ? 'Danger' : ppm >= 300 ? 'Warning' : 'Safe';
        setSystemStatus(newStatus);

        if (newStatus !== 'Safe') {
          fetch('https://alertfi-web-7jgc.onrender.com/api/alerts/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ppm, status: newStatus }),
          }).catch(console.error);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    socket.onerror = (err) => console.error('WebSocket error:', err);
    socket.onclose = () => console.log('WebSocket disconnected');

    return () => socket.close();
  }, [sensorOn]);

  return (
    <div style={darkMode ? styles.containerDark : styles.containerLight}>
      <div style={styles.topBar}>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          style={styles.logoutButton}
        >
          Logout
        </button>

        <div style={styles.switchContainer}>
          <label
            style={{
              ...styles.switch,
              backgroundColor: darkMode ? '#4CAF50' : '#FF6B6B',
            }}
          >
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              style={{ display: 'none' }}
            />
            <span
              style={{
                ...styles.switchThumb,
                transform: darkMode ? 'translate(28px, -50%)' : 'translate(0, -50%)',
              }}
            />
          </label>
          <span style={styles.switchLabel}>
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
      </div>

      <h2 style={styles.title}>Welcome to AlertFi</h2>

      <div style={styles.gaugeContainer}>
        <SemiCircleGauge ppm={ppm} />
        <p style={styles.gaugeLabel}>
          Status:{' '}
          <strong
            style={{
              color:
                systemStatus === 'Danger'
                  ? 'red'
                  : systemStatus === 'Warning'
                  ? 'orange'
                  : 'green',
            }}
          >
            {systemStatus}
          </strong>
        </p>
      </div>

      <div style={styles.switchContainer}>
        <label
          style={{
            ...styles.switch,
            backgroundColor: sensorOn ? '#4CAF50' : '#FF6B6B',
          }}
        >
          <input
            type="checkbox"
            checked={sensorOn}
            onChange={() => setSensorOn(!sensorOn)}
            style={{ display: 'none' }}
          />
          <span
            style={{
              ...styles.switchThumb,
              transform: sensorOn ? 'translate(28px, -50%)' : 'translate(0, -50%)',
            }}
          />
        </label>
        <span style={styles.switchLabel}>
          {sensorOn ? 'Sensor is ON' : 'Sensor is OFF'}
        </span>
      </div>

      <button onClick={() => navigate('/history')} style={styles.navigateButton}>
        View History
      </button>
    </div>
  );
};

const styles = {
  containerLight: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(to bottom right,  #FFFFFF, #8b0000)',
    color: '#1e1e2f',
    padding: '20px',
    boxSizing: 'border-box',
  },
  containerDark: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(to bottom right, #4a0000, #8b0000)',
    color: '#fceaea',
    padding: '20px',
    boxSizing: 'border-box',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    background: 'linear-gradient(to right, #ff4e50, #ff1c1c)',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 4px 10px rgba(255, 70, 70, 0.6)',
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: 30,
    background: 'linear-gradient(to right, #ff1744, #ff8a80)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  gaugeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 30px auto',
    background: 'linear-gradient(to bottom right, #ffebeb, #ffcccc)',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 8px 16px rgba(255, 0, 0, 0.3)',
  },
  gaugeLabel: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: 600,
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
    justifyContent: 'center',
  },
  switch: {
    width: 60,
    height: 30,
    borderRadius: 9999,
    background: 'linear-gradient(to right, #ff4e4e, #ff7373)',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '50%',
    left: 4,
    transform: 'translateY(-50%)',
    transition: 'transform 0.3s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 500,
  },
  navigateButton: {
    background: 'linear-gradient(to right, #ff5252, #ff1744)',
    color: '#fff',
    padding: '12px 28px',
    border: 'none',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 50,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 6px 14px rgba(255, 80, 80, 0.5)',
  },
};

export default HomeScreen;
