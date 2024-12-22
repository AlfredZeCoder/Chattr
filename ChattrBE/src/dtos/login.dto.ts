import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LogInDto {
    @ApiProperty({ description: 'Email of the user', example: 'alfredpoirier@videotron.ca' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Password of the user', example: 'Password1' })
    @IsNotEmpty()
    password: string;
}