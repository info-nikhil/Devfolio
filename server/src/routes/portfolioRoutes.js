const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const portfolioController = require("../controllers/portfolioController");

const router = express.Router();

router.get("/public/:username", portfolioController.getPublicPortfolioByUsername);
router.get("/my", authMiddleware, portfolioController.getMyPortfolios);
router.post("/", authMiddleware, portfolioController.createPortfolio);
router.get("/:id", authMiddleware, portfolioController.getPortfolioById);
router.put("/:id", authMiddleware, portfolioController.updatePortfolio);
router.delete("/:id", authMiddleware, portfolioController.deletePortfolio);

module.exports = router;
