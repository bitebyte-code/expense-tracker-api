const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 60
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: ""
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now
    }
  },
  { timestamps: true }
);

expenseSchema.index({ category: 1, date: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
