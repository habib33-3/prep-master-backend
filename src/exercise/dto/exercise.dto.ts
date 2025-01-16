import { $Enums, Exercise } from "@prisma/client";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

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
