import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { CustomLoggerService } from "src/custom-logger/custom-logger.service";

import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor(private readonly logService: CustomLoggerService) {
        super();
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logService.log("Prisma connected successfully.");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : JSON.stringify(error);
            this.logService.error(
                `Error connecting to Prisma: ${errorMessage}`,
            );
            throw error;
        }
    }

    // Handles logic when the module is destroyed
    async onModuleDestroy() {
        await this.$disconnect();
        this.logService.log("Prisma disconnected.");
    }
}
