import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createStore, getMyStore } from "../controllers/storeController.js";
import { createStoreSchema } from "../validators/store.js";

const router = Router();

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: "Invalid store details", errors: result.error.flatten() });
    }
    req.validatedBody = result.data;
    next();
  };
}

router.use(requireUser);
router.get("/me", asyncHandler(getMyStore));
router.post("/", validateBody(createStoreSchema), asyncHandler(createStore));

export default router;
