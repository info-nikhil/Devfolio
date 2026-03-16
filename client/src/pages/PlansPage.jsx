import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

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

  const currentSubscription = subscriptions.find((item) => item.status === "active");

  return (
    <div className="content-wrap page-block">
      <h1>Subscription Plans</h1>
      <p>Choose a plan based on your needs. Payment activation is done after webhook verification.</p>

      {currentSubscription && (
        <div className="panel">
          <p>
            Active Plan: <strong>{currentSubscription.plan}</strong>
          </p>
          <p>
            Valid Till:{" "}
            <strong>{currentSubscription.endsAt ? new Date(currentSubscription.endsAt).toLocaleDateString() : "-"}</strong>
          </p>
        </div>
      )}

      <section className="plans-grid">
        {plans.map((plan) => (
          <article key={plan.key} className="panel plan-card">
            <h3>{plan.label}</h3>
            <p className="price">{plan.amount === 0 ? "Free" : `INR ${(plan.amount / 100).toFixed(0)} / month`}</p>
            <ul>
              <li>Template access</li>
              <li>Portfolio deployment</li>
              <li>Dashboard insights</li>
            </ul>
            <button className="btn" disabled={loadingPlan === plan.key} onClick={() => handleSelectPlan(plan.key)}>
              {loadingPlan === plan.key ? "Processing..." : `Choose ${plan.label}`}
            </button>
          </article>
        ))}
      </section>

      {status && <p className="status-text">{status}</p>}
    </div>
  );
}

export default PlansPage;
