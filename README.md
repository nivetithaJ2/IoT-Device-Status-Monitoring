https://iot-device-status-monitoring.vercel.app/

# IoT Device Status Monitoring System

**A Full-Stack Web Application for Monitoring IoT Device Connectivity and Sensor Data**

## About the Project

The IoT Device Status Monitoring System is a web-based application designed to monitor the connectivity and status of simulated IoT devices.

It allows users to register devices, monitor temperature and humidity values, detect communication failures, and generate alerts for invalid sensor data and disconnected devices.

The project uses a Finite State Machine (FSM) to manage device status transitions.

## Problem Statement

Monitoring multiple IoT devices and identifying communication failures can be challenging. Devices may become disconnected or send invalid sensor data.

This project provides a centralized dashboard to monitor devices, validate sensor messages, detect connection failures, and generate alerts.

## Objectives

- Register and manage IoT devices.
- Monitor temperature and humidity sensor values.
- Validate incoming sensor data.
- Detect communication failures.
- Generate alerts for invalid messages.
- Manage device states using a Finite State Machine.
- Store device and alert information in MongoDB Atlas.
- Display device information through a web dashboard.

## Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Frontend build tool |
| HTML, CSS, JavaScript | User interface |
| Node.js | Backend runtime |
| Express.js | REST API development |
| Axios | HTTP communication |
| MongoDB Atlas | Cloud database |
| Mongoose | Database management |
| EventEmitter | Event handling |
| GitHub | Source code management |
| Render | Backend deployment |
| Vercel | Frontend deployment |

## System Architecture

```text
          USER
            |
            v
      REACT FRONTEND
         (Vercel)
            |
        HTTP Requests
            |
            v
     NODE.JS + EXPRESS
         (Render)
            |
      +-----+------+
      |            |
      v            v
  STATE MACHINE  EVENT MONITOR
      |            |
      +-----+------+
            |
            v
       MONGODB ATLAS
            |
      +-----+------+
      |            |
      v            v
 DEVICE DATA    ALERT DATA
```

## Main Features

### 1. Device Registration
- Register devices using Device ID, Device Name, and Location.
- Prevent duplicate device IDs.

### 2. Sensor Data Monitoring
- Receive temperature and humidity values.
- Display the latest sensor readings.
- Refresh dashboard data automatically every five seconds.

### 3. Sensor Data Validation
- Temperature range: -50°C to 150°C.
- Humidity range: 0% to 100%.
- Invalid messages generate alerts.

### 4. Device Status Management

The system uses three states:

- **Registered:** Device is newly registered.
- **Active:** Device successfully sends valid sensor data.
- **Disconnected:** Device reaches three simulated communication failures.

### 5. Communication Failure Simulation
- Simulate device communication failures.
- Increase the failure counter.
- Change device status to Disconnected after three failures.
- Generate a Critical alert.

### 6. Automatic Recovery
- Send valid sensor data again.
- Change the device status back to Active.
- Reset the failure counter.

### 7. Alert Management
- Display invalid-message alerts.
- Display connection-failure alerts.
- Mark alerts as read.

## Finite State Machine

```text
 REGISTERED
     |
     | Valid Message
     v
   ACTIVE
     |
     | 3 Failures
     v
 DISCONNECTED
     |
     | Valid Message
     v
   ACTIVE
```

## API Endpoints

Base URL: `/api`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/devices/register` | Register device |
| GET | `/devices` | Get all devices |
| POST | `/devices/:deviceId/message` | Send sensor data |
| POST | `/devices/:deviceId/failure` | Simulate failure |
| DELETE | `/devices/:id` | Delete device |
| GET | `/alerts` | Get all alerts |
| PATCH | `/alerts/:id/read` | Mark alert as read |
| DELETE | `/alerts/:id` | Delete alert |

## Database Collections

**Devices**
- Device ID
- Device Name
- Location
- Status
- Temperature
- Humidity
- Failed Attempts
- Last Seen

**Alerts**
- Device ID
- Alert Type
- Message
- Severity
- Read Status

## Project Workflow

1. Register an IoT device.
2. Device receives the Registered status.
3. Send simulated sensor data through an HTTP request.
4. Backend validates the received values.
5. Valid data changes the device status to Active.
6. Invalid data generates an alert.
7. Simulate communication failures.
8. After three failures, the device becomes Disconnected.
9. Send valid data again to recover the device.
10. View updated device status and alerts on the dashboard.

## Live Application

**Frontend:** https://iot-device-status-monitoring.vercel.app/

**GitHub Repository:** https://github.com/nivetithaJ2/IoT-Device-Status-Monitoring

**Backend:** Deployed on Render.

**Database:** MongoDB Atlas.

## Future Enhancements

- Integrate real IoT devices using ESP32 or Arduino.
- Add more sensors.
- Display sensor data using graphical charts.
- Add user authentication.
- Implement email and SMS notifications.
- Add automatic device heartbeat monitoring.

## Conclusion

The IoT Device Status Monitoring System provides a centralized platform to monitor simulated IoT devices, validate sensor data, detect communication failures, manage device states, and generate alerts.

This project demonstrates the practical application of Full Stack Web Development, Computer Networks, and Formal Languages and Automata Theory concepts.
