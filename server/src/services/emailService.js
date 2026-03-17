const nodemailer = require("nodemailer");

let transporter = null;

function readEnvValue(value) {
  return typeof value === "string" ? value.trim().replace(/^"(.*)"$/, "$1") : "";
}

function getSmtpConfig() {
  const smtpEmail = readEnvValue(process.env.SMTP_EMAIL);
  const smtpPassword = readEnvValue(process.env.SMTP_PASSWORD);

  return {
    smtpEmail,
    smtpPassword
  };
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { smtpEmail, smtpPassword } = getSmtpConfig();
  if (!smtpEmail || !smtpPassword) {
    console.warn("SMTP credentials are missing. Email sending is disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    auth: {
      user: smtpEmail,
      pass: smtpPassword
    }
  });

  return transporter;
}

async function sendOtpEmail({ email, name, otp, purpose }) {
  const mailer = getTransporter();
  if (!mailer) {
    throw new Error("SMTP is not configured. Add SMTP_EMAIL and SMTP_PASSWORD in server/.env.");
  }

  const subject =
    purpose === "email_verification" ? "Verify your email" : "Reset your password";
  const title =
    purpose === "email_verification" ? "Email Verification OTP" : "Password Reset OTP";

  try {
    const info = await mailer.sendMail({
      from: `"Portfolio Builder" <${readEnvValue(process.env.SMTP_EMAIL)}>`,
      to: email,
      subject,
      html: `
        <h2>${title}</h2>
        <p>Hello ${name || "User"},</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `
    });

    console.log(`OTP email sent successfully to ${email}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error.message);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
}

async function sendContactEmail({ name, email, message }) {
  const mailer = getTransporter();
  if (!mailer) {
    throw new Error("SMTP is not configured. Add SMTP_EMAIL and SMTP_PASSWORD in server/.env.");
  }

  const receiver = process.env.ADMIN_CONTACT_EMAIL || process.env.SMTP_EMAIL;
  try {
    const info = await mailer.sendMail({
      from: `"Portfolio Builder" <${readEnvValue(process.env.SMTP_EMAIL)}>`,
      to: receiver,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    console.log(`Contact email sent successfully. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Failed to send contact email:", error.message);
    throw new Error(`Failed to send contact email: ${error.message}`);
  }
}

module.exports = {
  sendOtpEmail,
  sendContactEmail
};
