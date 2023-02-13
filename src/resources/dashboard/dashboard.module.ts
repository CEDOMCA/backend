import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArtworkSchema } from '@/resources/artwork/schema/artwork.schema';
import { FontSchema } from '@/resources/font/schema/font.schema';
import { UserSchema } from '@/resources/user/schemas/user.schema';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Artwork', schema: ArtworkSchema },
      { name: 'Font', schema: FontSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
