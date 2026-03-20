function getPublicConfig(req, res) {
  return res.status(200).json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || ""
  });
}

module.exports = {
  getPublicConfig
};
