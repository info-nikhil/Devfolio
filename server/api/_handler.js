const connectDB = require("../src/config/db");
const app = require("../src/app");

const healthPaths = new Set(["/", "/api", "/api/", "/health", "/health/", "/api/health", "/api/health/"]);

function shouldSkipDatabase(req) {
  if (req.method === "OPTIONS") {
    return true;
  }

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

    const requestOrigin = req.headers?.origin;
    if (requestOrigin) {
      res.setHeader("Access-Control-Allow-Origin", requestOrigin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Vary", "Origin");
    }

    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(
      JSON.stringify({
        message: error.message || "Internal server error"
      })
    );
  }
};
