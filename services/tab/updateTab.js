const Tab = require("../../models/tabModel");

async function updateTabJob(
  { person, amount, description, contact, is_borrowed, category },
  tabID
) {
  try {
    const remainBody = {
      person,
      amount,
      description,
      contact,
      is_borrowed,
      category,
    };
    const updateResult = await Tab.findOneAndUpdate(
      { _id: tabID },
      remainBody,
      { new: true }
    );

    return {
      response: {
        msg: `Successfully updated tab: ${tabID}`,
        tab: updateResult,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { updateTabJob };
