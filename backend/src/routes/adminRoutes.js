import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { updateStoreStatus } from "../controllers/adminController.js";

const router = Router();

router.patch("/stores/:storeId/status", requireUser, requireAdmin, asyncHandler(updateStoreStatus));

export default router;
