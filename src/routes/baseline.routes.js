const express = require("express");
const router = express.Router();
const { runBaselineCalculation } = require("../controllers/baseline.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/calculate", auth, runBaselineCalculation);

module.exports = router;
