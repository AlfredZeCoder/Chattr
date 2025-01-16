export interface Message {
    id: number;
    conversationId: number;
    message: string;
    senderId: number;
    timestamp: Date;
    isRead: boolean;
}


// {
//     "id": 56,
//     "conversationId": 2,
//     "roomName": "test",
//     "message": "Hello",
//     "senderId": 3,
//     "isRead": false
// }