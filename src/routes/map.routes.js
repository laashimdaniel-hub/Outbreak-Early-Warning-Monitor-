const express = require("express");
const router = express.Router();
const { getAlertLocations } = require("../controllers/map.controller");
const auth = require("../middlewares/auth.middleware");

const pool = require("../config/db");
// Active alert locations for map
router.get("/locations", auth, getAlertLocations);


// All alerts (history) with geo info
router.get("/all", auth, async (req, res) => {
  const result = await pool.query(
    `SELECT a.id, a.zone_id, a.date, a.severity, a.observed,
            r.latitude, r.longitude
     FROM alerts a
     JOIN raw_reports r
     ON a.zone_id = r.zone_id AND a.date = r.date
     ORDER BY a.date DESC`
  );
  res.json(result.rows);
});


module.exports = router;
