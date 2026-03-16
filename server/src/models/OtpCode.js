const mongoose = require("mongoose");

const otpCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    purpose: {
      type: String,
      enum: ["email_verification", "password_reset"],
      required: true
    },
    code: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpCode = mongoose.model("OtpCode", otpCodeSchema);

module.exports = OtpCode;
