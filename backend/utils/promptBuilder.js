// File: utils/promptBuilder.js
function buildPrompt1(resumeText, jobDescription) {
    return `
  You are a resume improvement assistant.
  
  Given the following resume content:
  
  ${resumeText}
  
  And this job description (optional):
  
  ${jobDescription || "N/A"}
  
  Rewrite the resume with enhanced language, alignment to the job, and professional formatting. 
  Return the full updated resume content.
    `;
  }

function atsScorePrompt(resumeText) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return `
  You are an expert ATS (Applicant Tracking System) evaluator. Your task is to analyze the given **Resume** and produce an ATS score based solely on resume content — without comparing it to any specific job description.

  Follow these thinking steps internally (do not include in output):
  1. **Section Identification:** Detect standard resume sections such as Contact Information, Professional Summary, Work Experience, Skills, Education, Formatting.
  2. **Scoring:** Assign a score (0–100) for each section based on completeness, relevance, and ATS best practices.
  3. **Overall Score:** Calculate an overall score (0–100) as a weighted average of the sections.
  4. **Strengths:** Identify 3–5 strengths that make the resume ATS-friendly.
  5. **Improvements:** Identify 3–5 actionable suggestions to improve ATS compatibility.

  Output must be **ONLY valid JSON** in the following exact format:
  {
    "overallScore": number,
    "sections": [
      { "name": "Contact Information", "score": number, "feedback": "string" },
      { "name": "Professional Summary", "score": number, "feedback": "string" },
      { "name": "Work Experience", "score": number, "feedback": "string" },
      { "name": "Skills", "score": number, "feedback": "string" },
      { "name": "Education", "score": number, "feedback": "string" },
      { "name": "Formatting", "score": number, "feedback": "string" }
    ],
    "strengths": [
      "string",
      "string",
      "string"
    ],
    "improvements": [
      "string",
      "string",
      "string"
    ]
  }

  Resume:
  ${resumeText}

  Respond with only the JSON and no extra text.`;
}

function analyzePrompt(resumeText, jobDescription) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return `
  You are an expert HR analyst and a highly advanced AI resume screener. Your task is to perform a detailed, critical analysis of a candidate's **Resume** against a given **Job Description**. The current date is ${currentDate}.

  First, perform a step-by-step analysis by following these thinking steps and putting your reasoning inside a <thinking> block:
  1.  **Job Role Analysis:** Identify the core role, seniority level (e.g., Junior, Senior, Lead), and primary domain (e.g., Software Engineering, Finance) from the Job Description.
  2.  **Keyword Extraction:** Extract the top 10-15 most critical hard skills, soft skills, and technologies from the Job Description.
  3.  **Resume Parsing:** Scan the resume to find where these keywords appear. Note the context (e.g., is 'Python' listed under a 'Skills' section, or is it used in a project description with measurable outcomes?).
  4.  **Experience Alignment:** Compare the candidate's years of experience and job titles with the requirements. Does the candidate's career progression match the role's seniority?
  5.  **Scoring Rationale:** Based on the alignment of skills and experience, formulate a rationale for the final score.

  After your analysis in the <thinking> block, generate a final JSON object. Do NOT include the <thinking> block in the final JSON output.

  The JSON object must have the following structure:
  {
    "atsScore": 0-100,  // A score that reflects how well the resume aligns with the job description based on keywords and role relevance.
    "scoreBreakdown": {
      "skillsMatch": "0-50 points, based on the presence and context of required skills.",
      "experienceAlignment": "0-40 points, based on relevant job titles, years of experience, and quantifiable achievements.",
      "educationAndCertifications": "0-10 points, based on relevant degrees and certifications."
    },
    "domain": "The primary job domain, e.g., 'Software Engineering', 'Data Science', 'Product Management'.",
    "explanation": "A concise summary of the candidate's fit, highlighting their key strengths and most significant gaps for this specific role.",
    "matchedKeywords": ["List of critical keywords from the job description found in the resume."],
    "missingKeywords": ["List of critical keywords from the job description NOT found in the resume."],
    "suggestions": [
      "Provide 2-4 highly specific based on job description,Each line should be separated by line breaks, actionable suggestions for the candidate. Each suggestion must state WHAT is missing and WHERE in the resume it could be added. Example: 'Consider adding the keyword 'Terraform' to your cloud engineering role description, as it is a key requirement for the 'Infrastructure as Code' responsibility mentioned in the job post.'"
    ]
  }

  Resume:
  ${resumeText}

  Job Description:
  ${jobDescription}

  Respond with only the JSON.`;
  }

// function enhanceResumePrompt(resumeText, suggestionText) {
//     return `
//     **Resume Enhancement Prompt for ATS Optimization**

//     Analyze the provided resume text and return enhanced, ATS-optimized content in the specified JSON format. Apply these enhancement techniques:

//     1. **Highly Recommended**
//         - Give high preference to "suggestionText" content that I added in below for resume enhancement content like(skills).

//     2. **Quantifiable Achievements**:
//         - Convert generic statements into measurable results (add metrics/percentages) and short
//         - Example: "Improved system performance" → "Boosted system performance by 40% through optimization"

//     3. **Action Verbs**:
//         - Start bullet points with strong action verbs (Developed, Implemented, Spearheaded, Optimized)
//         - Avoid passive language

