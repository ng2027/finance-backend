const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
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
    type: Date,
    default: Date.now,
    required: true,
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
});

transactionSchema.statics.exists = async function (id, req, res) {
  try {
    const transactionExist = await this.findOne({
      _id: id,
      user_id: req.user._id,
    });
    if (!transactionExist) {
      res.status(404).json({ error: "Transaction does not exist." });
      return false;
    }
    return transactionExist;
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ error: "Transaction does not exist." });
    } else {
      res.status(400).json({ error });
    }
    return false;
  }
};

module.exports = mongoose.model("Transaction", transactionSchema);
