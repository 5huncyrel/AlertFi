// src/pages/Users.jsx
import { useEffect, useState } from "react";

const API_BASE = "https://alertfi.onrender.com/";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [detectors, setDetectors] = useState({});
  const [searchUser, setSearchUser] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [selectedDetectorLogs, setSelectedDetectorLogs] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all users 
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please log in as admin first.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}api/admin/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  // Expand user → fetch detectors for that user
  const toggleExpandUser = async (userId) => {
    const token = localStorage.getItem("accessToken");

    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);
    setSelectedDetectorLogs(null);

    try {
      const res = await fetch(`${API_BASE}api/admin/detectors/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const userDetectors = data.filter((d) => d.user === userId);

      setDetectors((prev) => ({
        ...prev,
        [userId]: userDetectors,
      }));
    } catch (err) {
      console.error("Error fetching detectors:", err);
    }
  };

  // View logs for a specific detector
  const showLogs = async (detectorId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${API_BASE}api/admin/readings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allLogs = await res.json();
      const detectorLogs = allLogs.filter((log) => log.detector === detectorId);
      setSelectedDetectorLogs({ detectorId, logs: detectorLogs });
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.address?.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (loading) return <p style={{ padding: 20 }}>Loading users...</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={titleStyle}>👥 User Management</h1>

      {/* Search */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 600 }}>
        <input
          type="text"
          placeholder="Search users by name, email, or address..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Users Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>Registered</th>
            <th style={thStyle}>Detectors</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 20, textAlign: "center" }}>
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
                  <button onClick={() => toggleExpandUser(user.id)} style={linkButtonStyle}>
                    {expandedUserId === user.id ? "Hide Detectors" : "View Detectors"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Expanded Detectors */}
      {expandedUserId && detectors[expandedUserId] && (
        <div style={{ marginTop: 30, maxWidth: 800 }}>
          <h2 style={{ marginBottom: 12 }}>
            Detectors for {users.find((u) => u.id === expandedUserId)?.name || "User"}
          </h2>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Detector ID</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {detectors[expandedUserId].map((det) => {
                const statusColor = (() => {
                  const s = (det.status || "").toLowerCase().trim();
                  if (s === "safe") return "green";
                  if (s === "warning") return "orange";
                  if (s === "danger") return "red";
                  return "black";
                })();

                return (
                  <tr key={det.id}>
                    <td style={tdStyle}>{det.id}</td>
                    <td style={tdStyle}>{det.location}</td>
                    <td style={{ ...tdStyle, fontWeight: "bold", color: statusColor }}>
                      {det.status}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => showLogs(det.id)} style={{ ...buttonStyle, backgroundColor: "#3b82f6" }}>
                        View Logs
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Logs Modal */}
      {selectedDetectorLogs && (
        <div style={modalBackdropStyle} onClick={() => setSelectedDetectorLogs(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3>Logs for Detector {selectedDetectorLogs.detectorId}</h3>
            {selectedDetectorLogs.logs.length === 0 ? (
              <p>No logs available.</p>
            ) : (
              <ul>
                {selectedDetectorLogs.logs.map((log, i) => (
                  <li key={i}>
                    <strong>{new Date(log.timestamp).toLocaleString()}:</strong>{" "}
                    Status: {log.status}, PPM: {log.ppm}, Temp: {log.temperature}°C, Humidity: {log.humidity}%
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setSelectedDetectorLogs(null)} style={buttonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: "8px 12px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc", flex: "1 1 250px" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: 8 };
const thStyle = { textAlign: "left", borderBottom: "2px solid #ddd", padding: 8 };
const tdStyle = { padding: 8, borderBottom: "1px solid #eee" };
const buttonStyle = { padding: "6px 12px", fontSize: 14, borderRadius: 4, border: "none", cursor: "pointer", color: "#fff", backgroundColor: "brown" };
const linkButtonStyle = { background: "none", border: "none", color: "#2563eb", textDecoration: "underline", cursor: "pointer", fontSize: 14, padding: 0 };
const titleStyle = { fontSize: 28, marginBottom: 20 };
const modalBackdropStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 };
const modalContentStyle = {
  backgroundColor: "#fff",
  padding: 24,
  borderRadius: 8,
  maxWidth: 500,
  width: "90%",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};
