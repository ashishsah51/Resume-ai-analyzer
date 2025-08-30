export const renderResumeText = (data) => {
let output = "";

// Name & Profession
output += `${data.personalInfo.fullName || ''}\n`;
output += `${data.personalInfo.profession || ''}\n\n`;

// Summary
if (data.personalInfo.summary) {
    output += `PROFESSIONAL SUMMARY\n${data.personalInfo.summary}\n\n`;
}

// Skills
if (data.skillSections && data.skillSections.length > 0) {
    output += `TECHNICAL SKILLS\n`;
    data.skillSections.forEach(sec => {
    if (sec.header) output += `• ${sec.header}: ${(sec.skills || []).join(', ')}\n`;
    });
    output += `\n`;
}

// Experience
if (data.experiences && data.experiences.length > 0) {
    output += `PROFESSIONAL EXPERIENCE\n\n`;
    data.experiences.forEach(exp => {
    output += `${exp.position || ''} | ${exp.company || ''} | ${exp.place || ''} | ${exp.duration || ''}\n`;
    (exp.achievements || []).forEach(a => {
        output += `• ${a}\n`;
    });
    output += `\n`;
    });
}

// Education
if (data.educations && data.educations.length > 0) {
    output += `EDUCATION\n`;
    data.educations.forEach(edu => {
    output += `${edu.degree || ''} | ${edu.institution || ''} | ${edu.place || ''} | ${edu.year || ''}\n`;
    if (edu.details) output += `${edu.details}\n`;
    });
    output += `\n`;
}

// Certifications
if (data.certifications && data.certifications.length > 0) {
    output += `CERTIFICATIONS\n`;
    data.certifications.forEach(cert => {
    output += `• ${cert.name || ''} (${cert.date || ''})`;
    if (cert.issuer) output += ` - ${cert.issuer}`;
    output += `\n`;
    });
    output += `\n`;
}

// Custom Sections
if (data.customSections && data.customSections.length > 0) {
    data.customSections.forEach(section => {
    if (section.name) output += `${section.name.toUpperCase()}\n`;
    (section.items || []).forEach(item => {
        output += `${item.title || ''} | ${item.place || ''} | ${item.duration || ''}\n`;
        if (item.description) output += `${item.description}\n`;
        (item.content || []).forEach(c => output += `• ${c}\n`);
        output += `\n`;
    });
    });
}

return output.trim();
}

