import { Link } from "react-router-dom";

function Footer() {
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
            <h4>Local Dev</h4>
            <p>Frontend: localhost:5173</p>
            <p>Backend: localhost:5000</p>
            <p>Design mode: enabled</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
