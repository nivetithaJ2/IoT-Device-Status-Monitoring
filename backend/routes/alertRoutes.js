
const express = require("express");
const router = express.Router();

const Alert = require("../models/Alert");

// Get all alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark an alert as read
router.patch("/:id/read", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      });
    }

    res.json({
      message: "Alert marked as read",
      alert
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an alert
router.delete("/:id", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      });
    }

    res.json({ message: "Alert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
