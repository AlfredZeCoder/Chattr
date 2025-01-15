import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class RoomGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const client: Socket = context.switchToWs().getClient<Socket>();
    const data = context.switchToWs().getData(); // Récupère les données de l'événement WebSocket
    console.log('RoomGuard: ', data);
    const roomName = data.room; // Supposons que le nom de la room est passé dans `data.room`

    // console.log('RoomGuard: ', roomName);
    // if (!roomName) {
    //   throw new UnauthorizedException('Room name is missing in the request');
    // }

    // const rooms = Array.from(client.rooms); // Liste des rooms auxquelles le client appartient

    // // Vérifie si le client est dans la room spécifiée
    // if (!rooms.includes(roomName)) {
    //   throw new UnauthorizedException(`Access denied to room: ${roomName}`);
    // }

    return true;
  }
}
