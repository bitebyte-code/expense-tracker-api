const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");
const buildDateRange = require("../utils/dateRange");

const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, description, date } = req.body;

  const expense = await Expense.create({
    amount,
    category,
    description,
    date
  });

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: expense
  });
});

const getExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  const dateRange = buildDateRange(startDate, endDate);
  if (dateRange) {
    filter.date = dateRange;
  }

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),
    Expense.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    count: expenses.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
    data: expenses
  });
});

const getExpenseById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid expense ID" });
  }

  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.status(200).json({ success: true, data: expense });
});

const updateExpense = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid expense ID" });
  }

  const allowedFields = ["amount", "category", "description", "date"];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update"
    });
  }

  const expense = await Expense.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: expense
  });
});

const deleteExpense = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid expense ID" });
  }

  const expense = await Expense.findByIdAndDelete(req.params.id);

  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
    data: expense
  });
});

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
