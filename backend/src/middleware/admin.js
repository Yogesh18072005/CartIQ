export function requireAdmin(req, res, next) {
  const allowedAdmins = (process.env.ADMIN_CLERK_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!allowedAdmins.length || !allowedAdmins.includes(req.userId)) {
    return res.status(403).json({ success: false, message: "Administrator access required." });
  }

  next();
}
