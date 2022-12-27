import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, Length } from 'class-validator';

export class QueryChangePasswordDto {
  @ApiProperty()
  @IsJWT({ message: 'Chave de recuperação de senha não é um token válido.' })
  authKey: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @Length(8, 18, { message: 'Senha deve conter entre 8 e 18 caracteres.' })
  password: string;
}
