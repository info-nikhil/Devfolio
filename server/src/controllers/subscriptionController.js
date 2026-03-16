const Subscription = require("../models/Subscription");
const PLANS = require("../config/plans");
const { createRazorpayOrder } = require("../services/razorpayService");

function getPlanOrNull(planKey) {
  return PLANS[planKey] || null;
}

function buildSubscriptionEndDate(durationInDays) {
  return new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000);
}

async function getPlans(req, res) {
  return res.status(200).json({ plans: Object.values(PLANS) });
}

async function getMySubscription(req, res) {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ subscriptions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createOrder(req, res) {
  try {
    const { plan } = req.body;
    const selectedPlan = getPlanOrNull(plan);
    if (!selectedPlan) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    if (selectedPlan.amount === 0) {
      const subscription = await Subscription.create({
        user: req.user._id,
        plan: selectedPlan.key,
        status: "active",
        amount: 0,
        currency: selectedPlan.currency,
        startsAt: new Date(),
        endsAt: buildSubscriptionEndDate(selectedPlan.durationInDays)
      });

      return res.status(200).json({
        message: "Free plan activated",
        subscription
      });
    }

    const receipt = `sub_${req.user._id}_${Date.now()}`;
    const order = await createRazorpayOrder({
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      receipt,
      notes: {
        userId: req.user._id.toString(),
        plan: selectedPlan.key
      }
    });

    const subscription = await Subscription.create({
      user: req.user._id,
      plan: selectedPlan.key,
      status: "pending",
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      razorpayOrderId: order.id,
      startsAt: new Date(),
      endsAt: buildSubscriptionEndDate(selectedPlan.durationInDays)
    });

    return res.status(200).json({
      message: "Order created",
      order,
      subscription,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function confirmPaymentClient(req, res) {
  try {
    const { subscriptionId, razorpayPaymentId } = req.body;
    if (!subscriptionId || !razorpayPaymentId) {
      return res.status(400).json({ message: "subscriptionId and razorpayPaymentId are required" });
    }

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.razorpayPaymentId = razorpayPaymentId;
    await subscription.save();

    return res.status(200).json({
      message: "Payment details received. Subscription will activate after webhook verification."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getPlans,
  getMySubscription,
  createOrder,
  confirmPaymentClient
};
