import { AutoMap } from '@automapper/classes';

import { BaseDocumentWithIdRoDto } from '@/database/base-documents.ro-dto';

export class ArtworkAttributesRoDto {
  @AutoMap()
  name: string;

  @AutoMap()
  value: string;
}

export class ArtworkRoDto extends BaseDocumentWithIdRoDto {
  @AutoMap()
  code: string;

  @AutoMap()
  title: string;

  @AutoMap()
  font: string;

  @AutoMap(() => [ArtworkAttributesRoDto])
  attributes: ArtworkAttributesRoDto[];
}
