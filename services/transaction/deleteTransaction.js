const Transaction = require("../../models/transactionModel");

async function deleteTransactionJob(transactionID) {
  try {
    await Transaction.deleteOne({ _id: transactionID });
    return {
      response: { msg: `Successfully deleted transaction: ${transactionID}` },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { deleteTransactionJob };
