import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';

import { User } from '@/resources/user/schemas/user.schema';
import { UserService } from '@/resources/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const userFound = await this.userService.findOneByEmail(email);
    if (!userFound) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const isValidPassword = await compare(password, userFound.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    return userFound;
  }
}
