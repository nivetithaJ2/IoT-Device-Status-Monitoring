
import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    deviceId: "",
    deviceName: "",
    location: ""
  });

  const fetchData = async () => {
    try {
      const [deviceResponse, alertResponse] = await Promise.all([
        api.get("/devices"),
        api.get("/alerts")
      ]);

      setDevices(deviceResponse.data);
      setAlerts(alertResponse.data);
      setError("");
    } catch (err) {
      setError("Unable to connect to backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const registerDevice = async (e) => {
    e.preventDefault();

    try {
      await api.post("/devices/register", form);

      alert("Device registered successfully!");

      setForm({
        deviceId: "",
        deviceName: "",
        location: ""
      });

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const sendSensorData = async (deviceId) => {
    try {
      await api.post(`/devices/${deviceId}/message`, {
        temperature: 28.5,
        humidity: 65
      });

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Sensor message failed");
      fetchData();
    }
  };

  const simulateFailure = async (deviceId) => {
    try {
      await api.post(`/devices/${deviceId}/failure`, {});
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failure simulation unsuccessful");
    }
  };

  const deleteDevice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this device?")) {
      return;
    }

    try {
      await api.delete(`/devices/${id}`);
      fetchData();
    } catch (err) {
      alert("Unable to delete device");
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      fetchData();
    } catch (err) {
      alert("Unable to update alert");
    }
  };

  const activeCount = devices.filter(
    (d) => d.status === "Active"
  ).length;

  const disconnectedCount = devices.filter(
    (d) => d.status === "Disconnected"
  ).length;

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">⌘</div>
          <div>
            <h2>IoT Monitor</h2>
            <p>Smart Monitoring</p>
          </div>
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-link active">
            <span>▦</span> Dashboard
          </a>

          <a href="#devices" className="nav-link">
            <span>▣</span> Devices
          </a>

          <a href="#register" className="nav-link">
            <span>＋</span> Add Device
          </a>

          <a href="#alerts" className="nav-link">
            <span>♢</span> Alerts
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="online-dot"></span>
            <div>
              <strong>System Status</strong>
              <p>Monitoring Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP HEADER */}
        <header className="topbar">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Monitor and manage your IoT devices</p>
          </div>

          <div className="topbar-actions">
            <span className="live-badge">
              <span className="online-dot"></span>
              Live Monitoring
            </span>

            <button className="refresh-btn" onClick={fetchData}>
              ↻ Refresh
            </button>
          </div>
        </header>

        {error && <div className="error">{error}</div>}

        {/* DASHBOARD */}
        <section id="dashboard">

          <div className="welcome-section">
            <div>
              <h2>Welcome to IoT Monitor</h2>
              <p>Here is your device monitoring summary.</p>
            </div>
            <span className="welcome-icon">📡</span>
          </div>

          {/* STATISTICS */}
          <div className="stats-grid">

            <div className="stat-card blue-card">
              <div className="stat-top">
                <span>Total Devices</span>
                <span className="stat-icon">▣</span>
              </div>
              <h2>{devices.length}</h2>
              <p>Registered devices</p>
            </div>

            <div className="stat-card green-card">
              <div className="stat-top">
                <span>Active Devices</span>
                <span className="stat-icon">✓</span>
              </div>
              <h2>{activeCount}</h2>
              <p>Currently active</p>
            </div>

            <div className="stat-card orange-card">
              <div className="stat-top">
                <span>Disconnected</span>
                <span className="stat-icon">⚠</span>
              </div>
              <h2>{disconnectedCount}</h2>
              <p>Connection issues</p>
            </div>

            <div className="stat-card red-card">
              <div className="stat-top">
                <span>Total Alerts</span>
                <span className="stat-icon">♢</span>
              </div>
              <h2>{alerts.length}</h2>
              <p>Generated alerts</p>
            </div>

          </div>
        </section>

        {/* REGISTER DEVICE */}
        <section className="content-panel" id="register">
          <div className="section-heading">
            <div>
              <h2>Register New Device</h2>
              <p>Add a new IoT device to your monitoring system.</p>
            </div>
            <span className="heading-icon">＋</span>
          </div>

          <form onSubmit={registerDevice} className="register-form">

            <input
              type="text"
              placeholder="Device ID"
              value={form.deviceId}
              onChange={(e) =>
                setForm({ ...form, deviceId: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Device Name"
              value={form.deviceName}
              onChange={(e) =>
                setForm({ ...form, deviceName: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              required
            />

            <button type="submit">+ Register Device</button>
          </form>
        </section>

        {/* DEVICES */}
        <section className="content-panel" id="devices">

          <div className="section-heading">
            <div>
              <h2>Connected Devices</h2>
              <p>View and manage your registered devices.</p>
            </div>
            <span className="device-count">{devices.length} Devices</span>
          </div>

          {loading ? (
            <p className="empty-message">Loading devices...</p>
          ) : devices.length === 0 ? (
            <p className="empty-message">No devices registered yet.</p>
          ) : (

            <div className="device-grid">

              {devices.map((device) => (
                <div className="device-card" key={device._id}>

                  <div className="device-heading">
                    <div className="device-symbol">📡</div>

                    <span className={`status ${(device.status || "unknown").toLowerCase()}`}>
                      {device.status}
                    </span>
                  </div>

                  <h3>{device.deviceName}</h3>

                  <p className="device-id">ID: {device.deviceId}</p>
                  <p className="device-location">📍 {device.location}</p>

                  <div className="sensor-details">
                    <div>
                      <span>🌡 Temperature</span>
                      <strong>{device.temperature ?? "--"} °C</strong>
                    </div>

                    <div>
                      <span>💧 Humidity</span>
                      <strong>{device.humidity ?? "--"} %</strong>
                    </div>
                  </div>

                  <p className="failed-attempts">
                    Failed Attempts: {device.failedAttempts}
                  </p>

                  <div className="actions">
                    <button
                      onClick={() => sendSensorData(device.deviceId)}
                    >
                      Send Data
                    </button>

                    <button
                      className="failure-btn"
                      onClick={() => simulateFailure(device.deviceId)}
                    >
                      Simulate Failure
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteDevice(device._id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}

            </div>
          )}
        </section>

        {/* ALERTS */}
        <section className="content-panel" id="alerts">

          <div className="section-heading">
            <div>
              <h2>Recent Alerts</h2>
              <p>Monitor device communication and sensor alerts.</p>
            </div>
            <span className="device-count">{alerts.length} Alerts</span>
          </div>

          {alerts.length === 0 ? (
            <p className="empty-message">No alerts available.</p>
          ) : (

            <div className="alerts-list">

              {alerts.map((alert) => (
                <div className="alert-card" key={alert._id}>

                  <div className="alert-symbol">⚠</div>

                  <div className="alert-content">
                    <h3>{alert.type}</h3>
                    <p>{alert.message}</p>

                    <span>
                      Severity: {alert.severity} | Device: {alert.deviceId}
                    </span>
                  </div>

                  {!alert.isRead ? (
                    <button onClick={() => markRead(alert._id)}>
                      Mark Read
                    </button>
                  ) : (
                    <span className="read-status">✓ Read</span>
                  )}

                </div>
              ))}

            </div>
          )}
        </section>

        <footer className="footer">
          IoT Device Status Monitoring System | Live Dashboard
        </footer>

      </main>
    </div>
  );
}

export default App;