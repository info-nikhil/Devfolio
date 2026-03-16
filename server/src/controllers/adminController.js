const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");

async function getAnalytics(req, res) {
  try {
    const [totalUsers, activeSubscriptions, studentUsers, professionalUsers] = await Promise.all([
      User.countDocuments(),
      Subscription.countDocuments({ status: "active", endsAt: { $gte: new Date() } }),
      User.countDocuments({ userType: "student" }),
      User.countDocuments({ userType: "professional" })
    ]);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: "captured" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalRevenue: { $sum: "$amount" },
          paymentCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const planRevenue = await Subscription.aggregate([
      { $match: { status: "active", amount: { $gt: 0 } } },
      {
        $group: {
          _id: "$plan",
          totalAmount: { $sum: "$amount" },
          users: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      stats: {
        totalUsers,
        activeSubscriptions,
        studentUsers,
        professionalUsers
      },
      revenue: {
        monthlyRevenue,
        planRevenue
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAnalytics
};
