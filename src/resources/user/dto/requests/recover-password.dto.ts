import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoverPassordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;
}
