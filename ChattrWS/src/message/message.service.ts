import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/models/message.interface';

@Injectable()
export class MessageService {

    constructor(
        private httpService: HttpService
    ) { }

    sendMessageToServer(message: Message) {
        return this.httpService.post<Message>(
            `${process.env.SERVER_URL}/message/add`,
            message
        );
    }
}
