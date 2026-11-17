const express = require("express");
const {
  getMonthlySummary,
  getCategorySummary
} = require("../controllers/reportController");

const router = express.Router();

router.get("/monthly", getMonthlySummary);
router.get("/categories", getCategorySummary);

module.exports = router;
