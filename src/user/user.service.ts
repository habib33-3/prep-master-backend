import { ConflictException, Injectable } from "@nestjs/common";

import { AuthService } from "src/auth/auth.service";
import { CustomLoggerService } from "src/custom-logger/custom-logger.service";
import { PrismaService } from "src/prisma/prisma.service";

import { SaveUserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly logService: CustomLoggerService,
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {}

    async saveUser(saveUserDto: SaveUserDto) {
        const { email, name } = saveUserDto;

        const existingUser = await this.findUserByEmail(email);

        if (existingUser) {
            throw new ConflictException("User Already Exists");
        }

        await this.prisma.user.create({
            data: {
                email,
                name,
            },
        });

        return await this.authService.createAccessToken(email);
    }

    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
}
