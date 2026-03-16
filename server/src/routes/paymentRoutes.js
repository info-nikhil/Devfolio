const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.get("/my", authMiddleware, paymentController.getMyPayments);

module.exports = router;
