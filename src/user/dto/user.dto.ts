import { User } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SaveUserDto implements Partial<User> {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
