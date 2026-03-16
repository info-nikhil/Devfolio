const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    plan: {
      type: String,
      enum: ["free", "student", "professional"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      default: "pending"
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    razorpayOrderId: {
      type: String,
      default: ""
    },
    razorpayPaymentId: {
      type: String,
      default: ""
    },
    startsAt: {
      type: Date,
      default: Date.now
    },
    endsAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
