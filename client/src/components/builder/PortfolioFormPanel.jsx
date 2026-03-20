const emptyProject = {
  title: "",
  description: "",
  demoLink: "",
  repoLink: ""
};

const emptyExperience = {
  role: "",
  company: "",
  description: "",
  startDate: "",
  endDate: ""
};

const emptyEducation = {
  institution: "",
  degree: "",
  description: "",
  startYear: "",
  endYear: ""
};

function SectionHeading({ title, text }) {
  return (
    <div className="section-heading">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function PortfolioFormPanel({ data, onChange }) {
  function updateTopLevel(field, value) {
    onChange({ ...data, [field]: value });
  }

  function updateProfile(field, value) {
    onChange({
      ...data,
      profile: {
        ...data.profile,
        [field]: value
      }
    });
  }

  function updateSocial(field, value) {
    onChange({
      ...data,
      socialLinks: {
        ...data.socialLinks,
        [field]: value
      }
    });
  }

  function updateContact(field, value) {
    onChange({
      ...data,
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  }

  function updateSkills(value) {
    const skills = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    onChange({ ...data, skills });
  }

  function updateArrayItem(section, index, field, value) {
    const nextArray = data[section].map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    onChange({ ...data, [section]: nextArray });
  }

  function addArrayItem(section) {
    const defaultItem = section === "projects" ? emptyProject : section === "experience" ? emptyExperience : emptyEducation;
    onChange({
      ...data,
      [section]: [...data[section], defaultItem]
    });
  }

  function removeArrayItem(section, index) {
    onChange({
      ...data,
      [section]: data[section].filter((_, itemIndex) => itemIndex !== index)
    });
  }

  return (
    <div className="form-panel glass-card">
      <div className="form-panel-header">
        <span className="small-label">Content editor</span>
        <h2>Portfolio Editor</h2>
        <p>Feed the templates with strong content first. The layout system will handle presentation on the preview side.</p>
      </div>

      <section className="form-section">
        <SectionHeading title="Basic Info" text="Set the title, identity, portrait, and summary that define the hero section." />
        <label>
          Portfolio Title
          <input type="text" value={data.title} onChange={(event) => updateTopLevel("title", event.target.value)} />
        </label>
        <label>
          Name
          <input type="text" value={data.profile.name} onChange={(event) => updateProfile("name", event.target.value)} />
        </label>
        <label>
          Profile Picture URL
          <input type="text" value={data.profile.profilePicture} onChange={(event) => updateProfile("profilePicture", event.target.value)} />
        </label>
        <label>
          About Me
          <textarea rows={4} value={data.profile.aboutMe} onChange={(event) => updateProfile("aboutMe", event.target.value)} />
        </label>
      </section>

      <section className="form-section">
        <SectionHeading title="Skills" text="Use comma-separated skills. These power chips, service cards, and credibility bands." />
        <label>
          Skills
          <input type="text" value={data.skills.join(", ")} onChange={(event) => updateSkills(event.target.value)} />
        </label>
      </section>

      <section className="form-section">
        <SectionHeading title="Projects" text="Each project becomes a case-study card with live demo and repository links." />
        {data.projects.map((project, index) => (
          <div key={`${project.title}-${index}`} className="repeat-card">
            <div className="repeat-card-header">
              <strong>Project {index + 1}</strong>
              <button type="button" className="btn btn-danger btn-small" onClick={() => removeArrayItem("projects", index)}>
                Remove
              </button>
            </div>
            <label>
              Project Title
              <input type="text" value={project.title} onChange={(event) => updateArrayItem("projects", index, "title", event.target.value)} />
            </label>
            <label>
              Description
              <textarea rows={3} value={project.description} onChange={(event) => updateArrayItem("projects", index, "description", event.target.value)} />
            </label>
            <label>
              Live Demo Link
              <input type="text" value={project.demoLink} onChange={(event) => updateArrayItem("projects", index, "demoLink", event.target.value)} />
            </label>
            <label>
              GitHub Repo Link
              <input type="text" value={project.repoLink} onChange={(event) => updateArrayItem("projects", index, "repoLink", event.target.value)} />
            </label>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={() => addArrayItem("projects")}>
          Add Project
        </button>
      </section>

      <section className="form-section">
        <SectionHeading title="Experience" text="Roles and companies feed timelines, highlight lists, and proof-of-work sections." />
        {data.experience.map((item, index) => (
          <div key={`${item.role}-${index}`} className="repeat-card">
            <div className="repeat-card-header">
              <strong>Experience {index + 1}</strong>
              <button type="button" className="btn btn-danger btn-small" onClick={() => removeArrayItem("experience", index)}>
                Remove
              </button>
            </div>
            <label>
              Role
              <input type="text" value={item.role} onChange={(event) => updateArrayItem("experience", index, "role", event.target.value)} />
            </label>
            <label>
              Company
              <input type="text" value={item.company} onChange={(event) => updateArrayItem("experience", index, "company", event.target.value)} />
            </label>
            <label>
              Start Date
              <input type="text" value={item.startDate} onChange={(event) => updateArrayItem("experience", index, "startDate", event.target.value)} />
            </label>
            <label>
              End Date
              <input type="text" value={item.endDate} onChange={(event) => updateArrayItem("experience", index, "endDate", event.target.value)} />
            </label>
            <label>
              Description
              <textarea rows={3} value={item.description} onChange={(event) => updateArrayItem("experience", index, "description", event.target.value)} />
            </label>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={() => addArrayItem("experience")}>
          Add Experience
        </button>
      </section>

      <section className="form-section">
        <SectionHeading title="Education" text="Use this for degrees, bootcamps, or certifications that support your story." />
        {data.education.map((item, index) => (
          <div key={`${item.institution}-${index}`} className="repeat-card">
            <div className="repeat-card-header">
              <strong>Education {index + 1}</strong>
              <button type="button" className="btn btn-danger btn-small" onClick={() => removeArrayItem("education", index)}>
                Remove
              </button>
            </div>
            <label>
              Institution
              <input type="text" value={item.institution} onChange={(event) => updateArrayItem("education", index, "institution", event.target.value)} />
            </label>
            <label>
              Degree
              <input type="text" value={item.degree} onChange={(event) => updateArrayItem("education", index, "degree", event.target.value)} />
            </label>
            <label>
              Start Year
              <input type="text" value={item.startYear} onChange={(event) => updateArrayItem("education", index, "startYear", event.target.value)} />
            </label>
            <label>
              End Year
              <input type="text" value={item.endYear} onChange={(event) => updateArrayItem("education", index, "endYear", event.target.value)} />
            </label>
            <label>
              Description
              <textarea rows={3} value={item.description} onChange={(event) => updateArrayItem("education", index, "description", event.target.value)} />
            </label>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={() => addArrayItem("education")}>
          Add Education
        </button>
      </section>

      <section className="form-section">
        <SectionHeading title="Social Links" text="These power social rails, CTA buttons, and external proof points." />
        <label>
          GitHub
          <input type="text" value={data.socialLinks.github} onChange={(event) => updateSocial("github", event.target.value)} />
        </label>
        <label>
          LinkedIn
          <input type="text" value={data.socialLinks.linkedin} onChange={(event) => updateSocial("linkedin", event.target.value)} />
        </label>
        <label>
          Twitter
          <input type="text" value={data.socialLinks.twitter} onChange={(event) => updateSocial("twitter", event.target.value)} />
        </label>
        <label>
          Website
          <input type="text" value={data.socialLinks.website} onChange={(event) => updateSocial("website", event.target.value)} />
        </label>
      </section>

      <section className="form-section">
        <SectionHeading title="Contact Info" text="Email, phone, and location appear in the final contact or footer section." />
        <label>
          Email
          <input type="text" value={data.contactInfo.email} onChange={(event) => updateContact("email", event.target.value)} />
        </label>
        <label>
          Phone
          <input type="text" value={data.contactInfo.phone} onChange={(event) => updateContact("phone", event.target.value)} />
        </label>
        <label>
          Location
          <input type="text" value={data.contactInfo.location} onChange={(event) => updateContact("location", event.target.value)} />
        </label>
      </section>
    </div>
  );
}

export default PortfolioFormPanel;
