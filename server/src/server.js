const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = require("./app");

const port = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});

//hello