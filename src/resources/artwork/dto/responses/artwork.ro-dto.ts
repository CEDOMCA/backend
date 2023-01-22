import { AutoMap } from '@automapper/classes';

import { BaseDocumentWithIdRoDto } from '@/database/base-documents.ro-dto';

export class ArtworkRoDto extends BaseDocumentWithIdRoDto {
  @AutoMap()
  code: string;

  @AutoMap()
  title: string;

  @AutoMap()
  font: string;

  @AutoMap()
  filePath: string;
}
