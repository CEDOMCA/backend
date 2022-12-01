import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const savedUser = await this.userService.create(createUserDto);

    return this.mapper.mapAsync(savedUser, User, UserRoDto);
  }
}
