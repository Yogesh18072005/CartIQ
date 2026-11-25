import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createAddress, deleteAddress, listAddresses } from "../controllers/addressController.js";
import { addressSchema } from "../validators/address.js";

const router = Router();

function validateBody(req, res, next) {
  const result = addressSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: "Invalid address details", errors: result.error.flatten() });
  }
  req.validatedBody = result.data;
  next();
}

router.use(requireUser);
router.get("/", asyncHandler(listAddresses));
router.post("/", validateBody, asyncHandler(createAddress));
router.delete("/:id", asyncHandler(deleteAddress));

export default router;
