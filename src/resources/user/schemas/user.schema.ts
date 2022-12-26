import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseDocumentWithId } from '@/database/base-documents.schema';
import { Roles } from '@/resources/user/user.constants';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends BaseDocumentWithId {
  @Prop()
  @AutoMap()
  email: string;

  @Prop()
  @AutoMap()
  password: string;

  @Prop()
  @AutoMap()
  status: boolean;

  @Prop({
    enum: Roles,
  })
  @AutoMap(() => String)
  role: Roles;

  @Prop()
  @AutoMap()
  fullName: string;

  @Prop()
  @AutoMap()
  birthDate: Date;

  @Prop()
  @AutoMap()
  country: string;

  @Prop()
  @AutoMap()
  state: string;

  @Prop()
  @AutoMap()
  city: string;

  @Prop()
  @AutoMap()
  createdAt: Date;

  @Prop()
  @AutoMap()
  authKey?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
