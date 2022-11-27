import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { LOCAL_STRATEGY_NAME } from '../strategies';

@Injectable()
export class LoginGuard extends AuthGuard(LOCAL_STRATEGY_NAME) {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const can = (await super.canActivate(ctx)) as boolean;
    //                   ^^^^^^^ This will invoke `LocalStrategy#validate` method
    if (can) {
      const req = ctx.switchToHttp().getRequest<Request>();
      await super.logIn(req);
    }
    return can;
  }
}
