const { calculateBaselines } = require("../services/baseline.service");

exports.runBaselineCalculation = async (req, res) => {
  try {
    await calculateBaselines();
    res.json({ message: "Baselines calculated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
