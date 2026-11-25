import { requireAuth } from "@clerk/express";

export const requireUser = [
  (req, res, next) => {
    if (!process.env.CLERK_SECRET_KEY) {
      return res.status(503).json({
        success: false,
        message: "Authentication is not configured on this server."
      });
    }
    next();
  },
  requireAuth()
];

export function getAuthenticatedUserId(req) {
  const userId = req.auth?.userId;
  if (!userId) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  return userId;
}
