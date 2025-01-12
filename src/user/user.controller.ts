import {
    Body,
    Controller,
    InternalServerErrorException,
    Post,
} from "@nestjs/common";

import { Public } from "src/common/decorators/public.decorator";
import { CustomLoggerService } from "src/custom-logger/custom-logger.service";

import { SaveUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: CustomLoggerService,
    ) {}

    @Public()
    @Post("save-user")
    async saveUser(@Body() savedUserDto: SaveUserDto) {
        return await this.userService.saveUser(savedUserDto);
    }
}
