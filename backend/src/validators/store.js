import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().trim().min(2).max(100),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{3,30}$/),
  description: z.string().trim().max(1000).optional().default(""),
  email: z.email(),
  contact: z.string().trim().min(7).max(30),
  address: z.string().trim().min(5).max(500),
  logoUrl: z.url().optional().or(z.literal("")).default("")
});
