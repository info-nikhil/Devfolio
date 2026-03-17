const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  mongoose.set("strictQuery", true);
  connectionPromise = mongoose
    .connect(mongoURI)
    .then((connection) => {
      console.log("MongoDB connected");
      return connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

module.exports = connectDB;
