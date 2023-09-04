const Subscription = require("../../models/subscriptionModel");
const { createTransactionJob } = require("../transaction/createTransaction");
async function closeSubscriptionJob(subscriptionID, addTransaction) {
  var new_transaction = [];
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const oldResult = await Subscription.findOneAndUpdate(
      { _id: subscriptionID },
      { last_month: currentMonth, last_year: currentYear }
    );
    if (addTransaction) {
      const currentDate = new Date();
      const yearDiff = currentDate.getFullYear() - oldResult.last_year;
      const monthDiff = currentDate.getMonth() - oldResult.last_month;
      const dayDiff = currentDate.getDate() - oldResult.date;
      var totalMonthsDiff = yearDiff * 12 + monthDiff;
      if (dayDiff > 0) {
        totalMonthsDiff++;
      }

      let tempDate = new Date(
        oldResult.last_year,
        oldResult.last_month,
        oldResult.date
      );
      let currentTime = new Date();
      tempDate.setHours(
        currentTime.getHours(),
        currentTime.getMinutes(),
        currentTime.getSeconds(),
        currentTime.getMilliseconds()
      );
      for (let i = 0; i < totalMonthsDiff; i++) {
        const transaction = await createTransactionJob(
          {
            name: oldResult.name + " Subscription Payment",
            amount: oldResult.amount,
            description: `Subscription Transaction: ${oldResult.name}, Description: ${oldResult.description} `,
            transaction_is_spending: oldResult.transaction_is_spending,
            category: oldResult.category,
            user_id: oldResult.user_id,
          },
          new Date(tempDate)
        );
        new_transaction.push(transaction.response.transaction);
        tempDate.setMonth(tempDate.getMonth() + 1);
      }
    }
    return {
      response: {
        msg: `Successfully closed subscription: ${subscriptionID}`,
        new_transaction,
      },
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { response: { error: error.message }, status: 400 };
  }
}

module.exports = { closeSubscriptionJob };
