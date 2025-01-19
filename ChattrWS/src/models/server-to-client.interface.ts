import { Message } from "./message.interface";

export interface ServerToClientEvents {
    chat: (message: Message) => void;
}