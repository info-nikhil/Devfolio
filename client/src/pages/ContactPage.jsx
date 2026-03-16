import { useState } from "react";
import apiClient from "../api/client";

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
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
    <div className="content-wrap page-block">
      <h1>Contact</h1>
      <p>Have a feature request or support question? Send us a message.</p>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Message
          <textarea
            rows={6}
            required
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
          />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {status && <p className="status-text">{status}</p>}
    </div>
  );
}

export default ContactPage;
