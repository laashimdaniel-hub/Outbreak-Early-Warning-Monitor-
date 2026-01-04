const pool = require("../config/db");

exports.calculateBaselines = async () => {
  // Get all distinct zones
  const zonesResult = await pool.query(
    "SELECT DISTINCT zone_id FROM raw_reports"
  );

  for (const row of zonesResult.rows) {
    const zoneId = row.zone_id;

    // Get last 14 days of data for the zone
    const dataResult = await pool.query(
      `SELECT observed
       FROM raw_reports
       WHERE zone_id = $1
       ORDER BY date DESC
       LIMIT 14`,
      [zoneId]
    );

    const counts = dataResult.rows.map(r => r.observed);

    if (counts.length === 0) continue;

    const mean =
      counts.reduce((sum, v) => sum + v, 0) / counts.length;

    const variance =
      counts.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
      counts.length;

    const std = Math.sqrt(variance);

    // Insert or update baseline
    await pool.query(
      `INSERT INTO baselines (zone_id, mean, std, calculated_on)
       VALUES ($1,$2,$3,CURRENT_DATE)
       ON CONFLICT (zone_id)
       DO UPDATE SET
         mean = EXCLUDED.mean,
         std = EXCLUDED.std,
         calculated_on = CURRENT_DATE`,
      [zoneId, mean, std]
    );
  }
};
