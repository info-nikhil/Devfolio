const templateStyles = {
  template1: {
    name: "Slate Edge",
    font: "'Manrope', sans-serif",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    card: "#ffffff",
    text: "#0f172a",
    accent: "#0f766e"
  },
  template2: {
    name: "Amber Grid",
    font: "'Space Grotesk', sans-serif",
    background: "linear-gradient(120deg, #fff7ed, #ffedd5)",
    card: "#ffffff",
    text: "#2d1b04",
    accent: "#c2410c"
  },
  template3: {
    name: "Ocean Resume",
    font: "'DM Sans', sans-serif",
    background: "linear-gradient(160deg, #ecfeff, #cffafe)",
    card: "#f8fafc",
    text: "#083344",
    accent: "#0369a1"
  },
  template4: {
    name: "Graphite Pro",
    font: "'Sora', sans-serif",
    background: "linear-gradient(130deg, #f4f4f5, #e4e4e7)",
    card: "#fafafa",
    text: "#18181b",
    accent: "#52525b"
  }
};

function text(value) {
  return value ? String(value) : "";
}

function renderSkills(skills = []) {
  return skills.map((skill) => `<span class="chip">${text(skill)}</span>`).join("");
}

function renderProjects(projects = []) {
  return projects
    .map(
      (project) => `
      <article class="block">
        <h3>${text(project.title)}</h3>
        <p>${text(project.description)}</p>
        <div class="links">
          ${project.demoLink ? `<a href="${text(project.demoLink)}" target="_blank">Live Demo</a>` : ""}
          ${project.repoLink ? `<a href="${text(project.repoLink)}" target="_blank">GitHub Repo</a>` : ""}
        </div>
      </article>
    `
    )
    .join("");
}

function renderExperience(experience = []) {
  return experience
    .map(
      (item) => `
      <article class="block">
        <h3>${text(item.role)} - ${text(item.company)}</h3>
        <small>${text(item.startDate)} - ${text(item.endDate)}</small>
        <p>${text(item.description)}</p>
      </article>
    `
    )
    .join("");
}

function renderEducation(education = []) {
  return education
    .map(
      (item) => `
      <article class="block">
        <h3>${text(item.degree)}</h3>
        <small>${text(item.institution)} | ${text(item.startYear)} - ${text(item.endYear)}</small>
        <p>${text(item.description)}</p>
      </article>
    `
    )
    .join("");
}

function renderSocialLinks(socialLinks = {}) {
  const entries = [
    ["GitHub", socialLinks.github],
    ["LinkedIn", socialLinks.linkedin],
    ["Twitter", socialLinks.twitter],
    ["Website", socialLinks.website]
  ];

  return entries
    .filter(([, link]) => Boolean(link))
    .map(([label, link]) => `<a href="${text(link)}" target="_blank">${label}</a>`)
    .join("");
}

function baseStyles(theme) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Manrope:wght@400;500;700&family=Sora:wght@400;600;700&family=Space+Grotesk:wght@400;500;700&display=swap');
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ${theme.font};
      color: ${theme.text};
      background: ${theme.background};
      min-height: 100vh;
    }
    .portfolio-shell {
      max-width: 1080px;
      margin: 32px auto;
      background: ${theme.card};
      border-radius: 20px;
      box-shadow: 0 20px 45px rgba(2, 8, 23, 0.1);
      overflow: hidden;
    }
    .hero {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 20px;
      padding: 28px;
      border-bottom: 2px solid ${theme.accent}22;
      background: linear-gradient(120deg, ${theme.accent}22, transparent);
    }
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 18px;
      object-fit: cover;
      border: 3px solid ${theme.accent};
    }
    .hero h1 {
      margin: 0 0 10px;
      font-size: clamp(1.5rem, 2.8vw, 2.4rem);
    }
    .hero p {
      margin: 0;
      line-height: 1.6;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border: 1px solid ${theme.accent}22;
      border-radius: 14px;
      padding: 16px;
    }
    .card h2 {
      margin-top: 0;
      font-size: 1rem;
      color: ${theme.accent};
      letter-spacing: 0.02em;
    }
    .chip-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .chip {
      background: ${theme.accent};
      color: #ffffff;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 0.85rem;
    }
    .block {
      border-left: 3px solid ${theme.accent};
      margin-bottom: 12px;
      padding-left: 10px;
    }
    .block h3 {
      margin: 0;
      font-size: 1rem;
    }
    .block small {
      color: #64748b;
    }
    .block p {
      margin: 8px 0 0;
      line-height: 1.5;
    }
    .links,
    .social {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 8px;
    }
    a {
      color: ${theme.accent};
      text-decoration: none;
      font-weight: 600;
    }
    .contact p {
      margin: 6px 0;
    }
    @media (max-width: 768px) {
      .hero {
        grid-template-columns: 1fr;
      }
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}

function buildPortfolioMarkup(data) {
  return `
    <main class="portfolio-shell">
      <section class="hero">
        <img class="avatar" src="${text(data.profile?.profilePicture)}" alt="Profile Picture" />
        <div>
          <h1>${text(data.profile?.name)}</h1>
          <p>${text(data.profile?.aboutMe)}</p>
        </div>
      </section>
      <section class="grid">
        <article class="card">
          <h2>Skills</h2>
          <div class="chip-wrap">${renderSkills(data.skills)}</div>
        </article>
        <article class="card">
          <h2>Social Links</h2>
          <div class="social">${renderSocialLinks(data.socialLinks)}</div>
        </article>
        <article class="card">
          <h2>Projects</h2>
          ${renderProjects(data.projects)}
        </article>
        <article class="card">
          <h2>Experience</h2>
          ${renderExperience(data.experience)}
        </article>
        <article class="card">
          <h2>Education</h2>
          ${renderEducation(data.education)}
        </article>
        <article class="card contact">
          <h2>Contact</h2>
          <p><strong>Email:</strong> ${text(data.contactInfo?.email)}</p>
          <p><strong>Phone:</strong> ${text(data.contactInfo?.phone)}</p>
          <p><strong>Location:</strong> ${text(data.contactInfo?.location)}</p>
        </article>
      </section>
    </main>
  `;
}

export function getTemplateOptions() {
  return Object.entries(templateStyles).map(([key, value]) => ({
    id: key,
    label: value.name
  }));
}

export function buildPortfolioHtml(data, templateId = "template1") {
  const theme = templateStyles[templateId] || templateStyles.template1;
  const payload = {
    templateId,
    portfolioData: data
  };
  const payloadText = JSON.stringify(payload, null, 2).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="pb-template" content="${templateId}" />
    <title>${text(data.title || data.profile?.name || "Portfolio")}</title>
    <style>${baseStyles(theme)}</style>
  </head>
  <body>
    <script id="pb-data" type="application/json">${payloadText}</script>
    ${buildPortfolioMarkup(data)}
  </body>
</html>`;
}

export function extractPortfolioPayload(htmlCode) {
  if (!htmlCode) {
    return null;
  }

  const templateMatch = htmlCode.match(/<meta name="pb-template" content="([^"]+)"/);
  const dataMatch = htmlCode.match(
    /<script id="pb-data" type="application\/json">([\s\S]*?)<\/script>/
  );

  if (!dataMatch) {
    return null;
  }

  try {
    const parsed = JSON.parse(dataMatch[1]);
    return {
      templateId: parsed.templateId || templateMatch?.[1] || "template1",
      portfolioData: parsed.portfolioData || null
    };
  } catch (error) {
    return null;
  }
}
