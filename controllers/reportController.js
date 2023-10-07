const Transaction = require("../models/transactionModel");
const mongoose = require("mongoose");
async function sum({ isSpending, category, month, year, user_id }) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);
  const sum = await Transaction.aggregate([
    {
      $match: {
        user_id,
        category: new mongoose.Types.ObjectId(category),
        transaction_is_spending: isSpending,
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]).exec();

  if (sum.length == 0) {
    return 0;
  }
  return sum[0].totalAmount;
}
const getReport = async (req, res) => {
  const { category, month, year, isSpent } = req.query;
  if (!category || !month || !year || isSpent == null || isSpent == undefined) {
    res.status(400).json({ error: "Missing field(s)" });
    return;
  }
  var sumAmount;
  try {
    if (isSpent == "true") {
      sumAmount = await sum({
        category,
        month,
        year,
        user_id: req.user._id,
        isSpending: true,
      });
    } else {
      sumAmount = await sum({
        category,
        month,
        year,
        user_id: req.user._id,
        isSpending: false,
      });
    }
    const body = {
      category,
      month,
      year,
      user_id: req.user._id,
    };

    if (isSpent == "true") {
      res.status(200).json({ ...body, spent: sumAmount.toFixed(3) });
    } else {
      res.status(200).json({
        ...body,
        recieved: sumAmount.toFixed(3),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getReport };
