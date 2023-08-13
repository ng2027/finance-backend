const Subscription = require("../../models/subscriptionModel");

async function deleteSubscriptionJob(subscriptionID) {
  try {
    await Subscription.deleteOne({ _id: subscriptionID });
    return {
      response: { msg: `Successfully deleted subscription: ${subscriptionID}` },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { deleteSubscriptionJob };
