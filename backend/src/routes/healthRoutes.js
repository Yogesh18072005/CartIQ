import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    service: "CartIQ API",
    database: databaseReady ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

export default router;
