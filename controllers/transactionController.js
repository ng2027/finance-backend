const Transaction = require("../models/transactionModel");
const {
  createTransactionJob,
  updateTransactionJob,
  deleteTransactionJob,
} = require("../services/transaction/exportTransactionService");

const createTransaction = async (req, res) => {
  const { name, amount, transaction_is_spending, category } = req.body;
  if (
    !name ||
    !amount ||
    transaction_is_spending == null ||
    transaction_is_spending == undefined ||
    !category
  ) {
    res.status(400).json({ error: "Missing field(s)" });
    return;
  }

  const { response, status } = await createTransactionJob({
    ...req.body,
    user_id: req.user._id,
  });
  res.status(status).json(response);
};

const getSpecificTransaction = async (req, res) => {
  const { transactionID } = req.params;
  var transaction = await Transaction.exists(transactionID, req, res);
  if (!transaction) return;
  res.status(200).json({ transaction });
};

const updateTransaction = async (req, res) => {
  const { transactionID } = req.params;
  var transaction = await Transaction.exists(transactionID, req, res);
  if (!transaction) return;
  const { response, status } = await updateTransactionJob(
    req.body,
    transactionID
  );
  res.status(status).json(response);
};

const deleteTransaction = async (req, res) => {
  const { transactionID } = req.params;
  var transaction = await Transaction.exists(transactionID, req, res);
  if (!transaction) return;
  const { response, status } = await deleteTransactionJob(transactionID);
  res.status(status).json(response);
};

const getTransactions = async (req, res) => {
  const { filter = "all", limit = 10, offset = 0 } = req.query;
  try {
    const unfilteredTransactions = await Transaction.find(
      filter == "all" || filter == ""
        ? { user_id: req.user._id }
        : {
            category: filter,
            user_id: req.user._id,
          }
    )
      .sort({ date: -1 })
      .exec();
    const transactions = unfilteredTransactions.slice(offset, offset + limit);

    res.json({ transactions, countTotal: unfilteredTransactions.length });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getSpecificTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
};
