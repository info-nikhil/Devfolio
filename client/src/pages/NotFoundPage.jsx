import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="not-found-shell">
      <div className="glass-card not-found-card">
        <span className="error-code">404</span>
        <h1>That page drifted out of the layout.</h1>
        <p>The route you asked for is not mapped right now. Jump back to the home page or continue inside the builder.</p>
        <div className="cta-band-actions">
          <Link className="btn btn-primary" to="/">
            Go Home
          </Link>
          <Link className="btn btn-ghost" to="/builder">
            Open Builder
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
