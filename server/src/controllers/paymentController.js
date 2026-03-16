const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const PLANS = require("../config/plans");
const { verifyWebhookSignature } = require("../services/razorpayService");

function calculateEndDate(planKey) {
  const plan = PLANS[planKey];
  const duration = plan?.durationInDays || 30;
  return new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
}

async function handleCapturedPayment(paymentEntity) {
  const orderId = paymentEntity.order_id;
  const existingPayment = await Payment.findOne({
    razorpayPaymentId: paymentEntity.id
  });
  if (existingPayment) {
    return;
  }

  const subscription = await Subscription.findOne({ razorpayOrderId: orderId });
  if (!subscription) {
    return;
  }

  subscription.status = "active";
  subscription.razorpayPaymentId = paymentEntity.id;
  subscription.startsAt = new Date();
  subscription.endsAt = calculateEndDate(subscription.plan);
  await subscription.save();

  await Payment.create({
    user: subscription.user,
    subscription: subscription._id,
    amount: paymentEntity.amount,
    currency: paymentEntity.currency || subscription.currency,
    status: "captured",
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentEntity.id,
    payload: paymentEntity
  });
}

async function handleFailedPayment(paymentEntity) {
  const orderId = paymentEntity.order_id;
  const subscription = await Subscription.findOne({ razorpayOrderId: orderId });
  if (!subscription) {
    return;
  }

  subscription.status = "cancelled";
  subscription.razorpayPaymentId = paymentEntity.id || "";
  await subscription.save();

  await Payment.create({
    user: subscription.user,
    subscription: subscription._id,
    amount: paymentEntity.amount || subscription.amount,
    currency: paymentEntity.currency || subscription.currency,
    status: "failed",
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentEntity.id || "",
    payload: paymentEntity
  });
}

async function handleWebhook(req, res) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.body;
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(rawBody.toString());
    const paymentEntity = event.payload?.payment?.entity;

    if (event.event === "payment.captured" && paymentEntity) {
      await handleCapturedPayment(paymentEntity);
    }

    if (event.event === "payment.failed" && paymentEntity) {
      await handleFailedPayment(paymentEntity);
    }

    return res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getMyPayments(req, res) {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ payments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  handleWebhook,
  getMyPayments
};
