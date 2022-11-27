import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { BaseDocumentWithIdRoDto } from './base-documents.ro-dto';
import { BaseDocumentWithId } from './base-documents.schema';

@Injectable()
export class BaseDocumentsProfile extends AutomapperProfile {
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
      BaseDocumentWithId,
      BaseDocumentWithIdRoDto,
      forMember(
        (d) => d.id,
        mapFrom((s) => s.id),
      ),
    );
  }
}
