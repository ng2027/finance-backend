const Subscription = require("../../models/subscriptionModel");

async function updateSubscriptionJob(
  { name, amount, description, transaction_is_spending, category, date },
  subscriptionID
) {
  try {
    const remainBody = {
      name,
      amount,
      description,
      transaction_is_spending,
      category,
      date,
    };
    const updateResult = await Subscription.findOneAndUpdate(
      { _id: subscriptionID },
      remainBody,
      { new: true }
    );
    return {
      response: {
        msg: `Successfully updated subscription: ${subscriptionID}`,
        subscription: updateResult,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { updateSubscriptionJob };
