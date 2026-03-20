import { useState } from "react";
import apiClient from "../api/client";

const contactHighlights = [
  {
    title: "Product feedback",
    text: "Share missing features, builder friction, or template ideas you want added next."
  },
  {
    title: "Local setup help",
    text: "Use this when auth, SMTP, or MongoDB are blocking your localhost development flow."
  },
  {
    title: "Design requests",
    text: "Tell us the visual direction you want and we can reshape the portfolio experience around it."
  }
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const response = await apiClient.post("/contact", form);
      setStatus(response.data.message || "Message sent");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-wrap page-shell">
      <section className="contact-shell">
        <div className="contact-copy glass-card">
          <p className="kicker">Contact</p>
          <h1>Send product questions, builder feedback, or design requests.</h1>
          <p>
            If you are working locally and something feels off, send the problem along with what you expected to happen.
            That gives us the clearest path to fixing it quickly.
          </p>

          <div className="contact-highlight-list">
            {contactHighlights.map((item) => (
              <article key={item.title} className="contact-highlight-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <form className="contact-form glass-card form-grid" onSubmit={handleSubmit}>
          <div className="panel-head">
            <div>
              <p className="kicker">Message us</p>
              <h2>We read detailed bug reports and feature requests.</h2>
            </div>
          </div>
          <label>
            Name
            <input type="text" required placeholder="Your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label>
            Message
            <textarea
              rows={8}
              required
              placeholder="Tell us what you were trying to do, what happened, and what you expected."
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
            />
          </label>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
          {status && <p className="status-banner">{status}</p>}
        </form>
      </section>
    </div>
  );
}

export default ContactPage;
