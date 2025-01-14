import { Message } from "./message.interface";
import { User } from "./user.interface";

export interface ClientToServerEvents {
    chat: (message: Message) => void;
    joinRoom: (params: { user: User; roomName: string; }) => void;
}