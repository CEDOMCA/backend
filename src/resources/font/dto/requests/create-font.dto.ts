import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { IsDomainAnObjectList } from '@/common/is-domain-an-object-list.decorator';

import { AttributesDomain, ObjectListDomain } from '../../font.constants';

export class CreateAttributeSchemaDto {
  @AutoMap(() => [String])
  keys: string[];

  @IsEnum(ObjectListDomain, {
    message: `O valor de 'domains' deve ser um de [${ObjectListDomain.textual}, ${ObjectListDomain.alphanumeric}, ${ObjectListDomain.numeric}].`,
    each: true,
  })
  @ApiProperty({ enum: ObjectListDomain })
  @AutoMap(() => [String])
  domains: ObjectListDomain[];
}

export class CreateFontAttributesDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do atributo é obrigatório.' })
  @AutoMap()
  name: string;

  @IsEnum(AttributesDomain, {
    message: `O valor de 'domain' deve ser um de [${AttributesDomain.textual}, ${AttributesDomain.alphanumeric}, ${AttributesDomain.numeric} ou ${AttributesDomain.object_list}].`,
  })
  @ApiProperty({ enum: AttributesDomain })
  @AutoMap(() => String)
  domain: AttributesDomain;

  /**
   * The `schema` should only be defined when the `domain` is `object list`.
   */
  @IsDomainAnObjectList('domain', {
    message: 'O valor de `schema` deve ser definido apenas quando `domain` é `object list`.',
  })
  @ValidateNested()
  @Type(() => CreateAttributeSchemaDto)
  @AutoMap()
  schema?: CreateAttributeSchemaDto[];
}

export class CreateFontDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da fonte é obrigatório.' })
  @AutoMap()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição da fonte é obrigatória.' })
  @AutoMap()
  description: string;

  @ValidateNested()
  @Type(() => CreateFontAttributesDto)
  @AutoMap()
  attributes: CreateFontAttributesDto[];
}
