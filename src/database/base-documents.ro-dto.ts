import { AutoMap } from '@automapper/classes';

export class BaseDocumentWithIdRoDto {
  @AutoMap()
  id: string;
}
