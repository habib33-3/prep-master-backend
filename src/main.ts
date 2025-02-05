import * as cookieParser from "cookie-parser";
import "module-alias/register";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

import env from "@/config/env.config";

import { AllExceptionsFilter } from "@/filters/all-exceptions.filter";

import { ResponseInterceptor } from "@/interceptors/response.interceptors";

import { CustomLoggerService } from "@/shared/custom-logger/custom-logger.service";

import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed"), false);
            }
        },
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true,
    });

    app.use(cookieParser());

    // Set global prefix for the API
    app.setGlobalPrefix("api/v1", {
        exclude: [{ method: RequestMethod.GET, path: "/" }],
    });

    // Enable shutdown hooks for graceful shutdown
    app.enableShutdownHooks();

    // Configure global pipes for validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip unknown properties
            forbidNonWhitelisted: true, // Throw error on extra properties
            transform: true, // Automatically transform payloads to DTOs
            disableErrorMessages: process.env.NODE_ENV === "production", // Disable detailed error messages in production
        }),
    );

    // Set global exception filter
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    // Set global interceptors
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Retrieve logger from the app context using NestJS's DI
    const logger = app.get(CustomLoggerService);

    // Handle uncaught exceptions and unhandled rejections
    process.on("uncaughtException", (err: any) => {
        logger.error(`Uncaught Exception: ${err.message}`);
        process.exit(1); // Exit process after logging error
    });

    process.on("unhandledRejection", (err: any) => {
        logger.error(`Unhandled Rejection: ${err.message}`);
        process.exit(1); // Exit process after logging error
    });

    // Start the application
    await app.listen(env.PORT);
}
bootstrap().catch((err) => console.error(err));
