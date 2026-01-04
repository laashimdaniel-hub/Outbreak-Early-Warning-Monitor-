// const fs = require("fs");
// const csv = require("csv-parser");
// const pool = require("../config/db");

// exports.ingestCSV = async (req, res) => {
//   const results = [];

//   fs.createReadStream("data/simulated_reports.csv")
//     .pipe(csv())
//     .on("data", (row) => {
//       results.push(row);
//     })
//     .on("end", async () => {
//       try {
//         for (const r of results) {
//           await pool.query(
//             `INSERT INTO raw_reports
//              (date, zone_id, latitude, longitude, report_count, symptom_type)
//              VALUES ($1,$2,$3,$4,$5,$6)`,
//             [
//               r.date,
//               r.zone_id,
//               r.latitude,
//               r.longitude,
//               r.report_count,
//               r.symptom_type
//             ]
//           );
//         }

//         res.json({
//           message: "CSV data ingested successfully",
//           records: results.length
//         });
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     });
// };

const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../config/db");

const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const rows = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      try {
        for (const r of rows) {
          await pool.query(
            `INSERT INTO raw_reports
             (zone_id, date, observed, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              r.zone_id,
              r.date,
              parseInt(r.observed),
              parseFloat(r.latitude),
              parseFloat(r.longitude)
            ]
          );
        }

        res.json({
          message: "CSV uploaded and ingested successfully",
          records: rows.length
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });
};

module.exports = {
  uploadCSV
};
