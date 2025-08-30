// Import the new Google Generative AI SDK
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const { analyzePrompt, enhanceResumePrompt, atsScorePrompt } = require('../utils/promptBuilder');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Configure Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY); // Set this in your environment

/**
 * Extracts plain text from uploaded resume file.
 * This function does not need any changes.
 */
async function extractTextFromResume(buffer, filename) {
  const ext = path.extname(filename).toLowerCase();

  if (ext === '.pdf') {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  }

  if (ext === '.docx') {
    const docResult = await mammoth.extractRawText({ buffer });
    return docResult.value;
  }

  if (ext === '.txt') {
    return buffer.toString('utf8');
  }

  return '';
}

/**
 * Calls Gemini to analyze resume vs job description
 */
async function analyzeResumeWithOpenAI(buffer, filename, jobDescription, resumeVsJob) {
  const resumeText = await extractTextFromResume(buffer, filename);
  let prompt;
  if(!resumeVsJob) {
    prompt = atsScorePrompt(resumeText);
  } else {
    prompt = analyzePrompt(resumeText, jobDescription);
  }

  // Get the Gemini model. We'll use 'gemini-1.5-flash' for speed and efficiency.
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    // This is the key change: Enforcing JSON output!
    generationConfig: {
      responseMimeType: "application/json",
    },
    // Optional: Configure safety settings to be less restrictive.
    safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        }
      ],
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = response.text();

  try {
    // The responseText is now guaranteed to be a valid JSON string.
    return JSON.parse(responseText);
  } catch (e) {
    console.error('Failed to parse Gemini response:', responseText);
    throw new Error('Gemini response was not valid JSON, despite the settings.');
  }
}

async function enhanceResumeWithOpenAI(resumeText, sugText) {
    const prompt = enhanceResumePrompt(resumeText, sugText);
  
    // Get the Gemini model. We'll use 'gemini-1.5-flash' for speed and efficiency.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      // This is the key change: Enforcing JSON output!
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
      // Optional: Configure safety settings to be less restrictive.
      safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
          }
        ],
    });
  
    const result = await model.generateContent(prompt);
    const structuredData =  JSON.parse((await result.response).text());

    try {
        // The responseText is now guaranteed to be a valid JSON string.
        return { data: structuredData };
    } catch (e) {
      console.error('Failed to parse Gemini response:', responseText);
      throw new Error('Gemini response was not valid JSON, despite the settings.');
    }
  }

module.exports = { analyzeResumeWithOpenAI, enhanceResumeWithOpenAI };