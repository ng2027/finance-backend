const Tab = require("../../models/tabModel");
const { createTransactionJob } = require("../transaction/createTransaction");

async function deleteTabJob(tabID, addTransaction) {
  try {
    const tab = await Tab.findById(tabID);
    await Tab.deleteOne({ _id: tabID });

    var transaction;
    if (addTransaction) {
      const currentDate = new Date();
      transaction = await createTransactionJob(
        {
          name: tab.person + " Tab Payment",
          amount: tab.amount,
          description: `Tab Transaction: ${tab.person} (${tab.contact}), Description: ${tab.description} `,
          transaction_is_spending: tab.is_borrowed,
          category: tab.category,
          user_id: tab.user_id,
        },
        currentDate
      );
      transaction = transaction.response.transaction;
    }
    return {
      response: {
        msg: `Successfully deleted tab: ${tabID}`,
        transaction,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { deleteTabJob };
