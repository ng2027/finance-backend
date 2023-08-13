const Subscription = require("../../models/subscriptionModel");

async function createSubscriptionJob({
  name,
  amount,
  description,
  date,
  transaction_is_spending,
  category,
  user_id,
}) {
  try {
    const newSubscription = new Subscription({
      name,
      amount,
      description,
      transaction_is_spending,
      category,
      date,
      user_id,
    });
    await newSubscription.save();

    return {
      response: {
        msg: `Successfully created subscription: ${name}`,
        transaction: newSubscription,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { createSubscriptionJob };
