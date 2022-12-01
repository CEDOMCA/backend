import { promisify } from 'util';

import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthenticatedGuard, LoginGuard, UnauthenticatedGuard } from '@/resources/auth/guards';
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
   * Log a user in by creating a session.
   */
  @Post('login')
  @ApiBody({ type: UserLogin })
  @UseGuards(UnauthenticatedGuard, LoginGuard)
  userLogin(@Session() session: SessionData): UserSessionRoDto {
    return session.passport.user;
  }

  /**
   * Log a user out by destroying their session.
   */
  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Logout suceeded' })
  async userLogout(@Req() request: Request, @Res() response: Response): Promise<void> {
    if (request.session) {
      await promisify(request.session.destroy.bind(request.session))();
      response.clearCookie('connect.sid');
      request.logout(() => response.end());
    }
  }
}
