const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { uploadCSV } = require("../controllers/upload.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/csv", auth, upload.single("file"), uploadCSV);

module.exports = router;
