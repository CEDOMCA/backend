import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GcpStorageModule } from '@/gcp-storage/gcp.storage.module';

import { ArtworkController } from './artwork.controller';
import { ArtworkProfile } from './artwork.profile';
import { ArtworkService } from './artwork.service';
import { ArtworkSchema } from './schema/artwork.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Artwork', schema: ArtworkSchema }]),
    GcpStorageModule,
  ],
  controllers: [ArtworkController],
  providers: [ArtworkService, ArtworkProfile],
  exports: [ArtworkService, MongooseModule],
})
export class ArtworkModule {}
