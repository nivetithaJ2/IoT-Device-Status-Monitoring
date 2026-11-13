
const EventEmitter = require("events");
const Device = require("../models/Device");
const Alert = require("../models/Alert");
const getNextState = require("./deviceStateMachine");

const eventMonitor = new EventEmitter();

// Handle valid sensor messages
eventMonitor.on("messageReceived", async (deviceId, done) => {
  try {
    const device = await Device.findById(deviceId);

    if (!device) {
      throw new Error("Device not found");
    }

    device.status = getNextState(
      device.status,
      "MESSAGE_RECEIVED"
    );

    device.failedAttempts = 0;
    device.lastSeen = new Date();

    await device.save();

    console.log(`${device.deviceId} is now Active`);
    done();
  } catch (error) {
    done(error);
  }
});

// Handle simulated communication failures
eventMonitor.on("connectionFailure", async (deviceId, done) => {
  try {
    const device = await Device.findById(deviceId);

    if (!device) {
      throw new Error("Device not found");
    }

    device.failedAttempts += 1;

    if (device.failedAttempts >= 3) {
      device.status = getNextState(
        device.status,
        "FAILURE_LIMIT_REACHED"
      );
    }

    await device.save();

    // Create a critical alert on the third failure
    if (device.failedAttempts === 3) {
      await Alert.create({
        deviceId: device.deviceId,
        type: "Connection Failure",
        message: `Device ${device.deviceId} disconnected after 3 failures`,
        severity: "Critical"
      });
    }

    console.log(
      `${device.deviceId}: Failure ${device.failedAttempts}, Status: ${device.status}`
    );

    done();
  } catch (error) {
    done(error);
  }
});

// Wait until the event handler finishes
function emitAndWait(eventName, deviceId) {
  return new Promise((resolve, reject) => {
    eventMonitor.emit(eventName, deviceId, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

eventMonitor.recordMessage = (deviceId) =>
  emitAndWait("messageReceived", deviceId);

eventMonitor.recordFailure = (deviceId) =>
  emitAndWait("connectionFailure", deviceId);

module.exports = eventMonitor;
