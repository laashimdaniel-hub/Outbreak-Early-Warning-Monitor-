const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../config/db");
const { validateRow } = require("../utils/csvValidator");

exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const rows = [];
  const validationErrors = [];

  let rowNumber = 1;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      const errors = validateRow(row, rowNumber);
      if (errors.length > 0) {
        validationErrors.push(...errors);
      } else {
        rows.push(row);
      }
      rowNumber++;
    })
    .on("end", async () => {
      // If validation failed, stop here
      if (validationErrors.length > 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          message: "CSV validation failed",
          errors: validationErrors
        });
      }

      try {
        for (let row of rows) {
          await pool.query(
            `INSERT INTO raw_reports (zone_id, date, reports, latitude, longitude)
             VALUES ($1,$2,$3,$4,$5)
             ON CONFLICT (zone_id, date) DO NOTHING`,
            [
              row.zone_id,
              row.date,
              Number(row.reports),
              Number(row.latitude),
              Number(row.longitude)
            ]
          );
        }

        fs.unlinkSync(req.file.path);

        res.json({
          message: "Dataset uploaded successfully",
          recordsInserted: rows.length
        });
      } catch (err) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: err.message });
      }
    });
};
