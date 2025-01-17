import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { RequestLoggingMiddleware } from "./common/middlewares/request-logger.middleware";
import { CustomLoggerModule } from "./custom-logger/custom-logger.module";
import { CustomLoggerService } from "./custom-logger/custom-logger.service";
import { ExerciseModule } from "./exercise/exercise.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { PaginationModule } from "./util/pagination/pagination.module";

@Module({
    imports: [
        PrismaModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60,
                limit: 10,
            },
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CustomLoggerModule,
        AuthModule,
        UserModule,
        ExerciseModule,
        PaginationModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },

        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: RequestLoggingMiddleware,
            useFactory: (logger: CustomLoggerService) => {
                return new RequestLoggingMiddleware(logger);
            },
            inject: [CustomLoggerService], // Inject CustomLoggerService here
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggingMiddleware).forRoutes("*");
    }
}
