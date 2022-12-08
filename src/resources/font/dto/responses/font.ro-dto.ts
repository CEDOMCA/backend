import { AutoMap } from '@automapper/classes';

import { BaseDocumentWithIdRoDto } from '@/database/base-documents.ro-dto';

import { AttributesDomain } from '../../font.constants';

export class FontAttributesRoDto {
  @AutoMap()
  name: string;

  @AutoMap(() => String)
  domain: AttributesDomain;
}

export class FontRoDto extends BaseDocumentWithIdRoDto {
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap(() => [FontAttributesRoDto])
  attributes: FontAttributesRoDto[];
}
