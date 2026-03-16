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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
          backgroundColor: ["#0f766e", "#c2410c"],
          borderWidth: 1
        }
      ]
    };
  }, [analytics]);

  const revenueChartData = useMemo(() => {
    if (!analytics) {
      return null;
    }

    const labels = analytics.revenue.monthlyRevenue.map((item) => `${item._id.month}/${item._id.year}`);
    const values = analytics.revenue.monthlyRevenue.map((item) => (item.totalRevenue / 100).toFixed(2));

    return {
      labels,
      datasets: [
        {
          label: "Revenue (INR)",
          data: values,
          borderColor: "#0369a1",
          backgroundColor: "rgba(3, 105, 161, 0.18)",
          fill: true,
          tension: 0.3
        }
      ]
    };
  }, [analytics]);

  if (loading) {
    return <div className="page-center">Loading analytics...</div>;
  }

  if (error) {
    return <div className="page-center">{error}</div>;
  }

  return (
    <div className="content-wrap page-block">
      <h1>Admin Dashboard</h1>

      <section className="stats-grid">
        <article className="panel stat-card">
          <h3>Total Users</h3>
          <p>{analytics?.stats.totalUsers || 0}</p>
        </article>
        <article className="panel stat-card">
          <h3>Active Subscriptions</h3>
          <p>{analytics?.stats.activeSubscriptions || 0}</p>
        </article>
        <article className="panel stat-card">
          <h3>Students</h3>
          <p>{analytics?.stats.studentUsers || 0}</p>
        </article>
        <article className="panel stat-card">
          <h3>Professionals</h3>
          <p>{analytics?.stats.professionalUsers || 0}</p>
        </article>
      </section>

      <section className="chart-grid">
        <article className="panel">
          <h2>Revenue Analytics</h2>
          {revenueChartData?.labels.length ? <Line data={revenueChartData} /> : <p>No revenue data yet.</p>}
        </article>
        <article className="panel">
          <h2>Student vs Professional Ratio</h2>
          {ratioChartData ? <Doughnut data={ratioChartData} /> : <p>No ratio data available.</p>}
        </article>
      </section>
    </div>
  );
}

export default AdminPage;
