import { $Enums, Exercise } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

import { PaginationQueryDto } from "@/shared/query-builder/dto/pagination.dto";

// DTO for creating a new Exercise
export class CreateExerciseDto implements Partial<Exercise> {
    @IsString()
    questionText: string;

    @IsString()
    answerText: string;

    @IsString()
    topicName: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tagList?: string[];

    @IsOptional()
    @IsEnum($Enums.Level)
    difficulty?: $Enums.Level;

    @IsString()
    createdBy: string;
}

// DTO for updating an existing Exercise
export class UpdateExerciseDto implements Partial<CreateExerciseDto> {
    @IsOptional()
    @IsString()
    questionText?: string;

    @IsOptional()
    @IsString()
    answerText?: string;

    @IsOptional()
    @IsString()
    topicName?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tagList?: string[];

    @IsOptional()
    @IsEnum($Enums.Level)
    difficulty?: $Enums.Level;
}

// DTO for filtering exercises with pagination
export class ExerciseFilterQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Transform(({ value }) => value?.toUpperCase()) // Convert to uppercase
    @IsEnum($Enums.Level)
    difficulty?: $Enums.Level;

    @IsOptional()
    @IsString()
    topicName?: string;

    @IsOptional()
    @Transform(({ value }) =>
        Array.isArray(value) ? value : [value].filter(Boolean),
    )
    @IsString({ each: true })
    tagList?: string[];
}
