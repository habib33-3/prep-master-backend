import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CustomLoggerModule } from "./custom-logger/custom-logger.module";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";

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
    ],
    controllers: [AppController],
    providers: [
        AppService,

        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
