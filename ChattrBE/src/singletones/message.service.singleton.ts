import { MessageService } from "src/message/message.service";

export class MessageServiceSingleton {
    private static instance: MessageService;

    static setInstance(instance: MessageService) {
        this.instance = instance;
    }

    static getInstance(): MessageService {
        if (!this.instance) {
            throw new Error('MessageServiceSingleton is not initialized');
        }
        return this.instance;
    }
}
