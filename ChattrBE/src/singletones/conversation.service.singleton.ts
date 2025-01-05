import { ConversationService } from "src/conversation/conversation.service";

export class ConversationServiceSingleton {
    private static instance: ConversationService;

    static setInstance(instance: ConversationService) {
        this.instance = instance;
    }

    static getInstance(): ConversationService {
        if (!this.instance) {
            throw new Error('ConversationServiceSingleton is not initialized');
        }
        return this.instance;
    }
}
