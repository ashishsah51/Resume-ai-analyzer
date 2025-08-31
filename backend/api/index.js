const app = require("../server");

// This exposes your Express app as a Vercel serverless function
module.exports = (req, res) => {
  app(req, res);
};
