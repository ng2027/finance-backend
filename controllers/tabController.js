const Tab = require("../models/tabModel");
const {
  createTabJob,
  updateTabJob,
  deleteTabJob,
} = require("../services/tab/exportTabService");
const createTab = async (req, res) => {
  const { person, amount, is_borrowed, category, contact } = req.body;
  if (
    !person ||
    !amount ||
    is_borrowed == null ||
    is_borrowed == undefined ||
    !category ||
    !contact
  ) {
    res.status(400).json({ error: "Missing field(s)" });
    return;
  }
  const { response, status } = await createTabJob({
    ...req.body,
    user_id: req.user._id,
  });
  res.status(status).json(response);
};

const getSpecificTab = async (req, res) => {
  const { tabID } = req.params;
  var tab = await Tab.exists(tabID, req, res);
  if (!tab) return;
  res.status(200).json({ tab });
};

const updateTab = async (req, res) => {
  const { tabID } = req.params;
  var tab = await Tab.exists(tabID, req, res);
  if (!tab) return;
  const { response, status } = await updateTabJob(req.body, tabID);
  res.status(status).json(response);
};

const deleteTab = async (req, res) => {
  const { tabID } = req.params;
  const { add = false } = req.query;
  var tab = await Tab.exists(tabID, req, res);
  if (!tab) return;
  const { response, status } = await deleteTabJob(tabID, add);
  res.status(status).json(response);
};

const getTabs = async (req, res) => {
  const { borrowed, limit = 30, offset = 0 } = req.query;
  if (borrowed == null || borrowed == undefined) {
    res.status(400).json({ error: "Missing field" });
    return;
  }
  try {
    const unfilteredTabs = await Tab.find({
      user_id: req.user._id,
      is_borrowed: borrowed,
    }).exec();
    const tabs = unfilteredTabs.slice(offset, offset + limit);

    res.json({ tabs, countTotal: unfilteredTabs.length });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createTab, getSpecificTab, updateTab, deleteTab, getTabs };
