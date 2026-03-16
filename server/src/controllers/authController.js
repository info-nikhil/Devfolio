const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const OtpCode = require("../models/OtpCode");
const generateToken = require("../utils/generateToken");
const { generateOtp, getOtpExpiry } = require("../utils/otp");
const { sendOtpEmail } = require("../services/emailService");
const slugify = require("../utils/slugify");

async function createUniqueUsername(baseValue) {
  const base = slugify(baseValue) || `user${Date.now()}`;
  let candidate = base;
  let counter = 1;

  // Keep trying until we get a unique username.
  while (await User.findOne({ username: candidate })) {
    candidate = `${base}${counter}`;
    counter += 1;
  }

  return candidate;
}

async function createAndSendOtp({ email, name, purpose }) {
  await OtpCode.deleteMany({ email, purpose });

  const otp = generateOtp();
  await OtpCode.create({
    email,
    purpose,
    code: otp,
    expiresAt: getOtpExpiry(10)
  });

  return sendOtpEmail({ email, name, otp, purpose });
}

async function register(req, res) {
  try {
    const { name, email, password, userType } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        return res.status(409).json({
          message: "This email is registered but not verified yet. Please verify or resend OTP.",
          requiresVerification: true,
          email: existingUser.email
        });
      }

      return res.status(409).json({ message: "Email already registered" });
    }

    const username = await createUniqueUsername(email.split("@")[0]);
    const user = await User.create({
      name,
      username,
      email: email.toLowerCase(),
      password,
      userType: userType === "student" ? "student" : "professional",
      role: "user",
      isEmailVerified: false
    });

    try {
      await createAndSendOtp({
        email: user.email,
        name: user.name,
        purpose: "email_verification"
      });
    } catch (error) {
      return res.status(502).json({
        message: `Account created, but verification email could not be sent. ${error.message}`,
        requiresVerification: true,
        email: user.email
      });
    }

    return res.status(201).json({
      message: "Registration successful. Please verify your email with OTP.",
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await OtpCode.findOne({
      email: email.toLowerCase(),
      purpose: "email_verification",
      code: otp
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isEmailVerified = true;
    await user.save();

    await OtpCode.deleteMany({ email: user.email, purpose: "email_verification" });

    const token = generateToken(user);
    return res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function resendVerificationOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    await createAndSendOtp({
      email: user.email,
      name: user.name,
      purpose: "email_verification"
    });

    return res.status(200).json({ message: "Verification OTP sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before login",
        requiresVerification: true,
        email: user.email
      });
    }

    const token = generateToken(user);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      await createAndSendOtp({
        email: user.email,
        name: user.name,
        purpose: "password_reset"
      });
    }

    return res.status(200).json({
      message: "If this email is registered, an OTP has been sent"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    const otpRecord = await OtpCode.findOne({
      email: email.toLowerCase(),
      purpose: "password_reset",
      code: otp
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    await OtpCode.deleteMany({ email: user.email, purpose: "password_reset" });
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "GOOGLE_CLIENT_ID is not configured" });
    }

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Google account email not available" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const username = await createUniqueUsername(payload.name || email.split("@")[0]);
      user = await User.create({
        name: payload.name || "Google User",
        username,
        email,
        googleId: payload.sub,
        avatarUrl: payload.picture || "",
        role: "user",
        isEmailVerified: true
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      user.isEmailVerified = true;
      if (!user.avatarUrl && payload.picture) {
        user.avatarUrl = payload.picture;
      }
      await user.save();
    }

    const token = generateToken(user);
    return res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    return res.status(401).json({ message: "Google authentication failed" });
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({ user: req.user });
}

module.exports = {
  register,
  verifyEmail,
  resendVerificationOtp,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
  getCurrentUser
};
