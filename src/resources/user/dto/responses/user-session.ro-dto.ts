import { AutoMap } from '@automapper/classes';

import { Roles } from '@/resources/user/user.constants';

export class UserSessionRoDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  fullName: string;

  @AutoMap(() => String)
  role: Roles;

  @AutoMap()
  birthDate: Date;

  @AutoMap()
  country: string;

  @AutoMap()
  state: string;

  @AutoMap()
  city: string;

  @AutoMap()
  createdAt: Date;
}
