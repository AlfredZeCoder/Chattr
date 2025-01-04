export interface Message {
    id: number;
    conversationId: number;
    message: string;
    senderId: number;
    timestamp: Date;
    isRead: boolean;
}