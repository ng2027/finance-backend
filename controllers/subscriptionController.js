const Subscription = require("../models/subscriptionModel");
const {
  createSubscriptionJob,
  updateSubscriptionJob,
  deleteSubscriptionJob,
  closeSubscriptionJob,
} = require("../services/subscription/exportSubscriptionService");
const createSubscription = async (req, res) => {
  const { name, amount, transaction_is_spending, category, date } = req.body;
  if (
    !name ||
    !date ||
    !amount ||
    transaction_is_spending == null ||
    transaction_is_spending == undefined ||
    !category
  ) {
    res.status(400).json({ error: "Missing field(s)" });
    return;
  }

  const { response, status } = await createSubscriptionJob({
    ...req.body,
    user_id: req.user._id,
  });
  res.status(status).json(response);
};

const updateSubscription = async (req, res) => {
  const { subscriptionID } = req.params;
  var subscription = await Subscription.exists(subscriptionID, req, res);
  if (!subscription) return;
  const { response, status } = await updateSubscriptionJob(
    req.body,
    subscriptionID
  );
  res.status(status).json(response);
};

const deleteSubscription = async (req, res) => {
  const { subscriptionID } = req.params;
  var subscription = await Subscription.exists(subscriptionID, req, res);
  if (!subscription) return;
  const { response, status } = await deleteSubscriptionJob(subscriptionID);
  res.status(status).json(response);
};

const getSpecificSubscription = async (req, res) => {
  const { subscriptionID } = req.params;
  var subscription = await Subscription.exists(subscriptionID, req, res);
  if (!subscription) return;
  res.status(200).json({ subscription });
};

const getSubscriptions = async (req, res) => {
  const { filter = "all", limit = 10, offset = 0 } = req.query;
  try {
    const unfilteredSubscriptions = await Subscription.find(
      filter == "all" || filter == ""
        ? { user_id: req.user._id }
        : {
            category: filter,
            user_id: req.user._id,
          }
    )
      .sort({ date: -1 })
      .exec();
    const subscriptions = unfilteredSubscriptions.slice(offset, offset + limit);

    res.json({ subscriptions, countTotal: unfilteredSubscriptions.length });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const closeSubscription = async (req, res) => {
  const { add } = req.body;
  if (add == undefined || add == null) {
    res.status(400).json({ error: "Missing field" });
    return;
  }
  const { subscriptionID } = req.params;
  var subscription = await Subscription.exists(subscriptionID, req, res);
  if (!subscription) return;
  const { response, status } = await closeSubscriptionJob(subscriptionID, add);
  res.status(status).json(response);
};

const getUpcomingSubscription = async (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const { limit = 15, offset = 0 } = req.query;
  const unfilteredSubscriptions = await Subscription.find({
    user_id: req.user._id,

    $or: [
      { last_year: currentYear, last_month: { $lt: currentMonth } },
      { last_year: { $lt: currentYear } },
    ],
    $nor: [
      {
        last_year: currentYear,
        last_month: currentMonth - 1,
        date: { $gte: new Date().getDate() },
      },
    ],
  });
  const upcoming = unfilteredSubscriptions.slice(offset, offset + limit);

  res.json({ upcoming, countTotal: unfilteredSubscriptions.length });
};

module.exports = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSpecificSubscription,
  getSubscriptions,
  closeSubscription,
  getUpcomingSubscription,
};
