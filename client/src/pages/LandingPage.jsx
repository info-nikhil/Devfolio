import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing">
      <section className="hero-banner">
        <div className="content-wrap hero-grid">
          <div>
            <p className="eyebrow">Portfolio SaaS Platform</p>
            <h1>Build and deploy your portfolio with live editing and templates.</h1>
            <p className="hero-text">
              Create a modern portfolio, switch between templates, edit source code in Monaco, and deploy on Vercel
              in one flow.
            </p>
            <div className="hero-cta">
              <Link to="/auth" className="btn">
                Get Started
              </Link>
              <Link to="/plans" className="btn btn-outline">
                View Plans
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <h3>What you get</h3>
            <ul>
              <li>OTP + Google authentication</li>
              <li>Split-screen portfolio builder</li>
              <li>4 dynamic templates</li>
              <li>Razorpay subscriptions</li>
              <li>Admin analytics dashboard</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
