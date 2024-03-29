import { createMap, extend, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { BaseDocumentWithIdRoDto } from '@/database/base-documents.ro-dto';
import { BaseDocumentWithId } from '@/database/base-documents.schema';

import { UserRoDto, UserSessionRoDto } from './dto';
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
    createMap(mapper, User, UserRoDto, extend(BaseDocumentWithId, BaseDocumentWithIdRoDto));

    createMap(mapper, User, UserSessionRoDto, extend(BaseDocumentWithId, BaseDocumentWithIdRoDto));
  }
}
