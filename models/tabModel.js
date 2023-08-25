const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tabSchema = new Schema({
  person: {
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
  contact: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  is_borrowed: {
    type: Boolean,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

tabSchema.statics.exists = async function (id, req, res) {
  try {
    const tabExist = await this.findOne({
      _id: id,
      user_id: req.user._id,
    });
    if (!tabExist) {
      res.status(404).json({ error: "Tab does not exist." });
      return false;
    }
    return tabExist;
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ error: "Tab does not exist." });
    } else {
      res.status(400).json({ error: error.message });
    }
    return false;
  }
};

module.exports = mongoose.model("Tab", tabSchema);
