import { Link } from "react-router-dom";

function Footer() {
  const deploymentMode =
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
      ? "Single-origin Vercel deployment"
      : "Local development";

  return (
    <footer className="site-footer">
      <div className="content-wrap footer-shell">
        <div className="footer-brand-block">
          <div className="footer-brand">
            <span className="brand-mark">PB</span>
            <div>
              <strong>Portfolio Builder SaaS</strong>
              <p>Build, refine, and present your best work with a studio-grade creator workflow.</p>
            </div>
          </div>
        </div>

        <div className="footer-links-grid">
          <div>
            <h4>Product</h4>
            <Link to="/">Home</Link>
            <Link to="/plans">Plans</Link>
            <Link to="/builder">Builder</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/admin">Admin</Link>
          </div>
          <div>
            <h4>Environment</h4>
            <p>{deploymentMode}</p>
            <p>Frontend routes are SPA-safe on Vercel</p>
            <p>API defaults to same-origin in production</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
