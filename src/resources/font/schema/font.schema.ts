import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseDocumentWithId } from '@/database/base-documents.schema';

import { AttributesDomain, ObjectListDomain } from '../font.constants';

export class AttributeSchema {
  @AutoMap(() => [String])
  keys: string[];

  @Prop({ enum: [ObjectListDomain] })
  @AutoMap(() => [String])
  domains: ObjectListDomain[];
}

export class FontAttributes {
  @Prop()
  @AutoMap()
  name: string;

  @Prop({ enum: AttributesDomain })
  @AutoMap(() => String)
  domain: AttributesDomain;

  @Prop({ schema: AttributeSchema, required: false })
  @AutoMap(() => AttributeSchema)
  schema?: AttributeSchema;
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
