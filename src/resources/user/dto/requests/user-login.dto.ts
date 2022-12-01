import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class UserLogin {
  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty()
  @Length(8, 18, { message: 'Senha deve conter entre 8 e 18 caracteres.' })
  password: string;
}
