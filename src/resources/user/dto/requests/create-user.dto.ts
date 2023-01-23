import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

import { BeetweenYearsOld } from '@/common/beetween-years-old.decorator';
import { HasNames } from '@/common/has-two-names.decorator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Nome completo é obrigatório.' })
  @HasNames(2, { message: 'Nome completo deve ser composto por pelo menos dois nomes.' })
  @MaxLength(50, { message: 'Nome completo deve ter no máximo 50 caracteres.' })
  fullName: string;

  @ApiProperty()
  @IsDateString({}, { message: 'Data de nascimento é obrigatória.' })
  @BeetweenYearsOld(1, 100, { message: 'Data de nascimento inválida.' })
  birthDate: Date;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty()
  @Length(8, 18, { message: 'Senha deve conter entre 8 e 18 caracteres.' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'País é obrigatório.' })
  @IsString({ message: 'País deve ser uma string.' })
  country: string;

  @ApiProperty()
  @IsString({ message: 'Estado deve ser uma string.' })
  @IsNotEmpty({ message: 'Estado é obrigatório.' })
  state: string;

  @ApiProperty()
  @IsString({ message: 'Cidade deve ser uma string.' })
  @IsNotEmpty({ message: 'Cidade é obrigatória.' })
  city: string;
}