//     4. **Keyword Optimization**:
//         - Identify industry-specific keywords from job descriptions
//         - Incorporate naturally into content

//     5. **Skill Standardization**:
//         - Use industry-standard terms (JavaScript instead of JS)
//         - Group into two categories (Techincal skill and soft skill) and add atlest two soft skill based on your choice

//     6. **ATS-Friendly Formatting**:
//         - Use consistent date formats (MM/YYYY)
//         - Avoid special characters/graphics
//         - Standard section headers

//     7. **Content Enhancement**:
//         - Add missing LinkedIn/GitHub profiles
//         - Strengthen professional summaries
//         - Include certification links
        
//     8. **Mock Suggestions**:
//         - Provide clear, actionable tips for creating a perfect, ATS-friendly resume.
//         - Present the suggestions as bullet points, each on a new line for readability.

//     **Input**: 
//     [Paste raw resume text here]

//     **Output Structure**:
//     json
//     {
//     "personalInfo": {
//     "fullName": "",
//     "email": "",
//     "phone": "",
//     "profession": "",
//     "location": "",
//     "linkedin": "",
//     "github": "",
//     "summary": ""
//     },
//     "experiences": [
//     {
//         "company": "",
//         "position": "",
//         "duration": "",
//         "place": "",
//         "achievements": []
//     }
//     ],
//     "educations": [
//     {
//         "institution": "",
//         "degree": "",
//         "year": "",
//         "place": "",
//         "details": ""
//     }
//     ],
//     "certifications": [
//     {
//         "name": "",
//         "issuer": "",
//         "date": "",
//         "details": "",
//         "link": ""
//     }
//     ],
//     "skillSections": [
//     {
//         "header": "",
//         "skills": []
//     }
//     ],
//     "customSections": [
//     {
//         "id": 1,
//         "name": "",
//         "items": [
//         {
//             "title": "",
//             "description": "",
//             "duration": "",
//             "place": "",
//             "content": []
//         }
//         ]
//     }
//     ],
//     "mockSuggestion" : ""
//     }

//     RESUME CONTENT (if available):
//     ${resumeText}

//     ADDITIONAL USER SUGGESTIONS (optional support text for building resume):
//     ${suggestionText}

//     Return ONLY valid JSON.`;
// }

function enhanceResumePrompt(resumeText, suggestionText) {
    return `
**Resume Enhancement Prompt for ATS Optimization (SuggestionText Priority)**

Your task: Enhance the resume with **ATS optimization**, giving **first priority** to the \`suggestionText\` provided.  
- Treat \`suggestionText\` as the **core source of improvements** (skills, keywords, achievements).  
- Filter resume content so that **all relevant and valid points from \`suggestionText\`** are integrated wherever possible.
- Keep existing strong content from the resume, but rewrite/optimize it to blend seamlessly with \`suggestionText\`.

---

### Enhancement Rules:
1. **Highest Priority — SuggestionText**
   - Integrate every relevant skill, keyword, and achievement from \`suggestionText\`.
   - If a skill/point from \`suggestionText\` is not in the resume, **add it** in the most suitable section.
   - Remove or replace weak/irrelevant resume points with stronger content from \`suggestionText\`.

2. **Quantifiable Achievements**
   - Turn vague statements into measurable outcomes (add numbers, percentages, metrics).
   - Example: "Improved system performance" → "Boosted system performance by 40% through optimization".

3. **Action Verbs**
   - Start bullet points with strong verbs (Developed, Implemented, Spearheaded, Optimized).

4. **Keyword Optimization**
   - Identify & insert relevant job-specific keywords naturally, prioritizing from \`suggestionText\`.

5. **Skill Standardization**
   - Use industry-standard names.
   - Group skills into **Technical Skills** and **Soft Skills** (add at least two strong soft skills).

6. **ATS-Friendly Formatting**
   - Consistent date format (MM/YYYY).
   - Avoid special characters, images, or complex formatting.

7. **Content Enhancement**
   - Add missing LinkedIn/GitHub if not present.
   - Strengthen summary using \`suggestionText\` where possible.
   - Include certification links.

8. **Mock Suggestions**
   - Provide bullet-point tips for improvement, clearly formatted.

---

### Input Data:
**Original Resume Text:**
${resumeText}

**High-Priority SuggestionText (must integrate fully mostly comes in skills):**
${suggestionText}

---

### Output Format:
Return **only** valid JSON:
\`\`\`json
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "profession": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "summary": ""
  },
  "experiences": [
    {
      "company": "",
      "position": "",
      "duration": "",
      "place": "",
      "achievements": []
    }
  ],
  "educations": [
    {
      "institution": "",
      "degree": "",
      "year": "",
      "place": "",
      "details": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "details": "",
      "link": ""
    }
  ],
  "skillSections": [
    {
      "header": "",
      "skills": []
    }
  ],
  "customSections": [
    {
      "id": 1,
      "name": "",
      "items": [
        {
          "title": "",
          "description": "",
          "duration": "",
          "place": "",
          "content": []
        }
      ]
    }
  ],
  "mockSuggestion": ""
}
\`\`\`

⚠️ **Do not return any explanation, only valid JSON output.**`;
}

  
module.exports = { analyzePrompt, enhanceResumePrompt, atsScorePrompt };