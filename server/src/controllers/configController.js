function getPublicConfig(req, res) {
  const googleClientId = (process.env.GOOGLE_CLIENT_ID || "").trim();

  return res.status(200).json({
    googleClientId,
    googleAuthEnabled: Boolean(googleClientId)
  });
}

module.exports = {
  getPublicConfig
};
