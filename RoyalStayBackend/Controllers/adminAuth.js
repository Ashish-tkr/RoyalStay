export function adminAuth(req, res, next) {
  const token = req.header("X-Admin-Token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
