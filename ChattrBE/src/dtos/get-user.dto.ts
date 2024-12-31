import { User } from "src/entities/user.entity";
import { Role } from "src/models/role.enum";

export class GetUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    conversationsId: number[];

    static toDto(entity: User) {
        const userDto = new GetUserDto();
        userDto.id = entity.id;
        userDto.email = entity.email;
        userDto.firstName = entity.firstName;
        userDto.lastName = entity.lastName;
        userDto.conversationsId = entity.conversationsId;
        return userDto;
    }
}