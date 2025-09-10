import { useState, useMemo } from 'react';

// Dummy detector data
const dummyDetectors = [
  { id: 'D-001', name: 'Detector 1', user: 'James Ford', location: 'Kitchen', status: 'Online', lastActive: new Date().toISOString(), faulty: true },
  { id: 'D-002', name: 'Detector 2', user: 'Anna Montana', location: 'Bed Room', status: 'Online', lastActive: new Date().toISOString(), faulty: true },
  { id: 'D-003', name: 'Detector 3', user: 'Angela Ken', location: 'Living Room', status: 'Offline', lastActive: '2025-05-26T21:00:00', faulty: true },
  { id: 'D-004', name: 'Detector 4', user: 'Ivy Aguas', location: 'Bed Room 2', status: 'Offline', lastActive: '2025-05-27T07:45:00', faulty: false },
];

const LOCATIONS = ['Kitchen', 'Bed Room', 'Living Room', 'Bed Room 2'];
const STATUSES = ['Online', 'Offline'];

export default function Detector() {
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [detectors] = useState(dummyDetectors);

  // Filter logic
  const filteredDetectors = useMemo(() => {
    return detectors.filter(detector => {
      const matchesSearch =
        detector.name.toLowerCase().includes(search.toLowerCase()) ||
        detector.user.toLowerCase().includes(search.toLowerCase());

      const matchesLocation = filterLocation === '' || detector.location === filterLocation;
      const matchesStatus = filterStatus === '' || detector.status === filterStatus;

      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [detectors, search, filterLocation, filterStatus]);

  return (
    <div>
      <h1 style={titleStyle}>🛠️ Detector Management</h1>

      <div style={filtersContainerStyle}>
        <input
          type="text"
          placeholder="Search by detector name or user..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} style={selectStyle}>
          <option value="">All Locations</option>
          {LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          {STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Detector Name</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Last Active</th>
            <th style={thStyle}>Detector Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredDetectors.map(detector => {
            const lastActiveDate = new Date(detector.lastActive);
            const isOffline = (Date.now() - lastActiveDate.getTime()) > 2 * 60 * 60 * 1000; // 2 hours

            return (
              <tr key={detector.id} style={{ backgroundColor: isOffline ? '#ffe6e6' : '#e6ffea' }}>
                <td style={tdStyle}>{detector.id}</td>
                <td style={tdStyle}>{detector.name}</td>
                <td style={tdStyle}>{detector.user}</td>
                <td style={tdStyle}>{detector.location}</td>
                <td style={tdStyle}>{lastActiveDate.toLocaleString()}</td>
                <td style={{ ...tdStyle, color: isOffline ? 'gray' : 'green' }}>
                  {isOffline ? 'Offline' : 'Online'}
                </td>
              </tr>
            );
          })}
          {filteredDetectors.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                No detectors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const titleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const filtersContainerStyle = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  marginBottom: '20px',
  alignItems: 'center',
};

const inputStyle = {
  flex: '1 1 200px',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const selectStyle = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  minWidth: '140px',
  cursor: 'pointer',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
};

const thStyle = {
  padding: '12px',
  backgroundColor: '#f3f4f6',
  textAlign: 'left',
  fontSize: '15px',
  fontWeight: 'bold',
  borderBottom: '1px solid #e5e7eb',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #f0f0f0',
  fontSize: '14px',
};
