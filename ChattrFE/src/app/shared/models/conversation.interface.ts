export interface Conversation {
    id: number;
    userName: string;
    lastMessage: string;
    timestamp: Date;
    lastMessageIsRead: boolean;
}