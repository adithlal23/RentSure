
require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const connectMongoDB = require("./config/mongo");
const inspectionRoutes = require("./routes/inspectionRoutes");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const leaseRoutes = require("./routes/leaseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const depositRoutes = require("./routes/depositRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/properties", propertyRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leases", leaseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to RentSure Backend API!",
    status: "Server is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "RentSure API is healthy"
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`RentSure server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();

startServer();
