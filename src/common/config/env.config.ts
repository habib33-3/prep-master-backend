import * as dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define the schema for the environment variables
const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
    ALLOWED_ORIGINS: z.string().refine(
        (val) => {
            // Split comma-separated values and ensure each is a valid URL022
            const origins = val.split(",").map((origin) => origin.trim());
            return origins.every((origin) => {
                try {
                    new URL(origin); // Test if each origin is a valid URL
                    return true;
                } catch {
                    return false;
                }
            });
        },
        {
            message:
                "ALLOWED_ORIGINS must be a comma-separated list of valid URLs",
        },
    ),
});

// Parse and validate the environment variables
const env = envSchema.safeParse(process.env);

// Handle validation errors
if (!env.success) {
    console.error("Environment validation error:", env.error.format());
    process.exit(1); // Exit the process if validation fails
}

export default env.data;
