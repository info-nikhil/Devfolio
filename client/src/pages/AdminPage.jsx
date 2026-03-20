import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import apiClient from "../api/client";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format((amount || 0) / 100);
}

function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await apiClient.get("/admin/analytics");
        setAnalytics(response.data);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const ratioChartData = useMemo(() => {
    if (!analytics) {
      return null;
    }

    return {
      labels: ["Student", "Professional"],
      datasets: [
        {
          data: [analytics.stats.studentUsers, analytics.stats.professionalUsers],
          backgroundColor: ["#39d0a4", "#ff7a33"],
          borderWidth: 0
        }
      ]
    };
  }, [analytics]);

  const revenueChartData = useMemo(() => {
    if (!analytics) {
      return null;
    }

    const labels = analytics.revenue.monthlyRevenue.map((item) => `${item._id.month}/${item._id.year}`);
    const values = analytics.revenue.monthlyRevenue.map((item) => Math.round(item.totalRevenue / 100));

    return {
      labels,
      datasets: [
        {
          label: "Revenue (INR)",
          data: values,
          borderColor: "#ff7a33",
          backgroundColor: "rgba(255, 122, 51, 0.18)",
          fill: true,
          tension: 0.35
        }
      ]
    };
  }, [analytics]);

  const totalRevenue = useMemo(
    () => analytics?.revenue?.monthlyRevenue?.reduce((sum, item) => sum + Number(item.totalRevenue || 0), 0) || 0,
    [analytics]
  );

  if (loading) {
    return <div className="page-center">Loading analytics...</div>;
  }

  if (error) {
    return <div className="page-center">{error}</div>;
  }

  return (
    <div className="content-wrap page-shell">
      <section className="admin-hero glass-card">
        <div>
          <p className="kicker">Admin analytics</p>
          <h1>Track usage, subscriptions, and revenue in one control room.</h1>
          <p>Use this dashboard to spot adoption trends, compare audience types, and measure paid growth over time.</p>
        </div>
        <div className="admin-hero-summary">
          <span className="user-chip">Realtime overview</span>
          <strong>{formatCurrency(totalRevenue)}</strong>
          <small>Total recorded revenue</small>
        </div>
      </section>

      <section className="dashboard-stats-grid">
        <article className="glass-card stat-card">
          <span className="stat-label">Total users</span>
          <strong>{analytics?.stats.totalUsers || 0}</strong>
          <p>All registered accounts across roles.</p>
        </article>
        <article className="glass-card stat-card">
          <span className="stat-label">Active subscriptions</span>
          <strong>{analytics?.stats.activeSubscriptions || 0}</strong>
          <p>Users currently on an active subscription cycle.</p>
        </article>
        <article className="glass-card stat-card">
          <span className="stat-label">Student ratio</span>
          <strong>{analytics?.stats.studentUsers || 0}</strong>
          <p>Accounts categorized under student profiles.</p>
        </article>
        <article className="glass-card stat-card">
          <span className="stat-label">Professional ratio</span>
          <strong>{analytics?.stats.professionalUsers || 0}</strong>
          <p>Professionals and freelancers using the builder.</p>
        </article>
      </section>

      <section className="chart-grid">
        <article className="glass-card chart-card wide">
          <div className="panel-head">
            <div>
              <p className="kicker">Revenue</p>
              <h2>Monthly earnings</h2>
            </div>
          </div>
          {revenueChartData?.labels.length ? <Line data={revenueChartData} /> : <p>No revenue data yet.</p>}
        </article>
        <article className="glass-card chart-card">
          <div className="panel-head">
            <div>
              <p className="kicker">Audience mix</p>
              <h2>Student vs professional</h2>
            </div>
          </div>
          {ratioChartData ? <Doughnut data={ratioChartData} /> : <p>No ratio data available.</p>}
        </article>
      </section>
    </div>
  );
}

export default AdminPage;
