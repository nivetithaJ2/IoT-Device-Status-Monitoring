
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    deviceName: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["Registered", "Active", "Disconnected"],
      default: "Registered"
    },

    temperature: {
      type: Number,
      default: null
    },

    humidity: {
      type: Number,
      default: null
    },

    failedAttempts: {
      type: Number,
      default: 0
    },

    lastSeen: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
