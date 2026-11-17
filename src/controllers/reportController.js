const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");
const buildDateRange = require("../utils/dateRange");

const getMonthlySummary = asyncHandler(async (req, res) => {
  const year = Number(req.query.year || new Date().getFullYear());

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return res.status(400).json({
      success: false,
      message: "year must be a valid year between 2000 and 2100"
    });
  }

  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const summary = await Expense.aggregate([
    { $match: { date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { $month: "$date" },
        totalAmount: { $sum: "$amount" },
        expenseCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalAmount: 1,
        expenseCount: 1
      }
    }
  ]);

  const months = Array.from({ length: 12 }, (_, index) => {
    const found = summary.find((item) => item.month === index + 1);
    return found || {
      month: index + 1,
      totalAmount: 0,
      expenseCount: 0
    };
  });

  const grandTotal = months.reduce((sum, item) => sum + item.totalAmount, 0);

  res.status(200).json({
    success: true,
    year,
    grandTotal,
    data: months
  });
});

const getCategorySummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = {};
  const dateRange = buildDateRange(startDate, endDate);

  if (dateRange) {
    match.date = dateRange;
  }

  const summary = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
        expenseCount: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalAmount: 1,
        expenseCount: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: summary
  });
});

module.exports = {
  getMonthlySummary,
  getCategorySummary
};
