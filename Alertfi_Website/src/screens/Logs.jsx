// src/pages/Logs.jsx
import { useState, useMemo, useEffect } from "react";

const API_BASE = "https://alertfi.onrender.com/";

const STATUS_COLORS = {
  safe: "green",
  warning: "orange",
  danger: "red",
};

const STATUS_FILTERS = ["All", "Safe", "Warning", "Danger"];

export default function Logs() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [detectors, setDetectors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch detectors and logs from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const [detectorsRes, logsRes] = await Promise.all([
        fetch(`${API_BASE}api/admin/detectors/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}api/admin/readings/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const detectorsData = await detectorsRes.json();
      const logsData = await logsRes.json();

      const logsWithDetectors = logsData.map((log) => {
        const detector = detectorsData.find((d) => d.id === log.detector);
        return {
          ...log,
          detectorName: detector ? detector.name : "Unknown",
          detectorLocation: detector ? detector.location : "",
          detectorId: detector ? detector.id : "Unknown", 
        };
      });

      setDetectors(detectorsData);
      setLogs(logsWithDetectors);
    } catch (err) {
      console.error("Error fetching logs or detectors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").replace(/_/g, "");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesStatus =
        selectedStatus === "All" ||
        normalize(log.status) === normalize(selectedStatus);

      const matchesSearch =
        log.detectorName.toLowerCase().includes(search.toLowerCase()) ||
        log.detectorLocation.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [logs, selectedStatus, search]);

  // CSV Export
  const exportCSV = () => {
    const header = ["Detector ID", "Detector", "Location", "Timestamp", "Status Level", "PPM", "Temperature", "Humidity"];
    const rows = filteredLogs.map((log) => [
      log.detectorId,
      log.detectorName,
      log.detectorLocation,
      new Date(log.timestamp).toLocaleString(),
      log.status,
      log.ppm,
      log.temperature,
      log.humidity,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs_${selectedStatus}_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={titleStyle}>📜 Detection Logs</h1>

      <div style={filtersContainerStyle}>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={selectStyle}
        >
          {STATUS_FILTERS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search logs by detector or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <button onClick={exportCSV} style={buttonStyle}>
          Export CSV
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading logs...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Detector ID</th>
              <th style={thStyle}>Detector</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Timestamp</th>
              <th style={thStyle}>Status Level</th>
              <th style={thStyle}>PPM</th>
              <th style={thStyle}>Temperature (°C)</th>
              <th style={thStyle}>Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 20 }}>
                  No logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const color = STATUS_COLORS[normalize(log.status)] || "black";
                return (
                  <tr key={log.id}>
                    <td style={tdStyle}>{log.detectorId}</td>
                    <td style={tdStyle}>{log.detectorName}</td>
                    <td style={tdStyle}>{log.detectorLocation}</td>
                    <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ ...tdStyle, color, fontWeight: "bold" }}>
                      {log.status}
                    </td>
                    <td style={tdStyle}>{log.ppm}</td>
                    <td style={tdStyle}>{log.temperature}</td>
                    <td style={tdStyle}>{log.humidity}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const titleStyle = { fontSize: 28, fontWeight: "bold", marginBottom: 20 };
const filtersContainerStyle = { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" };
const inputStyle = { flex: "1 1 250px", padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" };
const selectStyle = { padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc", minWidth: 180, cursor: "pointer" };
const buttonStyle = { padding: "10px 16px", fontSize: 16, backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer" };
const tableStyle = { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" };
const thStyle = { padding: 12, backgroundColor: "#f3f4f6", textAlign: "left", fontSize: 15, fontWeight: "bold", borderBottom: "1px solid #e5e7eb" };
const tdStyle = { padding: 12, borderBottom: "1px solid #f0f0f0", fontSize: 14 };
