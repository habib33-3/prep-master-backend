import { CookieOptions, Response } from "express";

import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";

import { ACCESS_TOKEN } from "@/common/constants/auth.constants";
import { Public } from "@/common/decorators/public.decorator";

import env from "@/config/env.config";

import { CustomLoggerService } from "@/shared/custom-logger/custom-logger.service";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly logger: CustomLoggerService,
    ) {}

    private getCookieOptions(): CookieOptions {
        const isProduction = process.env.NODE_ENV === "production";

        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge: Number(env.JWT_EXPIRES_IN) * 1000,
        };
    }

    @Public()
    @Post("/access-token")
    async createAccessToken(
        @Body("email") email: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.authService.createAccessToken(email);
        const cookieOptions = this.getCookieOptions();

        res.cookie(ACCESS_TOKEN, token.accessToken, cookieOptions);

        return {
            status: "success",
            message: "Access token created and stored in cookies successfully.",
        };
    }

    @HttpCode(200)
    @Post("clear-cookie")
    clearAccessToken(@Res({ passthrough: true }) res: Response) {
        const cookieOptions = this.getCookieOptions();
        res.clearCookie(ACCESS_TOKEN, {
            ...cookieOptions,
            expires: new Date(0),
        });

        return {
            status: "success",
            message:
                "Access token cookie cleared successfully. You are logged out.",
        };
    }
}
