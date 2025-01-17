import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { PrismaService } from "@/common/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async createAccessToken(email: string) {
        const token = await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, email: true },
            });

            if (!user) {
                throw new NotFoundException("User not found");
            }

            const payload = { sub: user.id, email: user.email };

            return await this.jwtService.signAsync(payload);
        });

        return {
            accessToken: token,
        };
    }
}
