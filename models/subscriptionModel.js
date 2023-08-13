const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Number,
    required: true,
    min: [1, "Date is too early"],
    max: [28, "Date is too late"],
  },
  transaction_is_spending: {
    type: Boolean,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  last_month: {
    type: Number,
    required: true,
    min: [1, "Month is not possible"],
    max: [12, "Month is not possible"],
    default: Math.min(Math.max(new Date().getMonth() + 1, 1), 12),
  },
  last_year: {
    type: Number,
    required: true,
    default: Math.max(new Date().getFullYear(), 1),
  },
});

subscriptionSchema.statics.exists = async function (id, req, res) {
  try {
    const subscriptionExist = await this.findOne({
      _id: id,
      user_id: req.user._id,
    });
    if (!subscriptionExist) {
      res.status(404).json({ error: "Subscription does not exist." });
      return false;
    }
    return subscriptionExist;
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ error: "Subscription does not exist." });
    } else {
      res.status(400).json({ error: error.message });
    }
    return false;
  }
};

module.exports = mongoose.model("Subscription", subscriptionSchema);
