const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const deployController = require("../controllers/deployController");

const router = express.Router();

router.post("/", authMiddleware, deployController.deployPortfolio);

module.exports = router;
