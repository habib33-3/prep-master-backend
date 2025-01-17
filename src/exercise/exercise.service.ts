import { Injectable } from "@nestjs/common";

import { CustomLoggerService } from "src/util/custom-logger/custom-logger.service";
import { PaginationQueryDto } from "src/util/pagination/dto/pagination.dto";
import { PrismaService } from "src/util/prisma/prisma.service";

import { CreateExerciseDto, UpdateExerciseDto } from "./dto/exercise.dto";

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

    async findAll(paginationQuery: PaginationQueryDto) {
        const { page = 1, pageSize = 10 } = paginationQuery;

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.exercise.findMany({ skip, take }),
            this.prisma.exercise.count(),
        ]);

        this.logService.log(
            "Fetched exercises",
            JSON.stringify({ count: data.length, page, pageSize, total }),
        );

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
