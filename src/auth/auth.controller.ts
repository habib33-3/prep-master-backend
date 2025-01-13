import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";

import { Public } from "src/common/decorators/public.decorator";
import { ACCESS_TOKEN } from "src/constants/auth.constants";

import { CookieOptions, Response } from "express";
import { env } from "process";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    private getCookieOptions(): CookieOptions {
        const isProduction = process.env.NODE_ENV === "production";
        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
            maxAge: Number(env.JWT_EXPIRES_IN),
        };
    }

    @Public()
    @Post("access-token")
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
    @Post("/clear-cookie")
    clearAccessToken(@Res({ passthrough: true }) res: Response) {
        const cookieOptions = this.getCookieOptions();
        cookieOptions.maxAge = 0;

        res.clearCookie(ACCESS_TOKEN, cookieOptions);

        return {
            status: "success",
            message: "Access token cookie cleared successfully.",
        };
    }
}
