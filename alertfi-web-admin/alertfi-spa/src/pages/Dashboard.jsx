// src/pages/Dashboard.jsx
import { useState } from 'react';

const dummyUsers = [
  { id: 1, name: 'Anna Montana' },
  { id: 2, name: 'James Ford' },
  { id: 3, name: 'Angela Ken' },
];

const dummyDetectors = [
  { id: 1, userId: 1, address: 'Balulang', status: 'Safe', lastPost: Date.now() - 1000 * 60 * 30 }, // 30 min ago
  { id: 2, userId: 1, address: 'Carmen, Amakan', status: 'Fire Risk', lastPost: Date.now() - 1000 * 60 * 10 }, // 10 min ago
  { id: 3, userId: 2, address: 'Lapasan', status: 'Warning', lastPost: Date.now() - 1000 * 60 * 190 }, // 3+ hours ago (offline)
  { id: 4, userId: 3, address: 'Camaman-an', status: 'Safe', lastPost: Date.now() - 1000 * 60 * 40 }, // 40 min ago
];

// Helper to get offline detectors (no POST in 2+ hours)
const OFFLINE_THRESHOLD = 1000 * 60 * 60 * 2; // 2 hours in ms

export default function Dashboard() {
  const [users] = useState(dummyUsers);
  const [detectors] = useState(dummyDetectors);

  // Calculate stats
  const totalUsers = users.length;
  const totalDetectors = detectors.length;
  const highRiskDetectors = detectors.filter(d => d.status === 'Fire Risk').length;
  const offlineDetectors = detectors.filter(d => Date.now() - d.lastPost > OFFLINE_THRESHOLD).length;

  // Dummy trend data: counts per zone
  const zoneTriggerCounts = detectors.reduce((acc, d) => {
    if (d.status === 'Fire Risk' || d.status === 'Warning') {
      acc[d.address] = (acc[d.address] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert to arrays for display
  const zones = Object.keys(zoneTriggerCounts);
  const counts = zones.map(z => zoneTriggerCounts[z]);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 20 }}>📊 Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Total Detectors" value={totalDetectors} />
        <StatCard label="High-Risk Detectors" value={highRiskDetectors} highlight />
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
            <th style={thStyle}>Status Level</th>
            <th style={thStyle}>Last Report</th>
          </tr>
        </thead>
        <tbody>
          {detectors
            .filter(d => d.status === 'Fire Risk' || d.status === 'Warning')
            .map(d => {
              const user = users.find(u => u.id === d.userId);
              return (
                <tr key={d.id}>
                  <td style={tdStyle}>{d.id}</td>
                  <td style={tdStyle}>{user ? user.name : 'Unknown'}</td>
                  <td style={tdStyle}>{d.address}</td>
                  <td style={{ ...tdStyle, color: d.status === 'Fire Risk' ? 'red' : 'orange' }}>{d.status}</td>
                  <td style={tdStyle}>{new Date(d.lastPost).toLocaleString()}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, highlight = false, color = 'red' }) {
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

function ProgressBar({ percent }) {
  return (
    <div
      style={{
        height: 10,
        width: '100%',
        backgroundColor: '#e5e7eb',
        borderRadius: 5,
        marginTop: 4,
      }}
    >
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
