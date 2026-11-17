const express = require("express");
const {
  setBudget,
  getBudgetStatus
} = require("../controllers/budgetController");

const router = express.Router();

router.put("/:year/:month", setBudget);
router.get("/:year/:month/status", getBudgetStatus);

module.exports = router;
