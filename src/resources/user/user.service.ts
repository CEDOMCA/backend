import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { isValidObjectId, Model } from 'mongoose';

import { Roles } from '@/resources/user/user.constants';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.password, 12);

    if (await this.findOneByEmail(createUserDto.email))
      throw new ConflictException('E-mail já cadastrado.');

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      status: true,
      createdAt: new Date(),
      role: Roles.visitor,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | undefined> {
    if (!isValidObjectId(id) || !(await this.findOne(id))) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    return updatedUser;
  }

  async delete(id: string): Promise<User | undefined> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
