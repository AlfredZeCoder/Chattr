import { AddUserDto } from "src/dtos/add-user.dto";
import { User } from "src/entities/user.entity";
import { Role } from "./role.enum";

export interface IJwt {
    token: string;
}

export interface IAccessTokenPayload {
    sub: number;
    email: string;
    roles: Role[];
}
export class AccessTokenPayloadParser {

    static parseToPayload = (user: User) => {
        return {
            sub: user.id,
            email: user.email,
            roles: user.role
        };
    };
}