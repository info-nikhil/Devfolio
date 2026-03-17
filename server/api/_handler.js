const connectDB = require("../src/config/db");
const app = require("../src/app");

const healthPaths = new Set(["/", "/api", "/api/", "/health", "/health/", "/api/health", "/api/health/"]);

function shouldSkipDatabase(req) {
  const requestPath = (req.url || "").split("?")[0];
  return healthPaths.has(requestPath);
}

module.exports = async (req, res) => {
  try {
    if (!shouldSkipDatabase(req)) {
      await connectDB();
    }

    return app(req, res);
  } catch (error) {
    console.error("Serverless handler error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};
