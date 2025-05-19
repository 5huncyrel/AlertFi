import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryScreen = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Initial fetch of alert logs from backend
    fetch('https://alertfi-web-7jgc.onrender.com/api/alerts/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error('Failed to load alerts', err));

    // Real-time updates via WebSocket
    const socket = new WebSocket(`wss://alertfi-web-7jgc.onrender.com/ws/sensor/?token=${token}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const timestamp = new Date().toISOString();

      // Expecting backend to send: { message: "PPM: 390", alert_level: "warning" }
      const newAlert = {
        message: data.message,
        alert_level: data.alert_level,
        timestamp: timestamp,
      };

      if (data.alert_level !== 'safe') {
        setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}> 🔥Alert History 🔥</h2>

      {alerts.length === 0 ? (
        <p style={styles.noHistory}>No alerts found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Timestamp</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>PPM</th>
            </tr>
          </thead>
          <tbody>
            {alerts
              .filter(alert => alert.alert_level === 'warning' || alert.alert_level === 'danger') // 🔥 only these two
              .map((alert, index) => {
                const rowStyle = {
                  ...styles.tableCell,
                  color:
                    alert.alert_level === 'danger' ? 'red' :
                    alert.alert_level === 'warning' ? 'orange' :
                    'black',
                  fontWeight: alert.alert_level !== 'safe' ? 'bold' : 'normal',
                };

                const ppmMatch = alert.message?.match(/PPM: (\d+)/);
                const ppm = ppmMatch ? ppmMatch[1] : 'N/A';

                return (
                  <tr key={index}>
                    <td style={rowStyle}>{new Date(alert.timestamp).toLocaleString()}</td>
                    <td style={rowStyle}>{alert.alert_level}</td>
                    <td style={rowStyle}>{ppm}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      <button style={styles.backButton} onClick={() => navigate('/home')}>
        Back to Home
      </button>
    </div>
  );
};



const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 30px',
    boxSizing: 'border-box',
    alignItems: 'center',
    background: 'linear-gradient(to bottom right, #FFFFFF, #ff4c4c)',

  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  backButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 30,
    transition: 'background-color 0.3s ease',
  },
  noHistory: {
    fontSize: 18,
    color: '#777',
  },
  table: {
    width: '80%',
    borderCollapse: 'collapse',
    marginTop: 20,
  },
  tableHeader: {
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#FF00004D',
    color: '#fff',
  },
  tableCell: {
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: 16,
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },
};

export default HistoryScreen;
