import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';


@Injectable()
export class MessageService {

    generateRoomName(id: number): string {
        return crypto.createHash('sha256')
            .update(id.toString())
            .digest('hex');
    }

}
