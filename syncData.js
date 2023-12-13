// syncData.js
import mongoose from "mongoose";
import Stripe from "stripe";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
import Subscription from "./backend/models/subscriptionModel.js";
// const Subscription = require("./backend/models/subscriptionModel"); // Adjust the path based on your actual file structure

const syncData = async () => {
  try {
    // Fetch data from Stripe API (adjust this based on your data structure)
    const stripeSubscriptions = await stripe.subscriptions.list();

    // Process and save data to MongoDB
    await Promise.all(
      stripeSubscriptions.data.map(async (stripeSubscription) => {
        const userId = getUserFromStripeSubscription(stripeSubscription); // Implement this function
        const subscriptionData = mapStripeSubscriptionToModel(
          stripeSubscription,
          userId
        );

        // Check if subscription exists and update or create accordingly
        await Subscription.findOneAndUpdate(
          { id: subscriptionData.id },
          subscriptionData,
          {
            upsert: true,
            new: true,
          }
        );
      })
    );

    console.log("Data sync completed!");
  } catch (error) {
    console.error("Error syncing data:", error);
  }
};

// Schedule the data sync every day at midnight (adjust the schedule as needed)
cron.schedule("0 0 * * *", () => {
  syncData();
});

// Function to extract user ID from a Stripe subscription (customize based on your data structure)
const getUserFromStripeSubscription = (stripeSubscription) => {
  // Implement logic to extract user ID from the Stripe subscription
  // Example: return stripeSubscription.customer;
  return "";
};

// Function to map Stripe subscription data to your MongoDB model (customize based on your data structure)
const mapStripeSubscriptionToModel = (stripeSubscription, userId) => {
  return {
    id: stripeSubscription.id,
    timestamp: stripeSubscription.created,
    currency: stripeSubscription.currency,
    subscriptionDuration: {
      currentPeriodStart: stripeSubscription.current_period_start,
      currentPeriodEnd: stripeSubscription.current_period_end,
    },
    status: stripeSubscription.status,
    priceInformation: {
      priceId: stripeSubscription.items.data[0].price.id,
      productId: stripeSubscription.items.data[0].price.product,
      recurringInterval:
        stripeSubscription.items.data[0].price.recurring.interval,
      unitAmount: stripeSubscription.items.data[0].price.unit_amount,
    },
    trialInformation: {
      status: stripeSubscription.trial_status,
      startTimestamp: stripeSubscription.trial_start,
      endTimestamp: stripeSubscription.trial_end,
      settings: {
        endBehavior: {
          missingPaymentMethod: stripeSubscription.trial_end_behavior,
        },
      },
    },
    userId: userId,
    customerId: stripeSubscription.customer,
  };
};
