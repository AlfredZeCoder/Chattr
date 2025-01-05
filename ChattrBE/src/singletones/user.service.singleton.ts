import { UserService } from "src/user/user.service";

export class UserServiceSingleton {
    private static instance: UserService;

    static setInstance(instance: UserService) {
        this.instance = instance;
    }

    static getInstance(): UserService {
        if (!this.instance) {
            throw new Error('UserServiceSingleton is not initialized');
        }
        return this.instance;
    }
}
