import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";

import { PaginationQueryDto } from "./dto/pagination.dto";

@Injectable()
export class PaginationService {
    constructor(private readonly prisma: PrismaService) {}

    async paginate<T>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        model: any, // The Prisma model (e.g., `prisma.user`)
        paginationQuery: PaginationQueryDto,
        where?: object, // Optional filter conditions
    ): Promise<{
        data: T[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const {
            page = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortOrder = "asc",
            search,
        } = paginationQuery;

        // Calculate skip and take for pagination
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        // Extend `where` with search functionality if `search` is provided
        if (search) {
            where = {
                ...where,
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            };
        }

        const [data, total] = await this.prisma.$transaction([
            model.findMany({
                where,
                skip,
                take,
                orderBy: { [sortBy]: sortOrder },
            }),
            model.count({ where }),
        ]);

        return {
            data,
            total,
            page,
            pageSize,
        };
    }
}
