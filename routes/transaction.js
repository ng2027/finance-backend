const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getSpecificTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

// GET Routes
router.get("/", getTransactions);
router.get("/:transactionID", getSpecificTransaction);

// POST Routes
router.post("/", createTransaction);

//PATCH Routes
router.patch("/:transactionID", updateTransaction);

//DELETE Routes
router.delete("/:transactionID", deleteTransaction);

module.exports = router;
