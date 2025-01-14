import { User } from "./user.interface";

export interface Room {
    name: string;
    host: User;
    users: User[];
}
