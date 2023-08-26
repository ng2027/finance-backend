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
  console.log(sum);
  if (sum.length == 0) {
    return 0;
  }
  return sum[0].totalAmount;
}

const getReport = async (req, res) => {
  const { category, month, year } = req.query;
  if (!category || !month || !year) {
    res.status(400).json({ error: "Missing field(s)" });
    return;
  }

  try {
    spendSum = await sum({
      category,
      month,
      year,
      user_id: req.user._id,
      isSpending: true,
    });
    recievedSum = await sum({
      category,
      month,
      year,
      user_id: req.user._id,
      isSpending: false,
    });
    console.log(recievedSum);
    res
      .status(200)
      .json({
        spent: spendSum,
        recieved: recievedSum,
        category,
        month,
        year,
        user_id: req.user._id,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getReport };
