import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): true | never {
    const request = context.switchToHttp().getRequest<Request>();
    const isAuthenticated = request.isAuthenticated();
    if (!isAuthenticated) {
      throw new ForbiddenException('You are not authenticated!');
    }

    return isAuthenticated;
  }
}
