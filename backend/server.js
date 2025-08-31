const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: ["http://localhost:8080","https://resume-ai-analyzer-omega.vercel.app/"]
}));
app.use(express.json());

// Example routes
app.use("/api/analyze", require("./routes/analyze"));
app.use("/api/enhance", require("./routes/enhanceResume"));
app.use("/api/stats", require("./routes/stats"));

// ✅ Only listen if running locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ✅ Export app (for Vercel)
module.exports = app;
