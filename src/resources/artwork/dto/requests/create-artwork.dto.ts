import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArtworkAttributes {
  @ApiProperty()
  @IsNotEmpty({ message: 'O nome do atributo é obrigatório.' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O valor do atributo é obrigatório.' })
  value: string;
}

export class CreateArtworkDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O código da obra é obrigatório.' })
  code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O título da obra é obrigatório.' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'A fonte da obra é obrigatória.' })
  font: string;

  @ApiProperty({
    type: [CreateArtworkAttributes],
  })
  attributes: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: BinaryType;
}
