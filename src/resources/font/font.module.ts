import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FontController } from './font.controller';
import { FontProfile } from './font.profile';
import { FontService } from './font.service';
import { FontSchema } from './schema/font.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Font', schema: FontSchema }])],
  controllers: [FontController],
  providers: [FontService, FontProfile],
})
export class FontModule {}
