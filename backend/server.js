const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const analyzeRoute = require("./routes/analyze");
const enhanceRoute = require("./routes/enhance");
const statsRoutes = require("./routes/stats");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/analyze", analyzeRoute);
app.use("/api/enhance", enhanceRoute);
app.use("/api/stats", statsRoutes);

module.exports = app;
