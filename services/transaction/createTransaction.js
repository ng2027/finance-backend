const Transaction = require("../../models/transactionModel");

async function createTransactionJob(
  { name, amount, description, transaction_is_spending, category, user_id },
  date = null
) {
  try {
    var newTransaction;
    if (!date) {
      newTransaction = new Transaction({
        name,
        amount,
        description,
        transaction_is_spending,
        category,
        user_id,
      });
    } else {
      newTransaction = new Transaction({
        name,
        amount,
        description,
        transaction_is_spending,
        category,
        user_id,
        date,
      });
    }

    await newTransaction.save();
    return {
      response: {
        msg: `Successfully created transaction: ${name}`,
        transaction: newTransaction,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { createTransactionJob };
