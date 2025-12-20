// src/pages/Detectors.jsx
import { useState, useMemo, useEffect } from "react";

const API_BASE = "https://alertfi.onrender.com/";

const normalizeStr = (s = "") => String(s ?? "").toLowerCase().trim();
const mapStatus = (raw) => {
  if (raw === undefined || raw === null) return "Unknown";
  const n = normalizeStr(raw);
  if (!n) return "Unknown";
  if (n.includes("danger") || n.includes("fire") || n.includes("risk")) return "Danger";
  if (n.includes("warn")) return "Warning";
  if (n.includes("safe") || n.includes("ok") || n.includes("normal")) return "Safe";
  return String(raw);
};

export default function Detectors() {
  const [detectors, setDetectors] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (!token) throw new Error("No access token found in localStorage");

      const [detRes, userRes] = await Promise.all([
        fetch(`${API_BASE}api/admin/detectors/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}api/admin/users/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const detectorsData = detRes.ok ? await detRes.json() : [];
      const usersData = userRes.ok ? await userRes.json() : [];

      const detectorsWithUser = detectorsData.map((d) => {
        let userLabel = "Unknown";
        const detectorUserId = d.user ?? d.user_id ?? d.owner ?? null;

        if (detectorUserId !== null) {
          const found = usersData.find((u) => {
            if (!isNaN(detectorUserId)) return Number(detectorUserId) === u.id || Number(detectorUserId) === u.pk;
            return u.username === detectorUserId || u.email === detectorUserId || u.full_name === detectorUserId || u.fullname === detectorUserId;
          });
          if (found) userLabel = found.full_name || found.fullname || found.username || found.email || "Unknown";
        }

        const rawStatus =
          d.status ??
          d.status_level ??
          d.current_status ??
          d.last_status ??
          (d.latest_reading && (d.latest_reading.status || d.latest_reading.status_level)) ??
          (d.last_reading && (d.last_reading.status || d.last_reading.status_level)) ??
          (d.latest && (d.latest.status || d.latest.status_level)) ??
          "";
        const status = mapStatus(rawStatus);

        const sensorOn = d.sensor_on ?? false;

        return { ...d, userLabel, status, sensorOn };
      });

      setDetectors(detectorsWithUser);
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching detectors or users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const LOCATIONS = [...new Set(detectors.map((d) => d.location).filter(Boolean))];
  const STATUS_OPTIONS = ["Safe", "Warning", "Danger"];

  const filteredDetectors = useMemo(() => {
    return detectors.filter((det) => {
      const matchesSearch =
        (det.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (det.userLabel || "").toLowerCase().includes(search.toLowerCase());
      const matchesLocation = filterLocation === "" || det.location === filterLocation;
      const matchesStatus = filterStatus === "" || (det.status || "") === filterStatus;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [search, filterLocation, filterStatus, detectors]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={titleStyle}>🛠️ Detector Management</h1>

      <div style={filtersContainerStyle}>
        <input
          type="text"
          placeholder="Search by detector name or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} style={selectStyle}>
          <option value="">All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading detectors...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Sensor</th>
            </tr>
          </thead>
          <tbody>
            {filteredDetectors.length > 0 ? (
              filteredDetectors.map((det) => (
                <tr key={det.id} style={{ backgroundColor: det.status === "Safe" ? "white" : "#ffe6e6" }}>
                  <td style={tdStyle}>{det.id}</td>
                  <td style={tdStyle}>{det.name}</td>
                  <td style={tdStyle}>{det.userLabel}</td>
                  <td style={tdStyle}>{det.location}</td>
                  <td style={{ ...tdStyle, fontWeight: "bold", color: det.status === "Safe" ? "green" : det.status === "Warning" ? "orange" : det.status === "Danger" ? "red" : "black" }}>{det.status}</td>
                  <td style={{ ...tdStyle, fontWeight: "bold", color: det.sensorOn ? "green" : "red" }}>{det.sensorOn ? "ON" : "OFF"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>No detectors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const titleStyle = { fontSize: 28, fontWeight: "bold", marginBottom: 20 };
const filtersContainerStyle = { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" };
const inputStyle = { flex: "1 1 200px", padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" };
const selectStyle = { padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc", minWidth: 140, cursor: "pointer" };
const tableStyle = { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" };
const thStyle = { padding: 12, backgroundColor: "#f3f4f6", textAlign: "left", fontSize: 15, fontWeight: "bold", borderBottom: "1px solid #e5e7eb" };
const tdStyle = { padding: 12, borderBottom: "1px solid #f0f0f0", fontSize: 14 };
