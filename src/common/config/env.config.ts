import * as dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define the schema for the environment variables
const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.string().transform((val) => Number(val)),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
    ALLOWED_ORIGINS: z
        .string()
        .transform((val) => val.split(",").map((origin) => origin.trim())),
});

// Parse and validate the environment variables
const parsedEnv = envSchema.safeParse(process.env);

// Handle validation errors
if (!parsedEnv.success) {
    console.error(
        "Environment validation error:",
        JSON.stringify(parsedEnv.error.format(), null, 2),
    );
    process.exit(1); // Exit the process if validation fails
}

const env = parsedEnv.data;

export default env;
