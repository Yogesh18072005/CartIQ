import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().min(5).max(5000),
  mrp: z.number().nonnegative(),
  price: z.number().nonnegative(),
  images: z.array(z.url()).max(8).default([]),
  category: z.string().trim().min(2).max(80),
  inStock: z.boolean().default(true)
}).refine((data) => data.price <= data.mrp, {
  message: "Price cannot be greater than MRP",
  path: ["price"]
});
