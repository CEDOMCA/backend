import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString({ message: 'O comentário deve ser uma string.' })
  @IsNotEmpty({ message: 'O comentário não pode estar vazio.' })
  @MaxLength(1000, {
    message: 'O comentário deve ter no máximo 1000 caracteres.',
  })
  comment: string;
}
