import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const planDetails = {
  free: {
    eyebrow: "Starter",
    summary: "Perfect for early experimentation and testing the builder locally.",
    highlights: ["Single portfolio workspace", "Basic template access", "Manual editing support"]
  },
  student: {
    eyebrow: "Best for students",
    summary: "A sharper plan for internships, placements, and first client-facing portfolio launches.",
    highlights: ["Multiple saves", "Template switching", "Premium builder workflow"]
  },
  professional: {
    eyebrow: "Best for freelancers",
    summary: "Use the full workspace to present polished projects, close clients, and iterate quickly.",
    highlights: ["Priority workflow", "Advanced deployment usage", "Stronger template collection"]
  }
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PlansPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [status, setStatus] = useState("");
  const [loadingPlan, setLoadingPlan] = useState("");

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await apiClient.get("/subscriptions/plans");
        setPlans(response.data.plans || []);
      } catch (error) {
        setStatus(error.response?.data?.message || "Failed to load plans");
      }
    }

    loadPlans();
  }, []);

  useEffect(() => {
    async function loadSubscriptions() {
      if (!isAuthenticated) {
        setSubscriptions([]);
        return;
      }

      try {
        const response = await apiClient.get("/subscriptions/me");
        setSubscriptions(response.data.subscriptions || []);
      } catch (error) {
        setStatus(error.response?.data?.message || "Failed to load subscriptions");
      }
    }

    loadSubscriptions();
  }, [isAuthenticated]);

  async function handleSelectPlan(planKey) {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    setLoadingPlan(planKey);
    setStatus("");

    try {
      const response = await apiClient.post("/subscriptions/order", { plan: planKey });
      const { order, subscription, razorpayKeyId, message } = response.data;

      if (!order) {
        setStatus(message || "Plan activated");
        const updatedSubscription = await apiClient.get("/subscriptions/me");
        setSubscriptions(updatedSubscription.data.subscriptions || []);
        return;
      }

      const razorpayReady = await loadRazorpayScript();
      if (!razorpayReady) {
        setStatus("Unable to load Razorpay checkout");
        return;
      }

      const razorpayInstance = new window.Razorpay({
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "Portfolio Builder",
        description: `${planKey} subscription`,
        order_id: order.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || ""
        },
        handler: async function onPaymentSuccess(paymentResponse) {
          await apiClient.post("/subscriptions/confirm", {
            subscriptionId: subscription._id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id
          });
          setStatus("Payment completed. Subscription will activate after webhook verification.");
          const updatedSubscription = await apiClient.get("/subscriptions/me");
          setSubscriptions(updatedSubscription.data.subscriptions || []);
        }
      });

      razorpayInstance.open();
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to create subscription");
    } finally {
      setLoadingPlan("");
    }
  }

  const currentSubscription = useMemo(
    () => subscriptions.find((item) => item.status === "active") || subscriptions[0],
    [subscriptions]
  );

  return (
    <div className="content-wrap page-shell">
      <section className="plans-hero glass-card">
        <div>
          <p className="kicker">Pricing</p>
          <h1>Choose the plan that matches the way you want to present your work.</h1>
          <p>
            Start with the free workflow, move into student mode for stronger placement-ready portfolios, or unlock the
            professional setup when you need a more serious presentation layer.
          </p>
        </div>
        {currentSubscription && (
          <div className="subscription-spotlight">
            <span className="user-chip">Current</span>
            <strong>{currentSubscription.plan}</strong>
            <p>{currentSubscription.status}</p>
            <small>
              {currentSubscription.endsAt
                ? `Valid till ${new Date(currentSubscription.endsAt).toLocaleDateString()}`
                : "No end date available"}
            </small>
          </div>
        )}
      </section>

      <section className="plans-grid premium-grid">
        {plans.map((plan) => {
          const details = planDetails[plan.key] || planDetails.free;
          const isActive = currentSubscription?.plan === plan.key && currentSubscription?.status === "active";
          const priceText = plan.amount === 0 ? "Free" : `INR ${(plan.amount / 100).toFixed(0)} / month`;

          return (
            <article key={plan.key} className={`plan-showcase-card glass-card ${isActive ? "featured" : ""}`}>
              <div className="plan-showcase-top">
                <div>
                  <p className="kicker">{details.eyebrow}</p>
                  <h2>{plan.label}</h2>
                </div>
                {isActive && <span className="status-pill live">Active</span>}
              </div>
              <p className="price-mark">{priceText}</p>
              <p>{details.summary}</p>
              <ul className="plan-feature-list">
                {details.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <button className="btn btn-primary btn-block" disabled={loadingPlan === plan.key} onClick={() => handleSelectPlan(plan.key)}>
                {loadingPlan === plan.key ? "Processing..." : `Choose ${plan.label}`}
              </button>
            </article>
          );
        })}
      </section>

      <section className="faq-grid">
        <article className="glass-card faq-card">
          <h3>Do I need deployment first?</h3>
          <p>No. The builder is perfectly usable on localhost while you refine content and layout.</p>
        </article>
        <article className="glass-card faq-card">
          <h3>Can I change templates later?</h3>
          <p>Yes. Your portfolio data stays reusable, so the presentation layer can evolve without rewriting content.</p>
        </article>
        <article className="glass-card faq-card">
          <h3>Is Razorpay required in dev?</h3>
          <p>Only if you want to test the payment flow locally. You can keep building the rest without it.</p>
        </article>
      </section>

      {status && <p className="status-banner">{status}</p>}
    </div>
  );
}

export default PlansPage;
