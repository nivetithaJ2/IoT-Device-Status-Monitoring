
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const deviceRoutes = require("./routes/deviceRoutes");
const alertRoutes = require("./routes/alertRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

// API health check
app.get("/", (req, res) => {
  res.json({
    message: "IoT Device Status Monitoring API is running",
    status: "Online"
  });
});

// API routes
app.use("/api/devices", deviceRoutes);
app.use("/api/alerts", alertRoutes);

// Handle invalid API routes
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found"
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`IoT Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
