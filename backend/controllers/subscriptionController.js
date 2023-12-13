import asyncHandler from "express-async-handler";
import Subscription from "../models/subscriptionModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { stripe } from "../config/db.js";
const createSubscription = asyncHandler(async (req, res) => {
  const priceId = req.body.plan.id;
  const userId = req.user._id;
  console.log(req.body.plan.id);
  try {
    // Ensure that req.user has the expected structure with _id
    if (!req.user || !req.user._id) {
      res.status(404);
      throw new Error("User not found");
    }

    // Retrieve the user from the User model using the ID
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const stripeSubscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId, // Use stripeCustomerId from user data
      items: [{ price: priceId }],
    });

    const subscription = new Subscription({
      subscriptionId: stripeSubscription.id,
      trialStartDate: new Date(stripeSubscription.trial_start * 1000),
      trialEndDate: new Date(stripeSubscription.trial_end * 1000),
      currentPeriodStart: new Date(
        stripeSubscription.current_period_start * 1000
      ),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      currency: stripeSubscription.currency,
      price: stripeSubscription.items.data[0].price.unit_amount / 100, // Convert from cents to dollars
      customerInformation: stripeSubscription.customer,
      status: stripeSubscription.status,
      userId: user._id, // Use user._id for user ID
    });

    await subscription.save();

    res.status(201).json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const getSubscriptionById = asyncHandler(async (req, res) => {
  const subscriptionId = req.params.id;

  try {
    // Retrieve the subscription from stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      res.status(404);
      throw new Error("Subscription not found");
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error getting subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const updateSubscription = asyncHandler(async (req, res) => {
  const subscriptionId = req.params.id;
  const { metadata } = req.body;

  try {
    // Retrieve the subscription from MongoDB
    const subscription = await Subscription.findOne({
      subscriptionId,
    });

    if (!subscription) {
      res.status(404);
      throw new Error("Subscription not found");
    }

    // Update the subscription using Stripe API
    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        metadata,
      }
    );

    // Update the subscription in MongoDB
    subscription.metadata = updatedStripeSubscription.metadata;
    await subscription.save();

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const cancelSubscription = asyncHandler(async (req, res) => {
  const subscriptionId = req.params.id;

  try {
    // Retrieve the subscription from MongoDB
    const subscription = await Subscription.findOne({
      subscriptionId: subscriptionId,
    });

    if (!subscription) {
      res.status(404);
      throw new Error("Subscription not found");
    }

    // Cancel the subscription using Stripe API
    const canceledStripeSubscription = await stripe.subscriptions.cancel(
      subscriptionId
    );

    // Remove the subscription from MongoDB
    await Subscription.findOneAndDelete({ subscriptionId: subscriptionId });

    res.status(200).json(canceledStripeSubscription);
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const listSubscriptions = asyncHandler(async (req, res) => {
  try {
    // Retrieve all subscriptions from MongoDB
    const subscriptions = await stripe.subscriptions.list({});
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export {
  createSubscription,
  getSubscriptionById,
  updateSubscription,
  cancelSubscription,
  listSubscriptions,
};
