const Portfolio = require("../models/Portfolio");
const { deployStaticSite } = require("../services/vercelService");

async function deployPortfolio(req, res) {
  try {
    const { portfolioId, htmlCode } = req.body;
    if (!htmlCode) {
      return res.status(400).json({ message: "htmlCode is required" });
    }

    const deployment = await deployStaticSite({
      username: req.user.username,
      htmlContent: htmlCode
    });

    if (portfolioId) {
      const portfolio = await Portfolio.findOne({
        _id: portfolioId,
        user: req.user._id
      });

      if (portfolio) {
        portfolio.deployUrl = deployment.deploymentUrl;
        portfolio.isPublished = true;
        portfolio.customCode = htmlCode;
        await portfolio.save();
      }
    }

    return res.status(200).json({
      message: "Portfolio deployed successfully",
      deployment
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  deployPortfolio
};
