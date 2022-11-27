import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class UnauthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): true | never {
    const request = context.switchToHttp().getRequest<Request>();
    const isUnauthenticated = request.isUnauthenticated();
    if (!isUnauthenticated) {
      throw new ForbiddenException('You are already authenticated!');
    }

    return isUnauthenticated;
  }
}
