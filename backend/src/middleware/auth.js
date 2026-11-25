import { getAuth } from "@clerk/express";

export function requireUser(req, res, next) {
  if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
    return res.status(503).json({
      success: false,
      message: "Authentication is not configured on this server."
    });
  }

  const auth = getAuth(req);
  if (!auth.isAuthenticated || !auth.userId) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }

  req.userId = auth.userId;
  next();
}

export function getAuthenticatedUserId(req) {
  if (!req.userId) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  return req.userId;
}
