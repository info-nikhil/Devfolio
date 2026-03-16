const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["captured", "failed", "refunded"],
      required: true
    },
    razorpayOrderId: {
      type: String,
      default: ""
    },
    razorpayPaymentId: {
      type: String,
      default: ""
    },
    razorpaySignature: {
      type: String,
      default: ""
    },
    payload: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
