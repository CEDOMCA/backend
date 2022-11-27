import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { UserSessionRoDto } from './dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() override readonly mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      this.registerMappingToRoDto(mapper);
    };
  }

  private registerMappingToRoDto(mapper: Mapper): void {
    createMap(
      mapper,
      User,
      UserSessionRoDto,
      forMember(
        (d) => d.id,
        mapFrom((s) => s.id),
      ),
    );
  }
}
