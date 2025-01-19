import { Prisma } from "@prisma/client";

import { Injectable } from "@nestjs/common";

import { CustomLoggerService } from "@/shared/custom-logger/custom-logger.service";
import { PaginationService } from "@/shared/pagination/pagination.service";
import { PrismaService } from "@/shared/prisma/prisma.service";

import {
    CreateExerciseDto,
    ExerciseFilterQueryDto,
    UpdateExerciseDto,
} from "./dto/exercise.dto";
import { searchableExerciseFields } from "./exercise.constants";

@Injectable()
export class ExerciseService {
    constructor(
        private readonly logService: CustomLoggerService,
        private readonly prisma: PrismaService,
        private readonly paginationService: PaginationService,
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

    async findAll(filters: ExerciseFilterQueryDto) {
        const { skip, take } =
            this.paginationService.buildPaginationQuery(filters);
        const orderBy = this.paginationService.buildSortingQuery(filters);
        const searchQuery = this.paginationService.buildSearchQuery(
            filters.search,
            searchableExerciseFields,
        );

        const filterQuery = this.paginationService.buildFilterQuery({
            level: filters.level,
            topic: filters.topic,
            categories: filters.categories,
        });

        const where: Prisma.ExerciseWhereInput = {
            ...filterQuery,
            ...(searchQuery ? { OR: searchQuery } : {}),
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.exercise.findMany({ where, skip, take, orderBy }),
            this.prisma.exercise.count({ where }),
        ]);

        return { data, total, page: filters.page, pageSize: filters.pageSize };
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
