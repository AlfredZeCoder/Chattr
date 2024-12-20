import { User } from "src/entities/user.entity";

export class GetUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;

    static toDto(entity: User) {
        const userDto = new GetUserDto();
        userDto.id = entity.id;
        userDto.email = entity.email;
        userDto.firstName = entity.firstName;
        userDto.lastName = entity.lastName;
        return userDto;
    }
}