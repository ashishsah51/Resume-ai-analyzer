const router = require("express").Router();
const { admin, db } = require("../firebaseAdmin");

const counterDoc = db.collection("analytics").doc("globalCounters");

// Initialize counters
counterDoc.get().then(doc => {
  if (!doc.exists) {
    counterDoc.set({
      buildResumeCount: 0,
      enhanceResumeCount: 0,
      resumeAnalyzerCount: 0,
      resumeVsJobDAnalyzerCount: 0,
      visitCount: 0
    });
  }
});

// Public: increment visitCount
router.post("/increment/visit", async (_req, res) => {
  try {
    await counterDoc.update({ visitCount: admin.firestore.FieldValue.increment(1) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected: Build Resume
router.post("/increment/build", async (_req, res) => {
  try {
    await counterDoc.update({ buildResumeCount: admin.firestore.FieldValue.increment(1) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected: Enhance Resume
router.post("/increment/enhance", async (_req, res) => {
  try {
    await counterDoc.update({ enhanceResumeCount: admin.firestore.FieldValue.increment(1) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected: Analyze Resume
router.post("/increment/analyze", async (_req, res) => {
  try {
    await counterDoc.update({ resumeAnalyzerCount: admin.firestore.FieldValue.increment(1) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all counters
router.get("/", async (_req, res) => {
  try {
    const doc = await counterDoc.get();
    res.json(doc.data());
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;