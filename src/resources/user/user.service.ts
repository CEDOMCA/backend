import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isValidObjectId, Model } from 'mongoose';

import { MailService } from '@/resources/mail/mail.service';
import { Roles } from '@/resources/user/user.constants';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

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

  async passwordRecoveryEmail(email: string): Promise<void> {
    const user = await this.findOneByEmail(email);

    if (!user) return;

    user.authKey = jwt.sign({ email: user.email }, this.configService.get('JWT_SECRET'), {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
    await user.save();

    const changePasswordUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/change-password?authKey=${user.authKey}`;

    await this.mailService.sendPasswordRecoveryEmail(user.email, user.fullName, changePasswordUrl);
  }

  async changeUserPassword(password: string, authKey: string) {
    try {
      const decodedAuthKey = jwt.verify(authKey, this.configService.get('JWT_SECRET')) as {
        email: string;
      };
      const user = await this.userModel.findOne({
        authKey,
        email: decodedAuthKey.email,
      });
      if (!user) throw new BadRequestException('Token de recuperação de senha inválido.');
      const hashedPassword = await hash(password, 12);
      await this.userModel.findOneAndUpdate(
        { email: decodedAuthKey.email },
        {
          password: hashedPassword,
          authKey: undefined,
        },
      );
    } catch (error) {
      throw new BadRequestException('Token de recuperação de senha inválido.');
    }
  }
}
