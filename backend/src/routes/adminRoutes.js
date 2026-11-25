import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { listAdminStores, setStoreActive, updateStoreStatus } from "../controllers/adminController.js";

const router = Router();

router.get("/stores", requireUser, requireAdmin, asyncHandler(listAdminStores));
router.patch("/stores/:storeId/status", requireUser, requireAdmin, asyncHandler(updateStoreStatus));
router.patch("/stores/:storeId/active", requireUser, requireAdmin, asyncHandler(setStoreActive));

export default router;
