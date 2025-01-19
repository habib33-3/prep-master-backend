import { $Enums, Exercise } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

import { PaginationQueryDto } from "@/shared/pagination/dto/pagination.dto";

export class CreateExerciseDto implements Partial<Exercise> {
    @IsString()
    creatorEmail: string;

    @IsString()
    title: string;

    @IsString()
    answer: string;

    @IsString()
    topic: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @IsOptional()
    @IsEnum($Enums.Level)
    level?: $Enums.Level;
}

export class UpdateExerciseDto implements Partial<CreateExerciseDto> {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    answer?: string;

    @IsOptional()
    @IsString()
    topic?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @IsOptional()
    @IsEnum($Enums.Level)
    level?: $Enums.Level;
}

export class ExerciseFilterQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Transform(({ value }) => value?.toUpperCase()) // Convert to uppercase
    @IsEnum($Enums.Level)
    level?: $Enums.Level;

    @IsOptional()
    @IsString()
    topic?: string;

    @IsOptional()
    @Transform(
        ({ value }) => (Array.isArray(value) ? value : [value].filter(Boolean)), // Ensure it's an array
    )
    @IsString({ each: true })
    categories?: string[];
}
