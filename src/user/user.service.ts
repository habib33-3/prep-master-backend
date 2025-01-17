import { Injectable } from "@nestjs/common";

import { CustomLoggerService } from "@/common/custom-logger/custom-logger.service";
import { PrismaService } from "@/common/prisma/prisma.service";

import { SaveUserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly logService: CustomLoggerService,
        private readonly prisma: PrismaService,
    ) {}

    async saveUser(saveUserDto: SaveUserDto) {
        const { email, name } = saveUserDto;

        const existingUser = await this.findUserByEmail(email);

        if (existingUser) {
            this.logService.log(`User with email ${email} already exists.`);
            return existingUser;
        }

        return await this.prisma.user.create({
            data: {
                email,
                name,
            },
        });
    }

    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
}
