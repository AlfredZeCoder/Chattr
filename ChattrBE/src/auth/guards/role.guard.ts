import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/models/role.enum';

interface JwtDecodedResponse {
  sub: number,
  email: string;
  roles: Role[];
  iat: number,
  exp: number;
}
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) { }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  canActivate = async (context: ExecutionContext): Promise<boolean> => {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const decodedToken: JwtDecodedResponse = this.jwtService.decode(token) as JwtDecodedResponse;
    const arrayOfRequiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!token) {
      throw new UnauthorizedException();
    }

    if (!arrayOfRequiredRoles) {
      return true;
    }
    if (arrayOfRequiredRoles.every((role) => decodedToken.roles?.includes(role))) {
      return true;
    }

    if (decodedToken.roles?.includes(Role.Admin)) {
      return true;
    }

    return false;
  };
}