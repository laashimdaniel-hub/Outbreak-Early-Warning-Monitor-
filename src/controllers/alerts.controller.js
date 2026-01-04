const pool = require("../config/db");

// Get active alerts
exports.getActiveAlerts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM alerts
       WHERE status='ACTIVE'
       ORDER BY date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get alert history (all alerts)
exports.getAlertHistory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM alerts
       ORDER BY date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update alert status (dismiss or resolve)
exports.updateAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status } = req.body;

    if (!['ACTIVE','DISMISSED','RESOLVED'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await pool.query(
      `UPDATE alerts SET status=$1 WHERE id=$2`,
      [status, alertId]
    );

    res.json({ message: `Alert ${alertId} status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
