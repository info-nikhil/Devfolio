const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/analytics", authMiddleware, roleMiddleware("admin"), adminController.getAnalytics);

module.exports = router;
