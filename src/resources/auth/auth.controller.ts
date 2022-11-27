import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoginGuard, UnauthenticatedGuard } from '@/resources/auth/guards';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  @Post('login')
  @UseGuards(UnauthenticatedGuard, LoginGuard)
  userLogin(@Request() req: any) {
    return req.user;
  }
}
