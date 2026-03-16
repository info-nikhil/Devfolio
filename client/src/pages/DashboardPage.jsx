import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

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

  if (loading) {
    return <div className="page-center">Loading dashboard...</div>;
  }

  return (
    <div className="content-wrap page-block">
      <div className="dashboard-head">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back, <strong>{user?.name}</strong>.
          </p>
        </div>
        <Link to="/builder" className="btn">
          Create Portfolio
        </Link>
      </div>

      {error && <p className="status-text">{error}</p>}

      <section className="stats-grid">
        <article className="panel stat-card">
          <h3>Total Portfolios</h3>
          <p>{portfolios.length}</p>
        </article>
        <article className="panel stat-card">
          <h3>Subscriptions</h3>
          <p>{subscriptions.length}</p>
        </article>
        <article className="panel stat-card">
          <h3>Payments</h3>
          <p>{payments.length}</p>
        </article>
      </section>

      <section className="panel">
        <h2>My Portfolios</h2>
        {portfolios.length === 0 && <p>No portfolios created yet.</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Template</th>
                <th>Published</th>
                <th>Deploy URL</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((portfolio) => (
                <tr key={portfolio._id}>
                  <td>{portfolio.title}</td>
                  <td>{portfolio.templateId}</td>
                  <td>{portfolio.isPublished ? "Yes" : "No"}</td>
                  <td>
                    {portfolio.deployUrl ? (
                      <a href={portfolio.deployUrl} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <Link to={`/builder/${portfolio._id}`}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
