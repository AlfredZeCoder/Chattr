import { AuthService } from "src/auth/auth.service";

export class AuthServiceSingleton {
    private static instance: AuthService;

    static setInstance(instance: AuthService) {
        this.instance = instance;
    }

    static getInstance(): AuthService {
        if (!this.instance) {
            throw new Error('AuthServiceSingleton is not initialized');
        }
        return this.instance;
    }
}
