import { Prisma } from "@prisma/client";

export class PaginationService {
    buildPaginationQuery(filters: { page?: number; pageSize?: number }): {
        skip: number;
        take: number;
    } {
        const page = filters.page || 1;
        const pageSize = filters.pageSize || 10;
        const skip = (page - 1) * pageSize;
        return { skip, take: pageSize };
    }

    buildSortingQuery(filters: {
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }): Prisma.Enumerable<Prisma.ExerciseOrderByWithRelationInput> {
        const { sortBy = "createdAt", sortOrder = "asc" } = filters;
        return [
            { [sortBy]: sortOrder } as Prisma.ExerciseOrderByWithRelationInput,
        ];
    }

    buildSearchQuery<T>(
        search: string | undefined,
        searchableFields: Array<keyof T>,
    ): Prisma.ExerciseWhereInput[] | undefined {
        if (!search) return undefined;
        return searchableFields.map((field) => ({
            [field]: { contains: search, mode: "insensitive" },
        }));
    }

    buildFilterQuery(
        filters: Record<string, unknown>,
    ): Prisma.Enumerable<Prisma.ExerciseWhereInput> {
        const where: Prisma.ExerciseWhereInput = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value)) {
                    where[key] = { hasSome: value };
                } else if (typeof value === "string") {
                    where[key] = { contains: value, mode: "insensitive" };
                } else {
                    where[key] = value;
                }
            }
        });
        return where;
    }
}
