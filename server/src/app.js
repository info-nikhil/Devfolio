const dotenv = require("dotenv");
const net = require("node:net");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const deployRoutes = require("./routes/deployRoutes");
const healthRoutes = require("./routes/healthRoutes");
const configRoutes = require("./routes/configRoutes");
const paymentController = require("./controllers/paymentController");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const apiRouter = express.Router();

function resolveTrustProxySetting() {
  const configuredValue = process.env.TRUST_PROXY?.trim();

  if (!configuredValue) {
    return process.env.VERCEL || process.env.NODE_ENV === "production" ? 1 : false;
  }

  const normalizedValue = configuredValue.toLowerCase();
  if (normalizedValue === "false" || normalizedValue === "0") {
    return false;
  }

  if (normalizedValue === "true") {
    return 1;
  }

  const numericValue = Number(configuredValue);
  if (Number.isInteger(numericValue) && numericValue >= 0) {
    return numericValue;
  }

  return configuredValue;
}

function normalizeIpAddress(value) {
  if (typeof value !== "string") {
    return "";
  }

  const candidate = value.split(",")[0].trim();
  if (!candidate) {
    return "";
  }

  if (net.isIP(candidate)) {
    return candidate;
  }

  const mappedAddress = candidate.replace(/^::ffff:/, "");
  if (net.isIP(mappedAddress)) {
    return mappedAddress;
  }

  const bracketedAddressMatch = candidate.match(/^\[([^[\]]+)\](?::\d+)?$/);
  if (bracketedAddressMatch && net.isIP(bracketedAddressMatch[1])) {
    return bracketedAddressMatch[1];
  }

  const ipv4WithPortMatch = candidate.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (ipv4WithPortMatch && net.isIP(ipv4WithPortMatch[1])) {
    return ipv4WithPortMatch[1];
  }

  return "";
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const candidates = [
    req.ip,
    Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor,
    Array.isArray(realIp) ? realIp[0] : realIp,
    req.socket?.remoteAddress,
    req.connection?.remoteAddress
  ];

  for (const candidate of candidates) {
    const normalizedIp = normalizeIpAddress(candidate);
    if (normalizedIp) {
      return normalizedIp;
    }
  }

  return "";
}

app.set("trust proxy", resolveTrustProxySetting());

function normalizeOrigin(value) {
  return typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
}

function getConfiguredFrontendOrigins() {
  const configuredOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  if (configuredOrigins.length > 0) {
    return configuredOrigins;
  }

  if (process.env.NODE_ENV !== "production") {
    return ["http://localhost:5173"];
  }

  return [];
}

const allowedOrigins = getConfiguredFrontendOrigins();

function getRequestOrigin(req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol =
    (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto)?.split(",")[0].trim() ||
    req.protocol ||
    "https";
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) || req.headers.host;

  if (!host) {
    return "";
  }

  return normalizeOrigin(`${protocol}://${host}`);
}

function isAllowedOrigin(origin, req) {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    return true;
  }

  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  if (normalizedOrigin === getRequestOrigin(req)) {
    return true;
  }

  return false;
}

function handleCors(req, res, next) {
  const requestOrigin = req.headers.origin;

  if (!requestOrigin) {
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    return next();
  }

  if (!isAllowedOrigin(requestOrigin, req)) {
    console.warn(`Blocked CORS origin: ${requestOrigin}`);
    return res.status(403).json({ message: "Origin not allowed" });
  }

  res.header("Access-Control-Allow-Origin", requestOrigin);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, false);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    ip: false
  },
  keyGenerator(req) {
    const clientIp = getClientIp(req);
    if (clientIp) {
      return clientIp;
    }

    const userAgent = req.get("user-agent") || "unknown-agent";
    return `anonymous:${req.method}:${req.originalUrl || req.url}:${userAgent}`;
  }
});

app.use(handleCors);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(limiter);

// Razorpay signature validation requires the raw request body.
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);
app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(mongoSanitize());
app.use(xssClean());

apiRouter.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Portfolio Builder API",
    timestamp: new Date().toISOString()
  });
});

apiRouter.use("/config", configRoutes);
apiRouter.use("/health", healthRoutes);
apiRouter.use("/config", configRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/portfolios", portfolioRoutes);
apiRouter.use("/subscriptions", subscriptionRoutes);
apiRouter.use("/payments", paymentRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/contact", contactRoutes);
apiRouter.use("/deploy", deployRoutes);

app.use("/api", apiRouter);
app.use("/", apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
