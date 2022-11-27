import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { UserSessionRoDto } from '@/resources/user/dto';
import { User } from '@/resources/user/schemas/user.schema';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@InjectMapper() private readonly mapper: Mapper) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: UserSessionRoDto) => void) {
    const userSession = this.mapper.map(user, User, UserSessionRoDto);

    done(null, userSession);
  }

  deserializeUser(
    serializedUser: UserSessionRoDto,
    done: (err: Error, user: UserSessionRoDto) => void,
  ) {
    done(null, Object.assign(new UserSessionRoDto(), serializedUser));
  }
}
