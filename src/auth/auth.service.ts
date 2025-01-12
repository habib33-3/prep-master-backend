import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async createAccessToken(email: string): Promise<string> {
        return this.prisma.$transaction(async (prisma) => {
            // Find the user by email
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, email: true }, // Only select required fields
            });

            // Throw a NotFoundException if the user doesn't exist
            if (!user) {
                throw new NotFoundException("User not found");
            }

            // Create the JWT payload
            const payload = { sub: user.id, email: user.email };

            // Sign the JWT
            const token = await this.jwtService.signAsync(payload);

            // Return the signed token
            return token;
        });
    }
}
