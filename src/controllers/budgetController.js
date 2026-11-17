const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");

const validatePeriod = (year, month) => {
  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (
    !Number.isInteger(parsedYear) ||
    parsedYear < 2000 ||
    parsedYear > 2100 ||
    !Number.isInteger(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    return null;
  }

  return { year: parsedYear, month: parsedMonth };
};

const setBudget = asyncHandler(async (req, res) => {
  const period = validatePeriod(req.params.year, req.params.month);
  const amount = Number(req.body.amount);

  if (!period) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid year and month"
    });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Budget amount must be greater than zero"
    });
  }

  const budget = await Budget.findOneAndUpdate(
    period,
    { amount },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    success: true,
    message: "Monthly budget saved successfully",
    data: budget
  });
});

const getBudgetStatus = asyncHandler(async (req, res) => {
  const period = validatePeriod(req.params.year, req.params.month);

  if (!period) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid year and month"
    });
  }

  const budget = await Budget.findOne(period);

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: "No budget has been set for this month"
    });
  }

  const start = new Date(period.year, period.month - 1, 1);
  const end = new Date(period.year, period.month, 1);

  const result = await Expense.aggregate([
    { $match: { date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" }
      }
    }
  ]);

  const totalSpent = result.length ? result[0].totalSpent : 0;
  const remaining = budget.amount - totalSpent;

  res.status(200).json({
    success: true,
    data: {
      year: period.year,
      month: period.month,
      budget: budget.amount,
      totalSpent,
      remaining: Math.max(remaining, 0),
      exceeded: totalSpent > budget.amount,
      alert: totalSpent > budget.amount
        ? "Monthly budget exceeded"
        : "Spending is within the monthly budget"
    }
  });
});

module.exports = {
  setBudget,
  getBudgetStatus
};
