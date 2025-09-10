import { useState, useMemo, useEffect, useRef } from 'react';

const dummyDetectors = [
  { id: 'D-001', name: 'Detector 1', user: 'James Ford' },
  { id: 'D-002', name: 'Detector 2', user: 'Anna Montana' },
  { id: 'D-003', name: 'Detector 3', user: 'Angela Ken' },
];

const dummyLogs = [
  { id: 1, detectorId: 'D-001', timestamp: '2025-05-27T09:00:00', event: 'Safe', details: '500' },
  { id: 2, detectorId: 'D-001', timestamp: '2025-05-27T10:15:00', event: 'Warning', details: '3000' },
  { id: 3, detectorId: 'D-002', timestamp: '2025-05-26T22:00:00', event: 'Fire Risk', details: '7000' },
  { id: 4, detectorId: 'D-003', timestamp: '2025-05-25T18:45:00', event: 'Safe', details: '300' },
  { id: 5, detectorId: 'D-001', timestamp: '2025-05-27T11:00:00', event: 'Safe', details: '200' },
];

const EVENT_COLORS = {
  'Safe': 'green',
  'Warning': 'orange',
  'Fire Risk': 'red',
};

export default function Logs() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [logs] = useState(dummyLogs);

  const logsRef = useRef(logs);

  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const detector = dummyDetectors.find(d => d.id === log.detectorId);
      const detectorInfo = `${log.detectorId} ${detector?.name || ''} ${detector?.user || ''}`.toLowerCase();
      const matchesSearch = detectorInfo.includes(search.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || log.event === selectedStatus;
      return matchesStatus && matchesSearch;
    });
  }, [logs, selectedStatus, search]);

  function exportCSV() {
    const header = ['ID', 'Detector ID', 'Detector Name', 'User', 'Timestamp', 'Event', 'Details'];
    const rows = filteredLogs.map(log => {
      const detector = dummyDetectors.find(d => d.id === log.detectorId);
      return [
        log.id,
        log.detectorId,
        detector?.name || '',
        detector?.user || '',
        new Date(log.timestamp).toLocaleString(),
        log.event,
        log.details,
      ];
    });
    const csvContent = [header, ...rows]
      .map(e => e.map(a => `"${a}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_${selectedStatus}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <h1 style={titleStyle}>📜 Detection Logs</h1>

      <div style={filtersContainerStyle}>
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          style={selectStyle}
        >
          <option value="All">All Status Levels</option>
          <option value="Safe">Safe</option>
          <option value="Warning">Warning</option>
          <option value="Fire Risk">Fire Risk</option>
        </select>

        <input
          type="text"
          placeholder="Search by detector ID, name, or user..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />

        <button onClick={exportCSV} style={buttonStyle}>Export CSV</button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Detector Name</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>Status Level</th>
            <th style={thStyle}>PPM</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                No logs found.
              </td>
            </tr>
          )}
          {filteredLogs.map(log => {
            const detector = dummyDetectors.find(d => d.id === log.detectorId);
            return (
              <tr key={log.id}>
                <td style={tdStyle}>{log.id}</td>
                <td style={tdStyle}>{detector ? `${detector.name} (${detector.id})` : log.detectorId}</td>
                <td style={tdStyle}>{detector?.user || 'Unknown'}</td>
                <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ ...tdStyle, color: EVENT_COLORS[log.event] || 'black', fontWeight: 'bold' }}>
                  {log.event}
                </td>
                <td style={tdStyle}>{log.details}</td>
              </tr>
            );
          })}
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
  flex: '1 1 250px',
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
  minWidth: '180px',
  cursor: 'pointer',
};

const buttonStyle = {
  padding: '10px 16px',
  fontSize: '16px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
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
