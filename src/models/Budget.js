const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 2000
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    }
  },
  { timestamps: true }
);

budgetSchema.index({ year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
