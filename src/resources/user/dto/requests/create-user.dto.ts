import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

import { Roles } from '@/resources/user/user.constants';
export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'Nome inválido.' })
  fullName: string;

  @ApiProperty()
  @IsDateString({}, { message: 'Data de nascimento inválida.' })
  birthDate: Date;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty()
  @Length(8, 18, { message: 'Senha deve conter entre 8 e 18 caracteres.' })
  password: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty({ enum: Roles, required: false })
  @IsOptional()
  @IsEnum(Roles, { message: 'Função inválida.' })
  role: string;
}
