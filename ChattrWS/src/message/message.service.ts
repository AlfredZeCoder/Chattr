import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/models/message.interface';

@Injectable()
export class MessageService {

    constructor(
        private httpService: HttpService
    ) { }

    sendMessageToServer(message: Message) {
        return this.httpService.post(
            `${process.env.SERVER_URL}/message/add`,
            message
        );
    }

    changeMessageReadStatus(message: Message) {
        return this.httpService.put(
            `${process.env.SERVER_URL}/message/update-read-status/${message.id}`,
            message
        );
    }
}
