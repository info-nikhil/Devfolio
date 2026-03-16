const crypto = require("crypto");
const Razorpay = require("razorpay");

let razorpayInstance = null;

function getRazorpayInstance() {
  if (razorpayInstance) {
    return razorpayInstance;
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing");
  }

  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  return razorpayInstance;
}

async function createRazorpayOrder({ amount, currency, receipt, notes }) {
  const razorpay = getRazorpayInstance();
  return razorpay.orders.create({
    amount,
    currency,
    receipt,
    notes
  });
}

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
}

module.exports = {
  createRazorpayOrder,
  verifyWebhookSignature
};
