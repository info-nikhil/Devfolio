import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format((amount || 0) / 100);
}

function DashboardPage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [portfolioRes, subscriptionRes, paymentRes] = await Promise.all([
          apiClient.get("/portfolios/my"),
          apiClient.get("/subscriptions/me"),
          apiClient.get("/payments/my")
        ]);

        setPortfolios(portfolioRes.data.portfolios || []);
        setSubscriptions(subscriptionRes.data.subscriptions || []);
        setPayments(paymentRes.data.payments || []);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const currentSubscription = useMemo(
    () => subscriptions.find((item) => item.status === "active") || subscriptions[0],
    [subscriptions]
  );

  const totalRevenue = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  );

  if (loading) {
    return <div className="page-center">Loading dashboard...</div>;
  }

  return (
    <div className="content-wrap page-shell">
      <section className="dashboard-hero glass-card">
        <div>
          <p className="kicker">Workspace overview</p>
          <h1>{user?.name}, your portfolio studio is ready.</h1>
          <p>
            Track what you have already built, keep an eye on subscriptions and payments, and jump straight back into
            editing when inspiration strikes.
          </p>
        </div>
        <div className="dashboard-hero-actions">
          <Link to="/builder" className="btn btn-primary">
            New Portfolio
          </Link>
          <Link to="/plans" className="btn btn-outline">
            Manage Plan
          </Link>
        </div>
      </section>

      {error && <p className="status-banner">{error}</p>}

      <section className="dashboard-stats-grid">
        <article className="glass-card stat-card">
          <span className="stat-label">Portfolios</span>
          <strong>{portfolios.length}</strong>
          <p>Saved projects available for editing and deployment.</p>
        </article>
        <article className="glass-card stat-card">
          <span className="stat-label">Active plan</span>
          <strong>{currentSubscription?.plan || "None"}</strong>
          <p>{currentSubscription?.status ? `Status: ${currentSubscription.status}` : "Upgrade to unlock more."}</p>
        </article>
        <article className="glass-card stat-card">
          <span className="stat-label">Payments</span>
          <strong>{payments.length}</strong>
          <p>{totalRevenue ? `${formatCurrency(totalRevenue)} processed so far.` : "No payment history yet."}</p>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="glass-card dashboard-panel wide">
          <div className="panel-head">
            <div>
              <p className="kicker">My portfolios</p>
              <h2>Recent workspaces</h2>
            </div>
            <Link to="/builder" className="panel-link">
              Open builder
            </Link>
          </div>
          {portfolios.length === 0 ? (
            <div className="empty-card">
              <h3>No portfolios yet</h3>
              <p>Create your first workspace and start shaping your profile, projects, and contact sections.</p>
            </div>
          ) : (
            <div className="portfolio-list-grid">
              {portfolios.map((portfolio) => (
                <article key={portfolio._id} className="portfolio-tile">
                  <div className="portfolio-tile-top">
                    <span className="user-chip">{portfolio.templateId}</span>
                    <span className={`status-pill ${portfolio.isPublished ? "live" : "draft"}`}>
                      {portfolio.isPublished ? "Live" : "Draft"}
                    </span>
                  </div>
                  <h3>{portfolio.title}</h3>
                  <p>{portfolio.profile?.aboutMe || portfolio.profile?.name || "Portfolio workspace"}</p>
                  <div className="portfolio-tile-actions">
                    <Link to={`/builder/${portfolio._id}`} className="btn btn-outline btn-small">
                      Edit
                    </Link>
                    {portfolio.deployUrl && (
                      <a href={portfolio.deployUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-small">
                        Visit
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="glass-card dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="kicker">Subscription</p>
              <h2>Current access</h2>
            </div>
          </div>
          <div className="info-stack">
            <div className="info-row">
              <span>Plan</span>
              <strong>{currentSubscription?.plan || "No active plan"}</strong>
            </div>
            <div className="info-row">
              <span>Status</span>
              <strong>{currentSubscription?.status || "inactive"}</strong>
            </div>
            <div className="info-row">
              <span>Valid till</span>
              <strong>
                {currentSubscription?.endsAt ? new Date(currentSubscription.endsAt).toLocaleDateString() : "-"}
              </strong>
            </div>
          </div>
        </article>

        <article className="glass-card dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="kicker">Payment history</p>
              <h2>Latest activity</h2>
            </div>
          </div>
          {payments.length === 0 ? (
            <p className="muted-text">No payment events yet.</p>
          ) : (
            <div className="activity-list">
              {payments.slice(0, 4).map((payment) => (
                <div key={payment._id} className="activity-item">
                  <div>
                    <strong>{formatCurrency(payment.amount || 0)}</strong>
                    <p>{payment.status || "pending"}</p>
                  </div>
                  <span>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-"}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;
