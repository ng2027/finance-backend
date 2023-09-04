const Tab = require("../../models/tabModel");

async function createTabJob({
  person,
  amount,
  description,
  contact,
  is_borrowed,
  category,
  user_id,
}) {
  try {
    const newTab = new Tab({
      person,
      amount,
      description,
      contact,
      is_borrowed,
      category,
      user_id,
    });

    await newTab.save();
    return {
      response: {
        msg: `Successfully created tab with ${person}`,
        tab: newTab,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { createTabJob };
