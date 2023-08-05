const Category = require("../models/categoryModel");

const createCategory = async (req, res) => {
  const { name, icon } = req.body;

  if (!name) {
    res.status(400).json({ error: "Missing field - name" });
    return;
  }
  try {
    const newCategory = new Category({ name, icon });
    await newCategory.save();

    res.status(200).json({ msg: `Successfully created category: ${name}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createCategory };
