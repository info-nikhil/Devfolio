const dotenv = require("dotenv");
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
const paymentController = require("./controllers/paymentController");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const apiRouter = express.Router();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

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
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xssClean());

apiRouter.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Portfolio Builder API",
    timestamp: new Date().toISOString()
  });
});

apiRouter.use("/health", healthRoutes);
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
