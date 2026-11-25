import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createOrder, listMyOrders } from "../controllers/orderController.js";
import { createOrderSchema } from "../validators/order.js";

const router = Router();

function validateBody(req, res, next) {
  const result = createOrderSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: "Invalid order details", errors: result.error.flatten() });
  }
  req.validatedBody = result.data;
  next();
}

router.use(requireUser);
router.get("/", asyncHandler(listMyOrders));
router.post("/", validateBody, asyncHandler(createOrder));

export default router;
