const pool = require("../config/db");

// Get active alerts with geo info
exports.getAlertLocations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.zone_id, a.date, a.severity, a.observed,
              r.latitude, r.longitude
       FROM alerts a
       JOIN raw_reports r
       ON a.zone_id = r.zone_id AND a.date = r.date
       WHERE a.status='ACTIVE'
       ORDER BY a.date DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
