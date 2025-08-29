const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeResumeWithOpenAI } = require('../services/openaiAnalyzer'); // custom OpenAI logic

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Route: POST /api/analyze
router.post('/', upload.single('resumeFile'), async (req, res) => {
  let filePath;
  try {
    const jdText = req.body.jdText || ''
    const resumeVsJob = req.body.resumeVsJJob === 'true';

    // Validate input
    if (!req.file) {
      return res.status(400).json({ error: 'Missing resume.' });
    }

    // Read uploaded file
    const filePath = path.join(__dirname, '..', req.file.path);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = req.file.originalname;

    // Call OpenAI-based analyzer (abstracted)
    const result = await analyzeResumeWithOpenAI(fileBuffer, fileName, jdText, resumeVsJob);

    // Delete uploaded file after processing
    fs.unlinkSync(filePath);

    // Return structured response
    res.json(result);

  } catch (err) {
    fs.unlinkSync(filePath);
    console.error('Error analyzing resume with OpenAI:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
