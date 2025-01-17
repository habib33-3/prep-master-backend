import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";

import { SaveUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Post("save-user")
    async saveUser(@Body() savedUserDto: SaveUserDto) {
        return await this.userService.saveUser(savedUserDto);
    }
}
