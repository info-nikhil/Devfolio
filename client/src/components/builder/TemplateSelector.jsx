import { getTemplateOptions } from "../../templates/templateEngine";

function TemplateSelector({ selectedTemplate, onSelectTemplate }) {
  const templates = getTemplateOptions();

  return (
    <div className="template-switcher">
      <span className="small-label">Templates</span>
      <div className="template-grid">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`template-btn ${selectedTemplate === template.id ? "active" : ""}`}
            onClick={() => onSelectTemplate(template.id)}
          >
            {template.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TemplateSelector;
