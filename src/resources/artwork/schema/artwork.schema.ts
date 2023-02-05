import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseDocumentWithId } from '@/database/base-documents.schema';

export class ArtworkAttributes {
  @Prop({ required: true })
  @AutoMap()
  name: string;

  @Prop({ required: true })
  @AutoMap()
  value: string;
}

export class ArtworkComments {
  @Prop({ required: true })
  @AutoMap()
  id: string;

  @Prop({ required: true })
  @AutoMap()
  comment: string;

  @Prop({ required: true })
  @AutoMap()
  userId: string;

  @Prop({ required: true })
  @AutoMap()
  fullName: string;

  @Prop({ required: true })
  @AutoMap()
  created_at: Date;
}

export type ArtworkDocument = HydratedDocument<Artwork>;

@Schema()
export class Artwork extends BaseDocumentWithId {
  @Prop({ unique: true })
  @AutoMap()
  code: string;

  @Prop()
  @AutoMap()
  title: string;

  @Prop()
  @AutoMap()
  font: string;

  @Prop()
  @AutoMap()
  filePath: string;

  @Prop({ schema: ArtworkAttributes })
  @AutoMap(() => [ArtworkAttributes])
  attributes: ArtworkAttributes[];

  @Prop()
  @AutoMap()
  comments: ArtworkComments[];
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);
