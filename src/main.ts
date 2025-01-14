import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptors";
import env from "./config/env.config";
import { CustomLoggerService } from "./custom-logger/custom-logger.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.enableShutdownHooks();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: process.env.NODE_ENV === "production",
        }),
    );

    // Enable CORS if needed, uncomment and configure
    app.enableCors({
        origin: env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true,
    });

    app.setGlobalPrefix("api/v1");

    app.useGlobalInterceptors(new ResponseInterceptor());

    const logger = app.get(CustomLoggerService);

    process.on("uncaughtException", (error: Error) => {
        logger.error(`Uncaught Exception: ${error.message}`);
        process.exit(1); // Exit process after logging error
    });

    process.on("unhandledRejection", (reason: unknown) => {
        if (reason instanceof Error) {
            logger.error(`Unhandled Rejection: ${reason.message}`);
        } else {
            logger.error(`Unhandled Rejection: ${JSON.stringify(reason)}`);
        }
        process.exit(1); // Exit process after logging error
    });

    await app.listen(env.PORT ?? 5000);
}

bootstrap().catch((error) => {
    console.error("Error during application bootstrap:", error);
});
