import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  Put,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateUserDto,
  UserRoDto,
  UpdateUserDto,
  RecoverPasswordDto,
  QueryChangePasswordDto,
  ChangePasswordDto,
} from './dto';
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
   * Show all informations of all users.
   */
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return this.mapper.mapArrayAsync(users, User, UserRoDto);
  }

  /**
   * Show all informations of a given user.
   */
  @Get(':user_id')
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  async findOne(@Param('user_id') id: string) {
    const user = await this.userService.findOne(id);
    return this.mapper.mapAsync(user, User, UserRoDto);
  }

  /**
   * Create a new user.
   */
  @Post()
  @ApiConflictResponse({ description: 'O e-mail já está cadastrado' })
  @ApiBadRequestResponse({ description: 'Algum campo não segue suas restrições' })
  async create(@Body() createUserDto: CreateUserDto) {
    const savedUser = await this.userService.create(createUserDto);
    return this.mapper.mapAsync(savedUser, User, UserRoDto);
  }

  /**
   * Replace all informations of a given user.
   * If the user does not exist, throw an exception.
   */
  @Put(':user_id')
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  async update(@Param('user_id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return this.mapper.mapAsync(updatedUser, User, UserRoDto);
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

  @Post('recover-password')
  async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    await this.userService.recoverPasswordForUser(recoverPasswordDto.email);

    return {
      message: 'Um e-mail foi enviado para você com as instruções para recuperar sua senha.',
    };
  }

  @Patch('change-password')
  changePassword(
    @Query() queryChangePasswordDto: QueryChangePasswordDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.userService.changePasswordForUser(
      changePasswordDto.password,
      queryChangePasswordDto.authKey,
    );
  }
}
