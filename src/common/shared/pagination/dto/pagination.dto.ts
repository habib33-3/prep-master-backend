import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    page: number = 1;

    @IsOptional()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    pageSize: number = 10;

    @IsOptional()
    @IsIn(["asc", "desc"])
    sortOrder: "asc" | "desc" = "asc";

    @IsOptional()
    @IsString()
    sortBy: string = "createdAt";
}
