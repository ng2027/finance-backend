const express = require("express");
const router = express.Router();

const {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSpecificSubscription,
  getSubscriptions,
  closeSubscription,
  getUpcomingSubscription,
} = require("../controllers/subscriptionController");

// GET Routes
router.get("/", getSubscriptions);
router.get("/upcoming", getUpcomingSubscription);
router.get("/:subscriptionID", getSpecificSubscription);

// POST Routes
router.post("/", createSubscription);

//PATCH Routes
router.patch("/:subscriptionID", updateSubscription);
router.patch("/:subscriptionID/close", closeSubscription);

//DELETE Routes
router.delete("/:subscriptionID", deleteSubscription);

module.exports = router;
