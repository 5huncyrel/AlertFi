import { useState } from "react";

const dummyUsers = [
  {
    id: 1,
    name: "James Ford",
    email: "james@gmail.com",
    address: "Carmen, Amakan",
    registered: "2024-01-10",
    status: "Active",
    detectors: [
      { id: "D1", location: "Living Room", status: "Safe" },
      { id: "D2", location: "Kitchen", status: "Fire Risk" },
      { id: "D3", location: "Bed Room", status: "Warning" },
    ],
  },
  {
    id: 2,
    name: "Anna Montana",
    email: "anna@gmail.com",
    address: "Cmaman-an, Paglaum",
    registered: "2024-03-22",
    status: "Inactive",
    detectors: [{ id: "D4", location: "Bedroom", status: "Safe" }],
  },
  {
    id: 3,
    name: "Angela Ken",
    email: "angela@gmail.com",
    address: "Balulang, Carinugan",
    registered: "2025-02-05",
    status: "Active",
    detectors: [
      { id: "D5", location: "Kitchen", status: "Safe" },
      { id: "D6", location: "Living Room", status: "Warning" },
    ],
  },
];

const dummyLogs = {
  D1: [
    { timestamp: "2025-05-25 10:00", event: "No fire detected" },
    { timestamp: "2025-05-24 18:15", event: "Gas level normal" },
  ],
  D2: [
    { timestamp: "2025-05-26 02:45", event: "Fire risk detected!" },
    { timestamp: "2025-05-25 11:30", event: "Gas spike warning" },
  ],
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [users] = useState(dummyUsers);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [selectedDetectorLogs, setSelectedDetectorLogs] = useState(null);

  const filteredUsers = users.filter((user) => {
    const search = searchQuery.toLowerCase();
    const statusMatch = filterStatus
      ? user.status.toLowerCase() === filterStatus.toLowerCase()
      : true;
    return (
      (user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.address.toLowerCase().includes(search)) &&
      statusMatch
    );
  });

  const toggleExpandUser = (id) => {
    if (expandedUserId === id) {
      setExpandedUserId(null);
      setSelectedDetectorLogs(null);
    } else {
      setExpandedUserId(id);
      setSelectedDetectorLogs(null);
    }
  };

  const showLogs = (detectorId) => {
    setSelectedDetectorLogs({ detectorId, logs: dummyLogs[detectorId] || [] });
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={titleStyle}>👥 User Management</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 800 }}>
        <input
          type="text"
          placeholder="Search by name, email, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>Registered</th>
            <th style={thStyle}>Detectors</th>
            <th style={thStyle}>User Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 20, textAlign: "center" }}>
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.address}</td>
                <td style={tdStyle}>{user.registered}</td>
                <td style={tdStyle}>
                  {user.detectors.length} total,{" "}
                  <button
                    onClick={() => toggleExpandUser(user.id)}
                    style={linkButtonStyle}
                  >
                    {expandedUserId === user.id ? "Hide Detectors" : "View Detectors"}
                  </button>
                </td>
                <td
                  style={{
                    ...tdStyle,
                    color: user.status === "Active" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {user.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {expandedUserId && (
        <div style={{ marginTop: 30, maxWidth: 800 }}>
          <h2 style={{ marginBottom: 12 }}>
            Detectors for {users.find((u) => u.id === expandedUserId)?.name || "User"}
          </h2>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Detector ID</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Status Level</th>
                <th style={thStyle}>Logs</th>
              </tr>
            </thead>
            <tbody>
              {users
                .find((u) => u.id === expandedUserId)
                ?.detectors.map((det) => (
                  <tr key={det.id}>
                    <td style={tdStyle}>{det.id}</td>
                    <td style={tdStyle}>{det.location}</td>
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: "bold",
                        color:
                          det.status === "Safe"
                            ? "green"
                            : det.status === "Warning"
                            ? "orange"
                            : "red",
                      }}
                    >
                      {det.status}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => showLogs(det.id)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: "#3b82f6",
                        }}
                      >
                        View Logs
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedDetectorLogs && (
        <div
          style={modalBackdropStyle}
          onClick={() => setSelectedDetectorLogs(null)}
        >
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3>Logs for Detector {selectedDetectorLogs.detectorId}</h3>
            {selectedDetectorLogs.logs.length === 0 ? (
              <p>No logs found.</p>
            ) : (
              <ul>
                {selectedDetectorLogs.logs.map((log, i) => (
                  <li key={i}>
                    <strong>{log.timestamp}</strong>: {log.event}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: 20,
};

const thStyle = {
  padding: 12,
  background: "#f3f4f6",
  borderBottom: "2px solid #e5e7eb",
  textAlign: "left",
};

const tdStyle = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};

const inputStyle = {
  padding: 8,
  border: "1px solid #ccc",
  borderRadius: 4,
  flex: 1,
};

const selectStyle = {
  padding: 8,
  border: "1px solid #ccc",
  borderRadius: 4,
};

const buttonStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: 4,
  color: "white",
  cursor: "pointer",
};

const linkButtonStyle = {
  background: "none",
  border: "none",
  color: "#3b82f6",
  textDecoration: "underline",
  cursor: "pointer",
};

const titleStyle = {
  fontSize: "24px",
  marginBottom: 20,
};

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalContentStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  maxWidth: 400,
  width: "90%",
};
