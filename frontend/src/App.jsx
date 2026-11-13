
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

  // Fetch devices and alerts from backend
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
      setError("Cannot connect to backend. Check your server.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically refresh dashboard every 5 seconds
  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Register device
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

  // Send sensor data
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

  // Simulate communication failure
  const simulateFailure = async (deviceId) => {
    try {
      await api.post(`/devices/${deviceId}/failure`, {});
      fetchData();
    } catch (err) {
      alert("Failure simulation unsuccessful");
    }
  };

  // Delete device
  const deleteDevice = async (id) => {
    if (!window.confirm("Delete this device?")) return;

    try {
      await api.delete(`/devices/${id}`);
      fetchData();
    } catch (err) {
      alert("Unable to delete device");
    }
  };

  // Mark alert as read
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
    <div className="app">
      <header className="header">
        <div>
          <h1>IoT Monitor</h1>
          <p>Device Status Monitoring System</p>
        </div>

        <span className="live-badge">● Live Monitoring</span>
      </header>

      <main className="container">
        {error && <div className="error">{error}</div>}

        <h2>Dashboard Overview</h2>

        <section className="stats">
          <div className="stat-card">
            <h3>Total Devices</h3>
            <p>{devices.length}</p>
          </div>

          <div className="stat-card">
            <h3>Active Devices</h3>
            <p>{activeCount}</p>
          </div>

          <div className="stat-card">
            <h3>Disconnected</h3>
            <p>{disconnectedCount}</p>
          </div>

          <div className="stat-card">
            <h3>Total Alerts</h3>
            <p>{alerts.length}</p>
          </div>
        </section>

        <section className="panel">
          <h2>Register New Device</h2>

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

            <button type="submit">Register Device</button>
          </form>
        </section>

        <section className="panel">
          <h2>Connected Devices</h2>

          {loading ? (
            <p>Loading devices...</p>
          ) : devices.length === 0 ? (
            <p>No devices registered yet.</p>
          ) : (
            <div className="device-grid">
              {devices.map((device) => (
                <div className="device-card" key={device._id}>
                  <div className="device-heading">
                    <h3>{device.deviceName}</h3>

                    <span className={`status ${device.status.toLowerCase()}`}>
                      {device.status}
                    </span>
                  </div>

                  <p><strong>ID:</strong> {device.deviceId}</p>
                  <p><strong>Location:</strong> {device.location}</p>
                  <p><strong>Temperature:</strong> {device.temperature ?? "--"} °C</p>
                  <p><strong>Humidity:</strong> {device.humidity ?? "--"} %</p>
                  <p><strong>Failed Attempts:</strong> {device.failedAttempts}</p>

                  <div className="actions">
                    <button onClick={() => sendSensorData(device.deviceId)}>
                      Send Sensor Data
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

        <section className="panel">
          <h2>Recent Alerts</h2>

          {alerts.length === 0 ? (
            <p>No alerts available.</p>
          ) : (
            alerts.map((alert) => (
              <div className="alert-card" key={alert._id}>
                <div>
                  <h3>{alert.type}</h3>
                  <p>{alert.message}</p>
                  <span>
                    Severity: {alert.severity} | Device: {alert.deviceId}
                  </span>
                </div>

                {!alert.isRead && (
                  <button onClick={() => markRead(alert._id)}>
                    Mark Read
                  </button>
                )}

                {alert.isRead && <span>Read ✓</span>}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;