exports.validateRow = (row, rowNumber) => {
  const errors = [];

  // zone_id
  if (!row.zone_id || typeof row.zone_id !== "string") {
    errors.push(`Row ${rowNumber}: zone_id is required`);
  }

  // date
  if (!row.date || isNaN(Date.parse(row.date))) {
    errors.push(`Row ${rowNumber}: invalid date`);
  }

  // observed
  const reports = Number(row.reports);
  if (row.observed === undefined || row.observed < 0) {
    errors.push(`Row ${rowNumber}: reports must be a non-negative integer`);
  }

  // latitude
  const lat = Number(row.latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push(`Row ${rowNumber}: invalid latitude`);
  }

  // longitude
  const lng = Number(row.longitude);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    errors.push(`Row ${rowNumber}: invalid longitude`);
  }

  return errors;
};
