import { Prisma } from "@prisma/client";

import { Injectable } from "@nestjs/common";

import { CustomLoggerService } from "@/shared/custom-logger/custom-logger.service";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { QueryBuilderService } from "@/shared/query-builder/query-builder.service";

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
        private readonly queryBuilder: QueryBuilderService,
    ) {}

    async findAll(filters: ExerciseFilterQueryDto) {
        const { skip, take } = this.queryBuilder.buildPaginationQuery(filters);
        const orderBy = this.queryBuilder.buildSortingQuery(filters);

        const searchQuery = this.queryBuilder.buildSearchQuery(
            filters.search,
            searchableExerciseFields,
        );

        const filterQuery = this.queryBuilder.buildFilterQuery({
            level: filters.difficulty,
            topic: filters.topicName,
            categories: filters.tagList,
        });

        const where: Prisma.ExerciseWhereInput = {
            ...filterQuery,
            ...(searchQuery ? { OR: searchQuery } : {}),
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.exercise.findMany({
                where,
                skip,
                take,
                orderBy,
            }),
            this.prisma.exercise.count({ where }),
        ]);

        const totalPages = Math.ceil(total / take); // Calculate total pages

        return {
            data,
            meta: {
                total,
                totalPages, // Add totalPages for frontend pagination
                page: filters.page,
                pageSize: filters.pageSize,
            },
        };
    }

    async findById(id: string) {
        const result = await this.prisma.exercise.findUniqueOrThrow({
            where: {
                id,
            },
        });
        this.logService.log("Exercise found", JSON.stringify(result));
        return result;
    }

    async create(createExerciseDto: CreateExerciseDto) {
        const result = await this.prisma.exercise.create({
            data: {
                ...createExerciseDto,
                createdBy: createExerciseDto.createdBy,
            },
        });
        this.logService.log(
            "Exercise created successfully",
            JSON.stringify(result),
        );
        return result;
    }

    async update(
        updateExerciseDto: UpdateExerciseDto,
        id: string,
        email: string,
    ) {
        const result = await this.prisma.exercise.update({
            where: {
                id,
                createdBy: email,
            },
            data: updateExerciseDto,
        });
        this.logService.log(
            "Exercise updated successfully",
            JSON.stringify(result),
        );
        return result;
    }

    async delete(id: string, email: string) {
        const result = await this.prisma.exercise.delete({
            where: {
                id,
                createdBy: email,
            },
        });
        this.logService.log(
            "Exercise deleted successfully",
            JSON.stringify(result),
        );
        return result;
    }
}
