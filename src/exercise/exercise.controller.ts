import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";

import { CreateExerciseDto, UpdateExerciseDto } from "./dto/exercise.dto";
import { ExerciseService } from "./exercise.service";

@Controller("exercise")
export class ExerciseController {
    constructor(private readonly exerciseService: ExerciseService) {}

    @Post()
    async create(@Body() createExerciseDto: CreateExerciseDto) {
        return await this.exerciseService.create(createExerciseDto);
    }

    @Get()
    async findAll() {
        return await this.exerciseService.findAll();
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return await this.exerciseService.findById(id);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return await this.exerciseService.delete(id);
    }

    @Put(":id")
    async update(
        @Body() updateExerciseDto: UpdateExerciseDto,
        @Param("id") id: string,
    ) {
        return await this.exerciseService.update(updateExerciseDto, id);
    }
}
