const buildDateRange = (startDate, endDate) => {
  const range = {};

  if (startDate) {
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) {
      const error = new Error("startDate must be a valid date");
      error.statusCode = 400;
      throw error;
    }
    start.setHours(0, 0, 0, 0);
    range.$gte = start;
  }

  if (endDate) {
    const end = new Date(endDate);
    if (Number.isNaN(end.getTime())) {
      const error = new Error("endDate must be a valid date");
      error.statusCode = 400;
      throw error;
    }
    end.setHours(23, 59, 59, 999);
    range.$lte = end;
  }

  if (range.$gte && range.$lte && range.$gte > range.$lte) {
    const error = new Error("startDate cannot be later than endDate");
    error.statusCode = 400;
    throw error;
  }

  return Object.keys(range).length ? range : null;
};

module.exports = buildDateRange;
