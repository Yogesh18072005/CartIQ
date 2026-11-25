import { Router } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireUser } from "../middleware/auth.js";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "../controllers/productController.js";
import { productSchema, productUpdateSchema } from "../validators/product.js";

const router = Router();

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: "Invalid product details", errors: result.error.flatten() });
    }
    req.validatedBody = result.data;
    next();
  };
}

function validateProductId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }
  next();
}

router.get("/", asyncHandler(listProducts));
router.get("/:id", validateProductId, asyncHandler(getProduct));
router.post("/", requireUser, validateBody(productSchema), asyncHandler(createProduct));
router.patch("/:id", requireUser, validateProductId, validateBody(productUpdateSchema), asyncHandler(updateProduct));
router.delete("/:id", requireUser, validateProductId, asyncHandler(deleteProduct));

export default router;
