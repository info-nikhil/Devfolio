const { sendContactEmail } = require("../services/emailService");

async function submitContact(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    await sendContactEmail({ name, email, message });
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  submitContact
};
