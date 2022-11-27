import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UnauthenticatedGuard } from '@/resources/auth/guards';

import { CreateUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UnauthenticatedGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
