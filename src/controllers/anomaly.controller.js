const { detectAnomalies } = require("../services/anomaly.service");

exports.runAnomalyDetection = async (req, res) => {
  try {
    await detectAnomalies();
    res.json({ message: "Anomaly detection completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
