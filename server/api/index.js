// const connectDB = require("../src/config/db");
// const app = require("../src/app");

// module.exports = async (req, res) => {
//   await connectDB();
//   return app(req, res);
// };


const serverless = require("serverless-http");
const connectDB = require("../src/config/db");
const app = require("../src/app");

let handler;

module.exports = async (req, res) => {
  if (!handler) {
    await connectDB();
    handler = serverless(app);
  }

  return handler(req, res);
};