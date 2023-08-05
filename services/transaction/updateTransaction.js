const Transaction = require("../../models/transactionModel");

async function updateTransactionJob(
  { name, amount, description, transaction_is_spending, category, date },
  transactionID
) {
  try {
    const remainBody = {
      name,
      amount,
      description,
      transaction_is_spending,
      category,
    };
    const updateDbRequest = date
      ? { ...remainBody, date: Date.now() }
      : { ...remainBody };
    const updateResult = await Transaction.findOneAndUpdate(
      { _id: transactionID },
      updateDbRequest,
      { new: true }
    );
    return {
      response: {
        msg: `Successfully updated transaction: ${transactionID}`,
        transaction: updateResult,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error }, status: 400 };
  }
}

module.exports = { updateTransactionJob };
