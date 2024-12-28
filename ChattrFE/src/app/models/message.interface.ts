export interface Message {
    id: number;
    conversationId: number;
    message: string;
    senderId: number;
    createdDate: Date;
}