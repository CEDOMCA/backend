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

  @Prop({ schema: ArtworkAttributes })
  @AutoMap(() => [ArtworkAttributes])
  attributes: ArtworkAttributes[];
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);
