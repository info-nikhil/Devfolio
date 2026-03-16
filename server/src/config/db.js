const mongoose = require("mongoose");

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoURI);
  console.log("MongoDB connected");
}

module.exports = connectDB;
