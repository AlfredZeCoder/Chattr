import { CanActivate, ExecutionContext, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { IAccessTokenPayload } from 'src/models/access-token-payload';
import { Message } from 'src/entities/message.entity';
import { AuthServiceSingleton } from 'src/singletones/auth.service.singleton';

@Injectable()
export class IsSelfUserGuard implements CanActivate, OnModuleInit {
  private authService: AuthService;

  onModuleInit() {
    this.authService = AuthServiceSingleton.getInstance();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }
    const accessTokenPayload = await this.authService.decipherTokenToPayload(
      {
        token: token
      }
    ) as IAccessTokenPayload;
    const message = request.body as Message;
    if (!message) {
      throw new UnauthorizedException("Message not provided");
    }
    if (!message.senderId) {
      throw new UnauthorizedException("Sender id not provided");
    }
    if (!message.conversationId) {
      throw new UnauthorizedException("Conversation id not provided");
    }
    if (!message.message) {
      throw new UnauthorizedException("Message text not provided");
    }
    if (!message.timestamp) {
      throw new UnauthorizedException("Timestamp not provided");
    }
    if (accessTokenPayload.sub != message.senderId) {
      throw new UnauthorizedException("User is not the sender of the message");
    }
    return true;
  }
}
