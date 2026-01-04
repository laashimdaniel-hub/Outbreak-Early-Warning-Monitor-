const express = require("express");
const router = express.Router();
const {
  getActiveAlerts,
  getAlertHistory,
  updateAlertStatus
} = require("../controllers/alerts.controller");
const auth = require("../middlewares/auth.middleware");

// Active alerts for dashboard
router.get("/active", auth, getActiveAlerts);

// All alerts (history)
router.get("/history", auth, getAlertHistory);

// Update status
router.patch("/update/:alertId", auth, updateAlertStatus);

module.exports = router;
