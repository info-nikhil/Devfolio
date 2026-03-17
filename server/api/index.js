// const connectDB = require("../src/config/db");
// const app = require("../src/app");

// module.exports = async (req, res) => {
//   await connectDB();
//   return app(req, res);
// };


const connectDB = require("../src/config/db");
const app = require("../src/app");

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};