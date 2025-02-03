import { Request } from "express";

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
} from "@nestjs/common";

import { Public } from "@/decorators/public.decorator";

import {
    CreateExerciseDto,
    ExerciseFilterQueryDto,
    UpdateExerciseDto,
} from "./dto/exercise.dto";
import { ExerciseService } from "./exercise.service";

@Controller("exercise")
export class ExerciseController {
    constructor(private readonly exerciseService: ExerciseService) {}

    @Public()
    @Get()
    async findAll(@Query() filters: ExerciseFilterQueryDto) {
        return await this.exerciseService.findAll(filters);
    }

    @Public()
    @Get(":id")
    async findById(@Param("id") id: string) {
        return await this.exerciseService.findById(id);
    }

    @Post()
    async create(@Body() createExerciseDto: CreateExerciseDto) {
        return await this.exerciseService.create(createExerciseDto);
    }

    @Put(":id")
    async update(
        @Body() updateExerciseDto: UpdateExerciseDto,
        @Param("id") id: string,
        @Req() req: Request,
    ) {
        return await this.exerciseService.update(
            updateExerciseDto,
            id,
            req.user.email,
        );
    }

    @Delete(":id")
    async delete(@Param("id") id: string, @Req() req: Request) {
        return await this.exerciseService.delete(id, req.user.email);
    }
}
