import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseDocumentWithId } from '@/database/base-documents.schema';

import { AttributesDomain } from '../font.constants';

export class FontAttributes {
  @AutoMap()
  name: string;

  @AutoMap()
  domain: AttributesDomain;
}

export type FontDocument = HydratedDocument<Font>;

@Schema()
export class Font extends BaseDocumentWithId {
  @Prop({ unique: true })
  @AutoMap()
  name: string;

  @Prop()
  @AutoMap()
  description: string;

  @Prop()
  @AutoMap(() => [FontAttributes])
  attributes: FontAttributes[];
}

export const FontSchema = SchemaFactory.createForClass(Font);
