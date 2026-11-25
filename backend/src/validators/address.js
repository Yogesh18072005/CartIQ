import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  street: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  zip: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(30)
});
