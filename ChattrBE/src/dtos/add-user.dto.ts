import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "src/entities/user.entity";

export class AddUserDto {
    @ApiProperty({ description: 'First name of the user', example: 'Alfred' })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ description: 'Last name of the user', example: 'Poirier' })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ description: 'Email of the user', example: 'alfredpoirier@videotron.ca' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password of the user', example: 'Password1' })
    @IsNotEmpty()
    password: string;


    static toEntity = (userDto: AddUserDto) => {
        const user = new User();
        user.email = userDto.email;
        user.firstName = userDto.firstName;
        user.lastName = userDto.lastName;
        user.password = userDto.password;
        return user;
    };
}