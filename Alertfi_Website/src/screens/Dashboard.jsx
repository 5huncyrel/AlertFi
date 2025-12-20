// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';

const API_URL = 'https://alertfi.onrender.com/';
const OFFLINE_THRESHOLD = 1000 * 60 * 60 * 2; // 2 hours

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [detectors, setDetectors] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Please log in as admin first.');
        setLoading(false);
        return;
      }

      try {
        const [usersRes, detectorsRes, logsRes] = await Promise.all([
          fetch(`${API_URL}api/admin/users/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}api/admin/detectors/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}api/admin/readings/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if ([usersRes, detectorsRes, logsRes].some(r => r.status === 401)) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('accessToken');
          setLoading(false);
          return;
        }

        const usersData = await usersRes.json();
        const detectorsData = await detectorsRes.json();
        const logsData = await logsRes.json();

        setUsers(usersData);
        setDetectors(detectorsData);
        setLogs(logsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading dashboard data...</div>;

  // Calculate statistics
  const totalUsers = users.length;
  const totalDetectors = detectors.length;

  // High-risk detectors (latest log status = DANGER)
  const highRiskDetectors = detectors.filter(d => {
    const latestLog = logs
      .filter(l => l.detector === d.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    return latestLog?.status?.toUpperCase() === 'DANGER';
  }).length;

  // Offline detectors (no recent logs within threshold)
  const offlineDetectors = detectors.filter(d => {
    const latestLog = logs
      .filter(l => l.detector === d.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    if (!latestLog) return true; // no logs → offline
    return Date.now() - new Date(latestLog.timestamp).getTime() > OFFLINE_THRESHOLD;
  }).length;

  // Most Triggered Zones (based on user address for DANGER logs)
  const zoneTriggerCounts = logs.reduce((acc, log) => {
    if (log.status?.toUpperCase() === 'DANGER') {
      const detector = detectors.find(d => d.id === log.detector);
      const user = users.find(u => u.id === detector?.user);
      const address = user?.address || 'No address';
      acc[address] = (acc[address] || 0) + 1;
    }
    return acc;
  }, {});

  const zones = Object.keys(zoneTriggerCounts);
  const counts = zones.map(z => zoneTriggerCounts[z]);

  // Recently Triggered Detectors (last log = DANGER or WARNING)
  const recentDetectors = detectors.filter(d => {
    const latestLog = logs
      .filter(l => l.detector === d.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    if (!latestLog) return false;
    const status = latestLog.status?.toUpperCase();
    d.latestLog = latestLog; // attach latest log for display
    return status === 'DANGER' || status === 'WARNING';
  });

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 20 }}>📊 Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Total Detectors" value={totalDetectors} />
        <StatCard label="High-Risk Detectors" value={highRiskDetectors} highlight color="red" />
        <StatCard label="Offline Detectors" value={offlineDetectors} highlight color="orange" />
      </div>

      <h2>Most Triggered Zones</h2>
      {zones.length === 0 ? (
        <p>No recent triggers detected.</p>
      ) : (
        <div>
          {zones.map((zone, i) => (
            <div key={zone} style={{ marginBottom: 8 }}>
              <strong>{zone}</strong>: {counts[i]} trigger{counts[i] > 1 ? 's' : ''}
              <ProgressBar percent={(counts[i] / Math.max(...counts)) * 100} />
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 40 }}>Recently Triggered Detectors</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th style={thStyle}>Detector ID</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Last Report</th>
          </tr>
        </thead>
        <tbody>
          {recentDetectors.map(d => {
            const user = users.find(u => u.id === d.user);
            const latestLog = d.latestLog;
            const status = latestLog?.status?.toUpperCase();
            const lastReport = latestLog?.timestamp
              ? new Date(latestLog.timestamp).toLocaleString()
              : 'No report';
            const address = user?.address || 'No address';
            return (
              <tr key={d.id}>
                <td style={tdStyle}>{d.id}</td>
                <td style={tdStyle}>{user ? user.name : 'Unknown'}</td>
                <td style={tdStyle}>{address}</td>
                <td style={{ ...tdStyle, color: status === 'DANGER' ? 'red' : 'orange' }}>
                  {status}
                </td>
                <td style={tdStyle}>{lastReport}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Stat card component
function StatCard({ label, value, highlight = false, color = '#3b82f6' }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: highlight ? color : '#3b82f6',
        color: 'white',
        padding: 20,
        borderRadius: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        userSelect: 'none',
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.8 }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}

// Progress bar component
function ProgressBar({ percent }) {
  return (
    <div style={{ height: 10, width: '100%', backgroundColor: '#e5e7eb', borderRadius: 5, marginTop: 4 }}>
      <div
        style={{
          height: '100%',
          width: `${percent}%`,
          backgroundColor: '#3b82f6',
          borderRadius: 5,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}


const thStyle = {
  padding: '12px',
  fontWeight: 'bold',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
};
