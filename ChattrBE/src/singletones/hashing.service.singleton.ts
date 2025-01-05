import { HashingService } from "src/auth/hashing.service";

export class HashingServiceSingleton {
    private static instance: HashingService;

    static setInstance(instance: HashingService) {
        this.instance = instance;
    }

    static getInstance(): HashingService {
        if (!this.instance) {
            throw new Error('HashingServiceSingleton is not initialized');
        }
        return this.instance;
    }
}
