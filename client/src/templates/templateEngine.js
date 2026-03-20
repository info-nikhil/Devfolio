const templateDefinitions = {
  template1: {
    label: "Midnight Ember",
    description: "Cinematic dark case-study layout",
    mood: "Bold, dramatic, and launch-ready",
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Outfit', sans-serif",
    accent: "#ff7a33",
    accentSoft: "rgba(255, 122, 51, 0.18)",
    accentAlt: "#39d0a4",
    text: "#f7f7fb",
    muted: "#9ca3af",
    page: "#060708",
    surface: "#111317"
  },
  template2: {
    label: "Emerald Atelier",
    description: "Elegant dark studio with service framing",
    mood: "Refined, editorial, and modern",
    headingFont: "'Syne', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    accent: "#3ce0b2",
    accentSoft: "rgba(60, 224, 178, 0.16)",
    accentAlt: "#e8f3ee",
    text: "#f4f7f5",
    muted: "#9db0a7",
    page: "#07100d",
    surface: "#101916"
  },
  template3: {
    label: "Ivory Noir",
    description: "Editorial light portfolio with gallery sections",
    mood: "Art-directed, minimal, and polished",
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    accent: "#1d1d1f",
    accentSoft: "rgba(29, 29, 31, 0.08)",
    accentAlt: "#866f5b",
    text: "#1e1c1a",
    muted: "#5d5a56",
    page: "#f4f0ea",
    surface: "#fffdf9"
  },
  template4: {
    label: "Signal Orange",
    description: "Tech-forward grid with strong contrast",
    mood: "Sharp, energetic, and product heavy",
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Outfit', sans-serif",
    accent: "#ff6d2e",
    accentSoft: "rgba(255, 109, 46, 0.16)",
    accentAlt: "#5e7bff",
    text: "#f5f7ff",
    muted: "#9ba4c2",
    page: "#070913",
    surface: "#101527"
  }
};

function text(value) {
  return value ? String(value) : "";
}

