import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { AttributesDomain } from '../../font.constants';

export class CreateFontAttributesDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do atributo é obrigatório.' })
  @AutoMap()
  name: string;

  @IsEnum(AttributesDomain, {
    message: `O valor de 'domain' deve ser um de [${AttributesDomain.alphabetic}, ${AttributesDomain.alphanumeric} ou ${AttributesDomain.numeric}].`,
  })
  @ApiProperty({ enum: AttributesDomain })
  @AutoMap(() => String)
  domain: AttributesDomain;
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
