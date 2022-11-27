import { Controller, Post, Session, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { LoginGuard, UnauthenticatedGuard } from '@/resources/auth/guards';
import { UserLogin, UserSessionRoDto } from '@/resources/user/dto';

export type SessionData = Request['session'] & {
  // Defined by `SessionSerializer`
  passport: {
    user: UserSessionRoDto;
  };
};

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  /**
   * Sign a user in by creating a session.
   */
  @Post('login')
  @ApiBody({ type: UserLogin })
  @UseGuards(UnauthenticatedGuard, LoginGuard)
  userLogin(@Session() session: SessionData): UserSessionRoDto {
    return session.passport.user;
  }
}
