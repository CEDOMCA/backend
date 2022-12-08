import { createMap, extend, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { BaseDocumentWithIdRoDto } from '@/database/base-documents.ro-dto';
import { BaseDocumentWithId } from '@/database/base-documents.schema';

import { FontAttributesRoDto, FontRoDto } from './dto';
import { Font, FontAttributes } from './schema/font.schema';

@Injectable()
export class FontProfile extends AutomapperProfile {
  constructor(@InjectMapper() override readonly mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      this.registerMappingToRoDto(mapper);
    };
  }

  private registerMappingToRoDto(mapper: Mapper): void {
    createMap(mapper, Font, FontRoDto, extend(BaseDocumentWithId, BaseDocumentWithIdRoDto));

    createMap(
      mapper,
      FontAttributes,
      FontAttributesRoDto,
      extend(BaseDocumentWithId, BaseDocumentWithIdRoDto),
    );
  }
}
