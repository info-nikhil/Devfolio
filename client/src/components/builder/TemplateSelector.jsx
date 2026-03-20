import { getTemplateOptions } from "../../templates/templateEngine";

function TemplateSelector({ selectedTemplate, onSelectTemplate }) {
  const templates = getTemplateOptions();

  return (
    <div className="template-switcher">
      <div className="template-switcher-head">
        <div>
          <span className="small-label">Template gallery</span>
          <h3>Choose a visual system</h3>
        </div>
        <p>Switch instantly while keeping the same portfolio content and code payload.</p>
      </div>

      <div className="template-gallery">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`template-choice ${selectedTemplate === template.id ? "active" : ""}`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <span className={`template-preview ${template.id}`}></span>
            <span className="template-choice-copy">
              <strong>{template.label}</strong>
              <small>{template.description}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TemplateSelector;
