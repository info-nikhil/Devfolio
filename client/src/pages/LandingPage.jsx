import { Link } from "react-router-dom";

const featureCards = [
  {
    title: "Dual-mode builder",
    copy: "Shape your portfolio with guided forms, then drop into raw HTML, CSS, and JS when you want complete control."
  },
  {
    title: "Studio-grade templates",
    copy: "Switch between dark, editorial, and cinematic portfolio systems without rebuilding your content from scratch."
  },
  {
    title: "Launch-ready workflow",
    copy: "Draft, preview, export PDF, and deploy from one workspace built for iteration instead of busywork."
  }
];

const workflow = [
  "Start from a premium template and populate your profile, projects, and experience.",
  "Refine the presentation inside the live preview or take over with the Monaco code editor.",
  "Save versions, export a shareable PDF, and publish when the portfolio is client-ready."
];

const showcaseCards = [
  { label: "Cinematic dark", accent: "orange" },
  { label: "Emerald editorial", accent: "green" },
  { label: "Minimal gallery", accent: "sand" },
  { label: "Signal tech", accent: "blue" }
];

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-banner">
        <div className="content-wrap hero-shell">
          <div className="hero-copy">
            <p className="kicker">Portfolio platform for developers, designers, and freelancers</p>
            <h1>Design a portfolio that feels intentional before it ever goes live.</h1>
            <p className="hero-text">
              Portfolio Builder gives you a polished workspace for writing your story, shaping the layout, and
              previewing each section in real time. It is fast enough for iteration and visual enough for real client work.
            </p>

            <div className="hero-cta-row">
              <Link to="/auth" className="btn btn-primary">
                Start Building
              </Link>
              <Link to="/plans" className="btn btn-outline">
                Explore Plans
              </Link>
            </div>

            <div className="hero-metrics">
              <div className="metric-card">
                <strong>4</strong>
                <span>Premium portfolio systems</span>
              </div>
              <div className="metric-card">
                <strong>2</strong>
                <span>Editing modes that stay in sync</span>
              </div>
              <div className="metric-card">
                <strong>1</strong>
                <span>Workspace for design, code, and deployment</span>
              </div>
            </div>
          </div>

          <div className="hero-showcase glass-card">
            <div className="showcase-topline">
              <span>Live creative workspace</span>
              <strong>Builder Preview</strong>
            </div>

            <div className="showcase-board">
              <div className="showcase-panel showcase-primary">
                <span className="mini-kicker">Midnight Ember</span>
                <h3>Bold hero sections, case studies, timelines, and contact blocks.</h3>
                <div className="stack-badges">
                  <span>Preview</span>
                  <span>Code</span>
                  <span>Deploy</span>
                </div>
              </div>
              <div className="showcase-side-grid">
                <div className="showcase-mini stat">
                  <strong>Realtime</strong>
                  <span>form to code sync</span>
                </div>
                <div className="showcase-mini accent">
                  <strong>Builder</strong>
                  <span>Monaco powered</span>
                </div>
                <div className="showcase-mini wide">
                  <div className="showcase-card-row">
                    {showcaseCards.map((card) => (
                      <span key={card.label} className={`showcase-pill ${card.accent}`}>
                        {card.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell content-wrap">
        <div className="section-heading-block">
          <p className="kicker">What makes it useful</p>
          <h2>A stronger workflow than a generic template form.</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article key={feature.title} className="glass-card feature-card">
              <span className="feature-index">0{featureCards.indexOf(feature) + 1}</span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell content-wrap split-section">
        <div className="glass-card narrative-card">
          <p className="kicker">Workflow</p>
          <h2>From rough content to a portfolio you would actually be proud to send.</h2>
          <div className="process-grid">
            {workflow.map((step, index) => (
              <div key={step} className="process-card">
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card testimonial-card">
          <p className="kicker">Why teams like it</p>
          <blockquote>
            "The builder feels less like a form and more like a real creative desk. You can stay visual until you want to go deep."
          </blockquote>
          <div className="testimonial-meta">
            <strong>Studio-minded workflow</strong>
            <span>Built for designers, developers, and consultants</span>
          </div>
        </div>
      </section>

      <section className="section-shell content-wrap">
        <div className="cta-band glass-card">
          <div>
            <p className="kicker">Ready to build locally</p>
            <h2>Use localhost first, refine the experience, and deploy only when the product feels right.</h2>
          </div>
          <div className="cta-band-actions">
            <Link to="/builder" className="btn btn-primary">
              Open Builder
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
