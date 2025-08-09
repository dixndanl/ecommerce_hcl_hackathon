export function getProfile(req, res) {
  return res.json({ user: req.user });
}


