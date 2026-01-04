const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth.routes");
// Middlewares
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
  ],
  credentials: true
}));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "OEWM Backend is running" });
});


app.use("/api/auth", authRoutes);
const authMiddleware = require("./middlewares/auth.middleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});
const reportRoutes = require("./routes/reports.routes");

app.use("/api/reports", reportRoutes);

const baselineRoutes = require("./routes/baseline.routes");

app.use("/api/baselines", baselineRoutes);

const anomalyRoutes = require("./routes/anomaly.routes");

app.use("/api/anomalies", anomalyRoutes);

const alertsRoutes = require("./routes/alerts.routes");

app.use("/api/alerts", alertsRoutes);

const mapRoutes = require("./routes/map.routes");

app.use("/api/map", mapRoutes);



module.exports = app;



//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkYW5pZWxAb2V3bS5jb20iLCJpYXQiOjE3NjczNTE1MDYsImV4cCI6MTc2NzQzNzkwNn0.B5eMFPoT43HzcI1b_hymWkK4jeBAWIvCEcXZuBr9McA