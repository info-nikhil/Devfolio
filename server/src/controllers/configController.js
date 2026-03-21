function getPublicConfig(req, res) {
<<<<<<< HEAD
  return res.status(200).json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || ""
=======
  const googleClientId = (process.env.GOOGLE_CLIENT_ID || "").trim();

  return res.status(200).json({
    googleClientId,
    googleAuthEnabled: Boolean(googleClientId)
>>>>>>> 3c0c81c (updates)
  });
}

module.exports = {
  getPublicConfig
};
