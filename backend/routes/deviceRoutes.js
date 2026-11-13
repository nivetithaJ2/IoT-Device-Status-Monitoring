
const express = require("express");
const router = express.Router();

const Device = require("../models/Device");
const Alert = require("../models/Alert");
const eventMonitor = require("../services/eventMonitor");

// Register a new IoT device
router.post("/register", async (req, res) => {
  try {
    const { deviceId, deviceName, location } = req.body;

    if (!deviceId || !deviceName || !location) {
      return res.status(400).json({
        message: "Please provide device ID, name and location"
      });
    }

    const device = await Device.create({
      deviceId,
      deviceName,
      location
    });

    res.status(201).json({
      message: "Device registered successfully",
      device
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Device ID already exists"
      });
    }

    res.status(500).json({ message: error.message });
  }
});

// Get all devices
router.get("/", async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Receive and validate sensor messages
router.post("/:deviceId/message", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { temperature, humidity } = req.body;

    const device = await Device.findOne({ deviceId });

    if (!device) {
      await Alert.create({
        deviceId,
        type: "Invalid Message",
        message: `Message received from unknown device ${deviceId}`,
        severity: "High"
      });

      return res.status(404).json({
        message: "Device not registered. Alert generated."
      });
    }

    const validTemperature =
      typeof temperature === "number" &&
      Number.isFinite(temperature) &&
      temperature >= -50 &&
      temperature <= 150;

    const validHumidity =
      typeof humidity === "number" &&
      Number.isFinite(humidity) &&
      humidity >= 0 &&
      humidity <= 100;

    if (!validTemperature || !validHumidity) {
      await Alert.create({
        deviceId,
        type: "Invalid Message",
        message: "Invalid temperature or humidity values received",
        severity: "High"
      });

      return res.status(400).json({
        message: "Invalid sensor data. Alert generated."
      });
    }

    device.temperature = temperature;
    device.humidity = humidity;
    await device.save();

    await eventMonitor.recordMessage(device._id);

    const updatedDevice = await Device.findById(device._id);

    res.json({
      message: "Sensor message received successfully",
      device: updatedDevice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Simulate a communication failure
router.post("/:deviceId/failure", async (req, res) => {
  try {
    const device = await Device.findOne({
      deviceId: req.params.deviceId
    });

    if (!device) {
      return res.status(404).json({
        message: "Device not found"
      });
    }

    await eventMonitor.recordFailure(device._id);

    const updatedDevice = await Device.findById(device._id);

    res.json({
      message: "Communication failure simulated",
      device: updatedDevice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a device
router.delete("/:id", async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({
        message: "Device not found"
      });
    }

    res.json({ message: "Device deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
