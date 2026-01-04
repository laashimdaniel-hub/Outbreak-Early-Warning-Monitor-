// const express = require("express");
// const router = express.Router();
// const { ingestCSV } = require("../controllers/reports.controller");
// const auth = require("../middlewares/auth.middleware");

// router.post("/ingest", auth, ingestCSV);

// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");

const auth = require("../middlewares/auth.middleware");
const reportsController = require("../controllers/reports.controller");

const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  auth,
  upload.single("file"),
  reportsController.uploadCSV   // ✅ now guaranteed to exist
);

module.exports = router;
