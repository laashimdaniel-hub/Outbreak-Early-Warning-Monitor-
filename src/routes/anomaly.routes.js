const express = require("express");
const router = express.Router();
const { runAnomalyDetection } = require("../controllers/anomaly.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/detect", auth, runAnomalyDetection);

module.exports = router;
