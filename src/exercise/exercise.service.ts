import { Injectable } from "@nestjs/common";

import { CustomLoggerService } from "@/shared/custom-logger/custom-logger.service";
import { PrismaService } from "@/shared/prisma/prisma.service";

import {
    CreateExerciseDto,
    ExerciseFilterQueryDto,
    UpdateExerciseDto,
} from "./dto/exercise.dto";

@Injectable()
export class ExerciseService {
    constructor(
        private readonly logService: CustomLoggerService,
        private readonly prisma: PrismaService,
    ) {}

    async create(createExerciseDto: CreateExerciseDto) {
        const result = await this.prisma.exercise.create({
            data: createExerciseDto,
        });
        this.logService.log(
            "Exercise created successfully",
            JSON.stringify(result),
        );
        return result;
    }

    async findAll(
        filters: ExerciseFilterQueryDto, // Model-specific filters
    ) {
        const { page = 1, pageSize = 10, sortBy, sortOrder } = filters;
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        // Build dynamic `where` filter based on model-specific filters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (filters) {
            if (filters.level) where.level = filters.level;
            if (filters.topic)
                where.topic = { contains: filters.topic, mode: "insensitive" };
            if (filters.categories)
                where.categories = { hasSome: filters.categories };
        }

        const orderBy = sortBy
            ? { [sortBy]: sortOrder }
            : { createdAt: sortOrder };

        // Query the database
        const [data, total] = await this.prisma.$transaction([
            this.prisma.exercise.findMany({
                where,
                skip,
                take,
                orderBy,
            }),
            this.prisma.exercise.count({ where }),
        ]);

        return { data, total, page, pageSize };
    }

    async findById(id: string) {
        const result = await this.prisma.exercise.findUniqueOrThrow({
            where: { id },
        });
        this.logService.log("Exercise found", JSON.stringify(result));
        return result;
    }

    async delete(id: string) {
        const result = await this.prisma.exercise.delete({
            where: { id },
        });
        this.logService.log(
            "Exercise deleted successfully",
            JSON.stringify(result),
        );
        return result;
    }

    async update(updateExerciseDto: UpdateExerciseDto, id: string) {
        const result = await this.prisma.exercise.update({
            where: { id },
            data: updateExerciseDto,
        });
        this.logService.log(
            "Exercise updated successfully",
            JSON.stringify(result),
        );
        return result;
    }
}
