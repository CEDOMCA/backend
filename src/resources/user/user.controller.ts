import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Controller, Post, Body, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto, UserRoDto } from './dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly userService: UserService,
  ) {}

  /**
   * Create a new user.
   */
  @ApiConflictResponse({ description: 'O e-mail já está cadastrado' })
  @ApiBadRequestResponse({ description: 'Algum campo não segue suas restrições' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const savedUser = await this.userService.create(createUserDto);

    return this.mapper.mapAsync(savedUser, User, UserRoDto);
  }

  /**
   * Delete a user. If the user does not exist, it is ignored.
   */
  @Delete(':user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Usuário deletado com sucesso.' })
  async delete(@Param('user_id') id: string) {
    return this.userService.delete(id);
  }
}
