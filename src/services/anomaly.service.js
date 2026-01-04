const pool = require("../config/db");

exports.detectAnomalies = async () => {
  const result = await pool.query(`
    SELECT r.zone_id, r.observed, r.date,
           b.mean, b.std
    FROM raw_reports r
    JOIN baselines b ON r.zone_id = b.zone_id
    WHERE r.date = (
      SELECT MAX(date)
      FROM raw_reports
      WHERE zone_id = r.zone_id
    )
  `);

  for (const row of result.rows) {
    const { zone_id, observed, mean, std, date } = row;

    if (std === 0) continue;

    const threshold = mean + 2 * std;

    if (observed > threshold) {
      await pool.query(
        `INSERT INTO alerts
         (zone_id, date, observed, threshold, baseline_mean, baseline_std, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        // Added 'std' here at index $6
        [zone_id, date, observed, threshold, mean, std] 
      );
    }
  }
};