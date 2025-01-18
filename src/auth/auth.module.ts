import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import env from "@/config/env.config";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: env.JWT_SECRET,
            signOptions: {
                expiresIn: Number(env.JWT_EXPIRES_IN),
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
