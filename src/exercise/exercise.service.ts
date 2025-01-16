import { Injectable } from "@nestjs/common";

import { CustomLoggerService } from "src/custom-logger/custom-logger.service";
import { PrismaService } from "src/prisma/prisma.service";

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

    async findAll() {
        const result = await this.prisma.exercise.findMany();
        this.logService.log(
            "Fetched exercises",
            JSON.stringify({ count: result.length }),
        );
        return result;
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
