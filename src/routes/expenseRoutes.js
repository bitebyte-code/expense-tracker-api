const express = require("express");
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require("../controllers/expenseController");

const router = express.Router();

router.route("/")
  .post(createExpense)
  .get(getExpenses);

router.route("/:id")
  .get(getExpenseById)
  .patch(updateExpense)
  .delete(deleteExpense);

module.exports = router;
