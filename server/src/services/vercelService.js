const axios = require("axios");
const slugify = require("../utils/slugify");

async function deployStaticSite({ username, htmlContent }) {
  if (!process.env.VERCEL_TOKEN) {
    throw new Error("VERCEL_TOKEN is missing");
  }

  const usernameSlug = slugify(username) || "portfolio-user";
  const deploymentName = `${usernameSlug}-portfolio-${Date.now()}`;
  const url = process.env.VERCEL_TEAM_ID
    ? `https://api.vercel.com/v13/deployments?teamId=${process.env.VERCEL_TEAM_ID}`
    : "https://api.vercel.com/v13/deployments";

  const payload = {
    name: deploymentName,
    project: process.env.VERCEL_PROJECT_ID,
    target: "production",
    files: [
      {
        file: "index.html",
        data: htmlContent
      }
    ]
  };

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  return {
    deploymentId: response.data.id,
    deploymentName,
    deploymentUrl: response.data.url ? `https://${response.data.url}` : "",
    alias: Array.isArray(response.data.alias) ? response.data.alias : []
  };
}

module.exports = {
  deployStaticSite
};