export const generateResume = ({
    personalInfo = {},
    experiences = [],
    educations = [],
    certifications = [],
    skillSections = [],
    customSections = []
  }) => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${personalInfo.fullName || 'Professional'} - Resume</title>
        ${generateStyles()}
      </head>
      <body>
        <div class="resume-container">
          ${generateHeader(personalInfo)}
          <div class="content">
            ${generateSummary(personalInfo.summary)}
            ${generateSkills(skillSections)}
            ${generateExperiences(experiences)}
            ${generateCustomSections(customSections)}
            ${generateEducations(educations)}
            ${generateCertifications(certifications)}
          </div>
        </div>
        <script>window.addEventListener('load', () => window.print());</script>
      </body>
    </html>
    `;
  };

  
  const generateHeader = (info) => `
  <header class="header">
    <h1>${info.fullName || 'Your Name'}</h1>
    <div class="tagline">${info.profession || 'Professional Summary Here'}</div>
    <div class="contact-info">
      <span>${info.email || 'your.email@example.com'}</span>
      <span>${info.phone || '(555) 123-4567'}</span>
      <span>${info.location || 'Your City, State'}</span>
      ${info.linkedin ? `<a href="${info.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
      ${info.github ? `<a href="${info.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
    </div>
  </header>
`;

const generateSummary = (summary) => summary ? `
  <section class="section">
    <h2 class="section-title">Professional Summary</h2>
    <div class="summary">${summary}</div>
  </section>` : '';

const generateExperiences = (experiences) => {
  if (!experiences.some(exp => exp.company)) return '';
  return `
  <section class="section">
    <h2 class="section-title">Professional Experiences</h2>
    ${experiences.filter(exp => exp.company).map(exp => `
      <div class="item">
        <div class="item-header">
          <div class="item-company">${exp.company}</div>
          <div class="item-duration">${exp.place || 'Place'}</div>
        </div>
        <div class="item-header">
          <div class="item-title">${exp.position || 'Position Title'}</div>
          <div class="item-duration">${exp.duration || 'Duration'}</div>
        </div>
        ${exp.achievements ? `
        <div class="achievements">
          <ul>
            ${exp.achievements
            .filter(line => line.trim())
            .map(line => `<li>${line}</li>`)
            .join('')}
          </ul>
        </div>` : ''}
      </div>`).join('')}
  </section>`;
};

const generateEducations = (educations) => {
  if (!educations.some(edu => edu.institution)) return '';
  return `
  <section class="section">
    <h2 class="section-title">Educations</h2>
    ${educations.filter(edu => edu.institution).map(edu => `
      <div class="item">
        <div class="item-header">
          <div class="item-company">${edu.institution}</div>
          <div>${edu.place}</div>
        </div>
        <div class="item-header">
          ${edu.details ? `<div class="achievements"><p>${edu.degree}, ${edu.details}</p></div>` : ''}
          <div class="item-duration">${edu.year || 'Year'}</div>
        </div>
      </div>`).join('')}
  </section>`;
};

const generateCertifications = (certs) => {
  if (!certs.some(cert => cert.name)) return '';
  return `
  <section class="section">
    <h2 class="section-title">Certifications</h2>
    <div class="certifications-wrapper">
      ${certs.map(cert => `
        <div class="certification-card">
          <div class="item-company">${cert.name} by ${cert.issuer} (${cert.date})</div>
          <div class="item-header">
            ${cert.details ? `<div class="achievements"><p>${cert.details}</p></div>` : ''}
            ${cert.link ? `<div style="margin-top: 4px;"><a href="${cert.link}" target="_blank" style="font-size: 10px; color: blue;">View Certificate</a></div>` : ''}
          </div>
        </div>`).join('')}
    </div>
  </section>`;
};

const generateSkills = (sections) => {
  const sectionSkills = sections.filter(s => s.skills.length > 0);

  if (!sectionSkills.length) return '';

  let html = `<section class="section"><h2 class="section-title">Skills</h2>`;

  sectionSkills.forEach(sec => {
    html += `
    <div class="skill-row">
      <div class="skill-header">${sec.header}:</div>
      <div class="skills-container">
        ${sec.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
    </div>`;
  });


  html += `</section>`;
  return html;
};

const generateCustomSections = (customSections) => {
  return customSections.map(section => `
    <section class="section">
        <h2 class="section-title">${section.name}</h2>
        ${(section.items ?? [])
        .filter(item => item.title || item.content)
        .map(item => `
        <div class="custom-section-item">
            <div class="item-header">
            ${item.title ? `<div class="custom-section-title">${item.title}</div>` : ''}
            ${item.place ? `<div class="custom-section-title">${item.place}</div>` : ''}
            ${!item.place && item.duration ? `<div class="custom-section-title">${item.duration}</div>` : ''}
            </div>
            <div class="item-header">
            ${item.description ? `<div class="custom-section-content">${item.description}</div>` : ''}
            ${item.place && item.duration ? `<div class="custom-section-title">${item.duration}</div>` : ''}
            </div>
            ${(item.content && Array.isArray(item.content)) ? `
            <div class="achievements">
                <ul>
                ${item.content
                    .filter(line => typeof line === 'string' && line.trim())
                    .map(line => `<li>${line}</li>`)
                    .join('')}
                </ul>
            </div>` : ''}
        </div>`).join('')}
    </section>`).join('');
};

const generateStyles = () => `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.4;
        color: #000;
        background: #fff;
        padding: 0;
        margin: 0;
        font-size: 11px;
      }

      .resume-container {
        max-width: 8.5in;
        min-height: 11in;
        margin: 0 auto;
        background: #fff;
        padding: 0.5in;
        display: flex;
        flex-direction: column;
      }

      .header {
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #000;
        padding-bottom: 15px;
      }

      .header h1 {
        font-size: 24px;
        margin-bottom: 5px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .header .tagline {
        font-size: 12px;
        font-style: italic;
        margin-bottom: 10px;
        color: #333;
      }

      .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 15px;
        font-size: 10px;
      }

      .contact-info span {
        border-right: 1px solid #000;
        padding-right: 15px;
      }

      .contact-info span:last-child {
        border-right: none;
        padding-right: 0;
      }

      .content {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .section {
        margin-bottom: 15px;
        break-inside: avoid;
      }

      .section-title {
        font-size: 14px;
        font-weight: bold;
        color: #000;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 1px solid #000;
        padding-bottom: 3px;
        margin-bottom: 10px;
        text-align: center;
      }

      .item {
        margin-bottom: 12px;
        page-break-inside: avoid;
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 3px;
      }

      .item-title {
        font-weight: bold;
        font-size: 12px;
      }

      .item-company {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 1px;
      }

      .item-duration {
        font-size: 11px;
        font-weight: normal;
      }

      .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
      }

      .skill-tag {
        border: 1px solid #000;
        font-size: 9px;
        font-weight: normal;
        display: inline-block;
      }

      .summary {
        font-size: 10px;
        text-align: justify;
        line-height: 1.3;
      }

      .achievements {
        margin-top: 5px;
      }

      .achievements ul {
        list-style: none;
        padding-left: 0;
      }

      .achievements li {
        position: relative;
        padding-left: 12px;
        margin-bottom: 3px;
        font-size: 10px;
        line-height: 1.3;
      }

      .achievements li:before {
        content: "";
        font-weight: bold;
        position: absolute;
        left: 0;
      }

      .custom-section-item {
        margin-bottom: 8px;
      }

      .custom-section-title {
        font-weight: bold;
        font-size: 10px;
        margin-bottom: 2px;
      }

      .custom-section-content {
        font-size: 10px;
        line-height: 1.3;
      }

    @media print {
        body {
          margin: 0;
          padding: 0;
        }

        .resume-container {
          margin: 0;
          padding: 0.5in;
          max-width: none;
          min-height: none;
          height: 11in;
          width: 8.5in;
        }

        .certifications-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .certification-card {
          flex: 1 1 calc(33.33% - 10px); /* 3 per row with spacing */
          box-sizing: border-box;
          border: 1px solid #ccc;
          padding: 6px;
          font-size: 10px;
          border-radius: 4px;
        }

        .skill-manager {
            max-width: 600px;
            margin: 20px auto;
            font-family: Arial, sans-serif;
        }

        .add-header {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        }

        .add-header input {
        flex: 1;
        padding: 5px;
        }

        .skill-row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 4px;
        }

        .skill-header {
        font-weight: bold;
        font-size: 15px;
        align-items: center;
        width: auto;
        margin-right: 10px;
        flex-shrink: 1;
        }

        .skills-container {
        display: flex;
        flex-wrap: wrap;
        }

        .skill-tag {
        background-color: #e0e0e0;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        }

        @page {
            size: letter;
            margin: 0;
        }
    }
</style>
`;