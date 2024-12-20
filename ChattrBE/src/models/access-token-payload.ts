import { User } from "src/entities/user.entity";

export interface IJwt {
    token: string;
}

export interface IAccessTokenPayload {
    sub: number;
    email: string;
}
export class AccessTokenPayloadParser {

    static parseToPayload = (user: User) => {
        return {
            sub: user.id,
            email: user.email,
        };
    };
}