import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Role } from "src/models/role.enum";

export class AddRoleDto {
    @ApiProperty({ description: 'User id', example: '1' })
    @IsNumber()
    userId: number;

    @ApiProperty({ description: 'Role to add', example: 'admin' })
    @IsNotEmpty()
    role: Role;
}