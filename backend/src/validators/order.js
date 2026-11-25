import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().min(1),
  paymentMethod: z.literal("COD").default("COD"),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(25)
  })).min(1).max(30)
});
