import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateArtworkAttributes {
  @IsNotEmpty({ message: 'O nome do atributo é obrigatório.' })
  name: string;

  @IsNotEmpty({ message: 'O valor do atributo é obrigatório.' })
  value: string;
}

export class CreateArtworkDto {
  @IsNotEmpty({ message: 'O código da obra é obrigatório.' })
  code: string;

  @IsNotEmpty({ message: 'O título da obra é obrigatório.' })
  title: string;

  @IsNotEmpty({ message: 'A fonte da obra é obrigatória.' })
  font: string;

  @ValidateNested()
  @Type(() => CreateArtworkAttributes)
  attributes: CreateArtworkAttributes[];
}
