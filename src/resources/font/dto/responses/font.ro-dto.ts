import { AutoMap } from '@automapper/classes';

import { BaseDocumentWithIdRoDto } from '@/database/base-documents.ro-dto';

import { AttributesDomain, ObjectListDomain } from '../../font.constants';

export class AttributeSchemaRoDto {
  @AutoMap(() => [String])
  keys: string[];

  @AutoMap(() => [String])
  domains: ObjectListDomain[];
}

export class FontAttributesRoDto {
  @AutoMap()
  name: string;

  @AutoMap(() => String)
  domain: AttributesDomain;

  @AutoMap(() => AttributeSchemaRoDto)
  schema?: AttributeSchemaRoDto;
}

export class FontRoDto extends BaseDocumentWithIdRoDto {
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap(() => [FontAttributesRoDto])
  attributes: FontAttributesRoDto[];
}