function escapeHtml(value) {
  return text(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeUrl(value) {
  const raw = text(value).trim();
  if (!raw) {
    return "";
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) {
    return raw;
  }

  return `https://${raw.replace(/^\/+/, "")}`;
}

function getPrimaryRole(data) {
  return data.experience?.[0]?.role || "Product Developer";
}

function getStats(data) {
  return [
    { label: "Projects", value: String(data.projects?.length || 0).padStart(2, "0") },
    { label: "Skills", value: String(data.skills?.length || 0).padStart(2, "0") },
    { label: "Experience", value: String(data.experience?.length || 0).padStart(2, "0") }
  ];
}

function renderLink(label, url, className = "cta-link") {
  const href = safeUrl(url);
  if (!href) {
    return "";
  }

  return `<a class="${className}" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function renderSkillChips(skills = [], className = "skill-chip") {
  return skills.map((skill) => `<span class="${className}">${escapeHtml(skill)}</span>`).join("");
}

function renderProjectCards(projects = [], cardClass = "project-card") {
  return projects
    .map(
      (project, index) => `
        <article class="${cardClass}">
          <span class="card-count">0${index + 1}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <div class="link-row">
            ${renderLink("Live Demo", project.demoLink, "text-link")}
            ${renderLink("Repository", project.repoLink, "text-link")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderExperienceItems(experience = [], className = "timeline-item") {
  return experience
    .map(
      (item) => `
        <article class="${className}">
          <small>${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</small>
          <h3>${escapeHtml(item.role)}</h3>
          <strong>${escapeHtml(item.company)}</strong>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join("");
}

function renderEducationItems(education = [], className = "education-item") {
  return education
    .map(
      (item) => `
        <article class="${className}">
          <small>${escapeHtml(item.startYear)} - ${escapeHtml(item.endYear)}</small>
          <h3>${escapeHtml(item.degree)}</h3>
          <strong>${escapeHtml(item.institution)}</strong>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join("");
}

function renderSocialLinks(socialLinks = {}, className = "social-link") {
  const entries = [
    ["GitHub", socialLinks.github],
    ["LinkedIn", socialLinks.linkedin],
    ["Twitter", socialLinks.twitter],
    ["Website", socialLinks.website]
  ];

  return entries
    .map(([label, url]) => renderLink(label, url, className))
    .filter(Boolean)
    .join("");
}

function renderContactList(contactInfo = {}) {
  const emailHref = safeUrl(`mailto:${contactInfo.email || ""}`);
  const phoneHref = safeUrl(`tel:${contactInfo.phone || ""}`);

  return `
    <div class="contact-list">
      <div><span>Email</span>${emailHref ? `<a href="${escapeHtml(emailHref)}">${escapeHtml(contactInfo.email)}</a>` : `<strong>${escapeHtml(contactInfo.email)}</strong>`}</div>
      <div><span>Phone</span>${phoneHref ? `<a href="${escapeHtml(phoneHref)}">${escapeHtml(contactInfo.phone)}</a>` : `<strong>${escapeHtml(contactInfo.phone)}</strong>`}</div>
      <div><span>Location</span><strong>${escapeHtml(contactInfo.location)}</strong></div>
    </div>
  `;
}

function buildBaseStyles(theme) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&family=Syne:wght@500;700;800&display=swap');
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ${theme.bodyFont};
      color: ${theme.text};
      background: ${theme.page};
    }
    a { color: inherit; text-decoration: none; }
    img { display: block; max-width: 100%; }
    .template-root {
      min-height: 100vh;
      padding: 34px 20px;
      background:
        radial-gradient(circle at top right, ${theme.accentSoft}, transparent 24%),
        linear-gradient(180deg, ${theme.page}, ${theme.page});
    }
    .template-shell {
      max-width: 1180px;
      margin: 0 auto;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 24px 90px rgba(0, 0, 0, 0.22);
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: ${theme.accent};
      font-weight: 700;
    }
    .eyebrow::before {
      content: '';
      width: 18px;
      height: 1px;
      background: currentColor;
    }
    .cta-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 18px;
      border-radius: 999px;
      background: ${theme.accent};
      color: ${theme.page};
      font-weight: 700;
    }
    .text-link {
      color: ${theme.accent};
      font-weight: 700;
      margin-right: 14px;
    }
    .skill-chip {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 999px;
      background: ${theme.accentSoft};
      color: ${theme.text};
      font-size: 0.88rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 20px;
    }
    .stat-pill {
      padding: 14px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .stat-pill strong {
      display: block;
      font-family: ${theme.headingFont};
      font-size: 1.5rem;
      margin-bottom: 4px;
    }
    .project-card,
    .timeline-item,
    .education-item,
    .content-card,
    .service-card,
    .signal-card {
      border-radius: 22px;
      padding: 22px;
    }
    .card-count {
      display: inline-flex;
      margin-bottom: 14px;
      color: ${theme.accent};
      font-weight: 800;
      letter-spacing: 0.12em;
    }
    .link-row,
    .social-row,
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }
    .contact-list {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }
    .contact-list div {
      display: grid;
      gap: 4px;
    }
    .contact-list span {
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      opacity: 0.7;
    }
    @media (max-width: 900px) {
      .stats-row { grid-template-columns: 1fr; }
      .template-root { padding: 18px 12px; }
    }
  `;
}

function buildTemplateOneStyles(theme) {
  return `
    .template-one .template-shell {
      background: linear-gradient(180deg, #101113, #070809);
      color: ${theme.text};
    }
    .template-one .hero {
      padding: 28px 32px 34px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent),
        radial-gradient(circle at top right, ${theme.accentSoft}, transparent 26%);
    }
    .template-one .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .template-one .nav-brand {
      font-family: ${theme.headingFont};
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .template-one .nav-links {
      display: flex;
      gap: 16px;
      color: ${theme.muted};
      font-size: 0.92rem;
    }
    .template-one .hero-grid {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 24px;
      align-items: center;
    }
    .template-one h1 {
      margin: 12px 0 14px;
      font-family: ${theme.headingFont};
      font-size: clamp(2.8rem, 5vw, 4.8rem);
      line-height: 0.96;
    }
    .template-one .hero-copy p { color: ${theme.muted}; }
    .template-one .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 22px;
    }
    .template-one .portrait-card {
      position: relative;
      min-height: 480px;
      border-radius: 28px;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.65));
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .template-one .portrait-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(0.92);
    }
    .template-one .portrait-badges {
      position: absolute;
      inset: auto 22px 22px 22px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .template-one .main-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 18px;
      padding: 0 32px 32px;
    }
    .template-one .project-grid,
    .template-one .stacked-panels {
      display: grid;
      gap: 16px;
    }
    .template-one .project-card,
    .template-one .content-card,
    .template-one .timeline-item,
    .template-one .education-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .template-one .timeline-group,
    .template-one .education-group {
      display: grid;
      gap: 14px;
      margin-top: 18px;
    }
    .template-one h2,
    .template-one h3 { font-family: ${theme.headingFont}; margin: 0; }
    .template-one .content-card h2,
    .template-one .experience-card h2,
    .template-one .education-card h2 { margin-bottom: 12px; }
    .template-one .project-card p,
    .template-one .timeline-item p,
    .template-one .education-item p { color: ${theme.muted}; }
    .template-one .contact-card .social-row { margin-top: 18px; }
    .template-one .social-link {
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
    }
    @media (max-width: 900px) {
      .template-one .hero-grid,
      .template-one .main-grid { grid-template-columns: 1fr; }
      .template-one .hero,
      .template-one .main-grid { padding-left: 18px; padding-right: 18px; }
      .template-one .nav { flex-direction: column; align-items: flex-start; }
      .template-one .portrait-card { min-height: 360px; }
    }
  `;
}
function buildTemplateTwoStyles(theme) {
  return `
    .template-two .template-shell {
      background: linear-gradient(180deg, #0d1512, #08110e);
      display: grid;
      grid-template-columns: 0.36fr 0.64fr;
      color: ${theme.text};
    }
    .template-two .side {
      padding: 30px 24px;
      border-right: 1px solid rgba(255,255,255,0.08);
      background: radial-gradient(circle at top left, ${theme.accentSoft}, transparent 30%);
    }
    .template-two .side h1 {
      font-family: ${theme.headingFont};
      font-size: 2.6rem;
      margin: 14px 0 8px;
    }
    .template-two .side p { color: ${theme.muted}; }
    .template-two .side-section {
      margin-top: 26px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .template-two .main {
      padding: 26px;
      display: grid;
      gap: 18px;
    }
    .template-two .hero {
      display: grid;
      grid-template-columns: 1fr 0.8fr;
      gap: 18px;
      align-items: center;
      padding: 18px;
      border-radius: 28px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .template-two .hero h2 {
      font-family: ${theme.headingFont};
      font-size: clamp(2.4rem, 4vw, 3.8rem);
      margin: 14px 0 12px;
      line-height: 0.98;
    }
    .template-two .hero img {
      width: 100%;
      height: 340px;
      object-fit: cover;
      border-radius: 26px;
    }
    .template-two .service-grid,
    .template-two .project-grid,
    .template-two .story-grid {
      display: grid;
      gap: 16px;
    }
    .template-two .service-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .template-two .project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .template-two .story-grid { grid-template-columns: 1fr 1fr; }
    .template-two .service-card,
    .template-two .project-card,
    .template-two .content-card,
    .template-two .timeline-item,
    .template-two .education-item {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .template-two .service-card h3,
    .template-two .project-card h3,
    .template-two .content-card h2 { font-family: ${theme.headingFont}; }
    .template-two .social-link {
      color: ${theme.text};
      border-bottom: 1px solid rgba(255,255,255,0.18);
      padding-bottom: 2px;
    }
    @media (max-width: 920px) {
      .template-two .template-shell,
      .template-two .hero,
      .template-two .service-grid,
      .template-two .project-grid,
      .template-two .story-grid { grid-template-columns: 1fr; }
      .template-two .side { border-right: 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
    }
  `;
}

function buildTemplateThreeStyles(theme) {
  return `
    .template-three .template-shell {
      background: ${theme.surface};
      color: ${theme.text};
      border: 1px solid rgba(29, 29, 31, 0.08);
    }
    .template-three .hero {
      display: grid;
      grid-template-columns: 1fr 0.75fr;
      gap: 18px;
      padding: 34px;
      border-bottom: 1px solid rgba(29, 29, 31, 0.08);
    }
    .template-three h1 {
      font-family: ${theme.headingFont};
      font-size: clamp(3.2rem, 6vw, 5.4rem);
      line-height: 0.88;
      margin: 12px 0;
      font-weight: 600;
    }
    .template-three .role {
      font-size: 1rem;
      color: ${theme.accentAlt};
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-weight: 700;
    }
    .template-three .hero img {
      width: 100%;
      height: 100%;
      min-height: 420px;
      object-fit: cover;
      border-radius: 28px;
    }
    .template-three .skills-band {
      padding: 18px 34px 0;
    }
    .template-three .project-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      padding: 24px 34px;
    }
    .template-three .project-card,
    .template-three .timeline-item,
    .template-three .education-item,
    .template-three .content-card {
      background: #f8f4ee;
      border: 1px solid rgba(29,29,31,0.08);
    }
    .template-three .columns {
      display: grid;
      grid-template-columns: 1fr 1fr 0.8fr;
      gap: 16px;
      padding: 0 34px 34px;
    }
    .template-three .content-card h2,
    .template-three .project-card h3,
    .template-three .timeline-item h3,
    .template-three .education-item h3 {
      font-family: ${theme.headingFont};
    }
    .template-three .social-link {
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(29, 29, 31, 0.06);
      color: ${theme.text};
    }
    @media (max-width: 920px) {
      .template-three .hero,
      .template-three .project-strip,
      .template-three .columns { grid-template-columns: 1fr; }
      .template-three .hero,
      .template-three .skills-band,
      .template-three .project-strip,
      .template-three .columns { padding-left: 18px; padding-right: 18px; }
    }
  `;
}

function buildTemplateFourStyles(theme) {
  return `
    .template-four .template-shell {
      display: grid;
      grid-template-columns: 0.28fr 0.72fr;
      background: linear-gradient(180deg, #0e1424, #090d16);
      color: ${theme.text};
    }
    .template-four .side {
      padding: 28px 22px;
      border-right: 1px solid rgba(255,255,255,0.08);
      background: linear-gradient(180deg, rgba(255,109,46,0.08), transparent);
    }
    .template-four .side h1 {
      font-family: ${theme.headingFont};
      font-size: 2.1rem;
      margin: 16px 0 8px;
    }
    .template-four .side-nav,
    .template-four .side-section {
      display: grid;
      gap: 10px;
      margin-top: 22px;
    }
    .template-four .side-nav span {
      padding: 10px 12px;
      border-radius: 14px;
      background: rgba(255,255,255,0.04);
      color: ${theme.muted};
    }
    .template-four .main {
      padding: 28px;
      display: grid;
      gap: 18px;
    }
    .template-four .hero {
      padding: 22px;
      border-radius: 28px;
      background:
        radial-gradient(circle at top right, rgba(255,109,46,0.16), transparent 28%),
        rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .template-four .hero h2 {
      margin: 12px 0 14px;
      font-family: ${theme.headingFont};
      font-size: clamp(2.5rem, 4vw, 4.3rem);
      line-height: 0.96;
    }
    .template-four .dashboard-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 16px;
    }
    .template-four .project-grid,
    .template-four .bottom-grid,
    .template-four .signal-list {
      display: grid;
      gap: 16px;
    }
    .template-four .project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .template-four .bottom-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .template-four .signal-card,
    .template-four .project-card,
    .template-four .timeline-item,
    .template-four .education-item,
    .template-four .content-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .template-four .signal-card h3,
    .template-four .project-card h3,
    .template-four .timeline-item h3,
    .template-four .education-item h3 { font-family: ${theme.headingFont}; }
    .template-four .social-link {
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
    }
    @media (max-width: 920px) {
      .template-four .template-shell,
      .template-four .dashboard-grid,
      .template-four .project-grid,
      .template-four .bottom-grid { grid-template-columns: 1fr; }
      .template-four .side { border-right: 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
    }
  `;
}
function renderTemplateOne(data, theme) {
  const stats = getStats(data);
  const website = data.socialLinks?.website || data.socialLinks?.linkedin || data.socialLinks?.github;

  return `
    <div class="template-root template-one">
      <main class="template-shell">
        <section class="hero">
          <div class="nav">
            <span class="nav-brand">${escapeHtml(data.profile?.name || "Portfolio")}</span>
            <div class="nav-links"><span>Work</span><span>Experience</span><span>Contact</span></div>
          </div>
          <div class="hero-grid">
            <div class="hero-copy">
              <span class="eyebrow">${escapeHtml(getPrimaryRole(data))}</span>
              <h1>${escapeHtml(data.profile?.name)}</h1>
              <p>${escapeHtml(data.profile?.aboutMe)}</p>
              <div class="hero-actions">
                ${renderLink("View Website", website)}
                ${renderLink("Email Me", `mailto:${data.contactInfo?.email || ""}`, "cta-link")}
              </div>
              <div class="stats-row">
                ${stats
                  .map(
                    (item) => `<div class="stat-pill"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`
                  )
                  .join("")}
              </div>
            </div>
            <div class="portrait-card">
              <img src="${escapeHtml(safeUrl(data.profile?.profilePicture))}" alt="${escapeHtml(data.profile?.name)}" />
              <div class="portrait-badges">${renderSkillChips(data.skills?.slice(0, 4))}</div>
            </div>
          </div>
        </section>
        <section class="main-grid">
          <div class="project-grid">
            ${renderProjectCards(data.projects)}
            <div class="content-card experience-card">
              <span class="eyebrow">Experience</span>
              <h2>Work built with depth and momentum.</h2>
              <div class="timeline-group">${renderExperienceItems(data.experience)}</div>
            </div>
          </div>
          <div class="stacked-panels">
            <div class="content-card">
              <span class="eyebrow">Skills</span>
              <h2>Core capabilities</h2>
              <div class="chip-row">${renderSkillChips(data.skills)}</div>
            </div>
            <div class="content-card education-card">
              <span class="eyebrow">Education</span>
              <h2>Learning and craft</h2>
              <div class="education-group">${renderEducationItems(data.education)}</div>
            </div>
            <div class="content-card contact-card">
              <span class="eyebrow">Contact</span>
              <h2>Let's build something strong.</h2>
              ${renderContactList(data.contactInfo)}
              <div class="social-row">${renderSocialLinks(data.socialLinks)}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderTemplateTwo(data) {
  const featuredSkills = data.skills?.slice(0, 3) || [];
  const stats = getStats(data);

  return `
    <div class="template-root template-two">
      <main class="template-shell">
        <aside class="side">
          <span class="eyebrow">Selected portfolio</span>
          <h1>${escapeHtml(data.profile?.name)}</h1>
          <p>${escapeHtml(getPrimaryRole(data))}</p>
          <div class="side-section">
            <span class="eyebrow">About</span>
            <p>${escapeHtml(data.profile?.aboutMe)}</p>
          </div>
          <div class="side-section">
            <span class="eyebrow">Capabilities</span>
            <div class="chip-row">${renderSkillChips(data.skills)}</div>
          </div>
          <div class="side-section">
            <span class="eyebrow">Connect</span>
            ${renderContactList(data.contactInfo)}
            <div class="social-row">${renderSocialLinks(data.socialLinks)}</div>
          </div>
        </aside>
        <section class="main">
          <section class="hero">
            <div>
              <span class="eyebrow">Product designer and developer</span>
              <h2>Designing clear interfaces and building seamless product stories.</h2>
              <p>${escapeHtml(data.profile?.aboutMe)}</p>
              <div class="stats-row">
                ${stats.map((item) => `<div class="stat-pill"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`).join("")}
              </div>
            </div>
            <img src="${escapeHtml(safeUrl(data.profile?.profilePicture))}" alt="${escapeHtml(data.profile?.name)}" />
          </section>
          <section class="service-grid">
            ${featuredSkills
              .map(
                (skill) => `
                  <article class="service-card">
                    <span class="eyebrow">Service</span>
                    <h3>${escapeHtml(skill)}</h3>
                    <p>Applied with strong visual judgment, product thinking, and implementation discipline.</p>
                  </article>
                `
              )
              .join("")}
          </section>
          <section class="project-grid">${renderProjectCards(data.projects)}</section>
          <section class="story-grid">
            <div class="content-card">
              <span class="eyebrow">Experience</span>
              <h2>Professional journey</h2>
              <div class="signal-list">${renderExperienceItems(data.experience)}</div>
            </div>
            <div class="content-card">
              <span class="eyebrow">Education</span>
              <h2>Foundations</h2>
              <div class="signal-list">${renderEducationItems(data.education)}</div>
            </div>
          </section>
        </section>
      </main>
    </div>
  `;
}

function renderTemplateThree(data) {
  return `
    <div class="template-root template-three">
      <main class="template-shell">
        <section class="hero">
          <div>
            <span class="eyebrow">Curated portfolio</span>
            <h1>${escapeHtml(data.profile?.name)}</h1>
            <p class="role">${escapeHtml(getPrimaryRole(data))}</p>
            <p>${escapeHtml(data.profile?.aboutMe)}</p>
            <div class="hero-actions">
              ${renderLink("Website", data.socialLinks?.website)}
              ${renderLink("LinkedIn", data.socialLinks?.linkedin)}
            </div>
          </div>
          <img src="${escapeHtml(safeUrl(data.profile?.profilePicture))}" alt="${escapeHtml(data.profile?.name)}" />
        </section>
        <section class="skills-band">
          <span class="eyebrow">Capabilities</span>
          <div class="chip-row">${renderSkillChips(data.skills)}</div>
        </section>
        <section class="project-strip">${renderProjectCards(data.projects)}</section>
        <section class="columns">
          <div class="content-card">
            <span class="eyebrow">Experience</span>
            <h2>Selected roles</h2>
            <div class="signal-list">${renderExperienceItems(data.experience)}</div>
          </div>
          <div class="content-card">
            <span class="eyebrow">Education</span>
            <h2>Training</h2>
            <div class="signal-list">${renderEducationItems(data.education)}</div>
          </div>
          <div class="content-card">
            <span class="eyebrow">Contact</span>
            <h2>Reach out</h2>
            ${renderContactList(data.contactInfo)}
            <div class="social-row">${renderSocialLinks(data.socialLinks)}</div>
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderTemplateFour(data) {
  const stats = getStats(data);

  return `
    <div class="template-root template-four">
      <main class="template-shell">
        <aside class="side">
          <span class="eyebrow">Signal</span>
          <h1>${escapeHtml(data.profile?.name)}</h1>
          <p>${escapeHtml(getPrimaryRole(data))}</p>
          <div class="side-nav">
            <span>Overview</span>
            <span>Projects</span>
            <span>Experience</span>
            <span>Contact</span>
          </div>
          <div class="side-section">
            <span class="eyebrow">Network</span>
            <div class="social-row">${renderSocialLinks(data.socialLinks)}</div>
          </div>
          <div class="side-section">
            <span class="eyebrow">Contact</span>
            ${renderContactList(data.contactInfo)}
          </div>
        </aside>
        <section class="main">
          <section class="hero">
            <span class="eyebrow">Tech-forward portfolio</span>
            <h2>Product-focused interfaces built with precision, speed, and a strong visual system.</h2>
            <p>${escapeHtml(data.profile?.aboutMe)}</p>
            <div class="hero-actions">
              ${renderLink("View Website", data.socialLinks?.website)}
              ${renderLink("Send Email", `mailto:${data.contactInfo?.email || ""}`)}
            </div>
          </section>
          <section class="dashboard-grid">
            <div class="signal-card">
              <span class="eyebrow">Metrics</span>
              <div class="stats-row">
                ${stats.map((item) => `<div class="stat-pill"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`).join("")}
              </div>
            </div>
            <div class="signal-card">
              <span class="eyebrow">Skill stack</span>
              <div class="chip-row">${renderSkillChips(data.skills)}</div>
            </div>
          </section>
          <section class="project-grid">${renderProjectCards(data.projects)}</section>
          <section class="bottom-grid">
            <div class="content-card">
              <span class="eyebrow">Experience</span>
              <div class="signal-list">${renderExperienceItems(data.experience)}</div>
            </div>
            <div class="content-card">
              <span class="eyebrow">Education</span>
              <div class="signal-list">${renderEducationItems(data.education)}</div>
            </div>
            <div class="content-card">
              <span class="eyebrow">Focus</span>
              <h2>What I optimise for</h2>
              <p>Clarity, interface rhythm, fast execution, and portfolios that convert curiosity into real conversations.</p>
              <div class="chip-row">${renderSkillChips(data.skills?.slice(0, 4))}</div>
            </div>
          </section>
        </section>
      </main>
    </div>
  `;
}

export function getTemplateOptions() {
  return Object.entries(templateDefinitions).map(([id, theme]) => ({
    id,
    label: theme.label,
    description: theme.description,
    mood: theme.mood
  }));
}

export function buildPortfolioHtml(data, templateId = "template1") {
  const theme = templateDefinitions[templateId] || templateDefinitions.template1;
  const payload = {
    templateId,
    portfolioData: data
  };
  const payloadText = JSON.stringify(payload, null, 2).replace(/</g, "\\u003c");

  const templateMarkup =
    templateId === "template2"
      ? renderTemplateTwo(data)
      : templateId === "template3"
        ? renderTemplateThree(data)
        : templateId === "template4"
          ? renderTemplateFour(data)
          : renderTemplateOne(data, theme);

  const templateStyles =
    templateId === "template2"
      ? buildTemplateTwoStyles(theme)
      : templateId === "template3"
        ? buildTemplateThreeStyles(theme)
        : templateId === "template4"
          ? buildTemplateFourStyles(theme)
          : buildTemplateOneStyles(theme);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="pb-template" content="${templateId}" />
    <title>${escapeHtml(data.title || data.profile?.name || "Portfolio")}</title>
    <style>${buildBaseStyles(theme)}${templateStyles}</style>
  </head>
  <body>
    <script id="pb-data" type="application/json">${payloadText}</script>
    ${templateMarkup}
  </body>
</html>`;
}

export function extractPortfolioPayload(htmlCode) {
  if (!htmlCode) {
    return null;
  }

  const templateMatch = htmlCode.match(/<meta name="pb-template" content="([^"]+)"/);
  const dataMatch = htmlCode.match(/<script id="pb-data" type="application\/json">([\s\S]*?)<\/script>/);

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
