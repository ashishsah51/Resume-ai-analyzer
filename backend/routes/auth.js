// backend/routes/auth.js
const router = require("express").Router();
const { admin } = require("../firebaseAdmin");
const { verifyToken } = require("../middleware/verifyToken");

// ✅ Create user manually (rarely used, mostly frontend handles signup)
router.post("/signup", async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password, displayName });
    res.json({ uid: user.uid, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Protected route example
router.get("/me", verifyToken, async (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email });
});

module.exports = router;