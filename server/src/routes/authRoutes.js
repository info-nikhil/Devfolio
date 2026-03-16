const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationOtp);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/google", authController.googleLogin);
router.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = router;
