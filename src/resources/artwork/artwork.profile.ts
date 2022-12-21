import { createMap, extend, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { BaseDocumentWithIdRoDto } from '@/database/base-documents.ro-dto';
import { BaseDocumentWithId } from '@/database/base-documents.schema';

import { ArtworkRoDto, ArtworkAttributesRoDto } from './dto';
import { Artwork, ArtworkAttributes } from './schema/artwork.schema';

@Injectable()
export class ArtworkProfile extends AutomapperProfile {
  constructor(@InjectMapper() override readonly mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      this.registerMappingToRoDto(mapper);
    };
  }

  private registerMappingToRoDto(mapper: Mapper): void {
    createMap(mapper, Artwork, ArtworkRoDto, extend(BaseDocumentWithId, BaseDocumentWithIdRoDto));

    createMap(mapper, ArtworkAttributes, ArtworkAttributesRoDto);
  }
}
