const Category = require("../models/categoryModel");

const getCategory = async (req, res) => {
  try {
    const category = await Category.find().exec();
    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getCategory };
