import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import env from "@/common/config/env.config";
import { ACCESS_TOKEN } from "@/common/constants/auth.constants";
import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeaders(request as Request);

        if (!token) {
            throw new UnauthorizedException(
                "Access Denied: No token provided.",
            );
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: env.JWT_SECRET,
            });

            request["user"] = payload;
        } catch (error) {
            console.error("Token verification failed", error);
            throw new UnauthorizedException("Access Denied: Invalid token.");
        }

        return true;
    }

    private extractTokenFromHeaders(request: Request) {
        return request.cookies[ACCESS_TOKEN] as string;
    }
}
