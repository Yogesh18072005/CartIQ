import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  ADMIN_CLERK_USER_IDS: z.string().default("")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid backend environment:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

if (Boolean(parsed.data.CLERK_PUBLISHABLE_KEY) !== Boolean(parsed.data.CLERK_SECRET_KEY)) {
  console.error("Set both CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY, or leave both empty.");
  process.exit(1);
}

export const env = parsed.data;
