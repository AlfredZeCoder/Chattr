export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    conversationsId: number[];
    pendingUserIdRequests: number[];

}