import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class HashingService {
    async hashPassword(password: string): Promise<string> {
        if (!password) {
            throw new BadRequestException('Password not provided');
        }

        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        if (!password) {
            throw new BadRequestException('Password not provided');
        }

        if (!hash) {
            throw new BadRequestException('Hash not provided');
        }

        return await bcrypt.compare(password, hash);
    }

    generateRoomHash(id: number): string {
        return crypto.createHash('sha256')
            .update(process.env.ROOM_HASH_SECRET + id.toString())
            .digest('hex');
    }
}