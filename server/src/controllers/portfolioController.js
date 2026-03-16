const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

function normalizePortfolioBody(body) {
  return {
    title: body.title || "My Portfolio",
    templateId: body.templateId || "template1",
    profile: {
      name: body.profile?.name || "",
      profilePicture: body.profile?.profilePicture || "",
      aboutMe: body.profile?.aboutMe || ""
    },
    skills: Array.isArray(body.skills) ? body.skills : [],
    projects: Array.isArray(body.projects) ? body.projects : [],
    experience: Array.isArray(body.experience) ? body.experience : [],
    education: Array.isArray(body.education) ? body.education : [],
    socialLinks: {
      github: body.socialLinks?.github || "",
      linkedin: body.socialLinks?.linkedin || "",
      twitter: body.socialLinks?.twitter || "",
      website: body.socialLinks?.website || ""
    },
    contactInfo: {
      email: body.contactInfo?.email || "",
      phone: body.contactInfo?.phone || "",
      location: body.contactInfo?.location || ""
    },
    customCode: body.customCode || "",
    isPublished: Boolean(body.isPublished),
    deployUrl: body.deployUrl || ""
  };
}

async function createPortfolio(req, res) {
  try {
    const portfolioData = normalizePortfolioBody(req.body);
    const portfolio = await Portfolio.create({
      ...portfolioData,
      user: req.user._id
    });

    return res.status(201).json({
      message: "Portfolio created",
      portfolio
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getMyPortfolios(req, res) {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json({ portfolios });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getPortfolioById(req, res) {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    if (portfolio.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ portfolio });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updatePortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    if (portfolio.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = normalizePortfolioBody({
      ...portfolio.toObject(),
      ...req.body
    });

    Object.assign(portfolio, updates);
    await portfolio.save();

    return res.status(200).json({ message: "Portfolio updated", portfolio });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deletePortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    if (portfolio.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await portfolio.deleteOne();
    return res.status(200).json({ message: "Portfolio deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getPublicPortfolioByUsername(req, res) {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const portfolio = await Portfolio.findOne({
      user: user._id,
      isPublished: true
    }).sort({ updatedAt: -1 });

    if (!portfolio) {
      return res.status(404).json({ message: "Published portfolio not found" });
    }

    return res.status(200).json({
      username: user.username,
      portfolio
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createPortfolio,
  getMyPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPublicPortfolioByUsername
};
