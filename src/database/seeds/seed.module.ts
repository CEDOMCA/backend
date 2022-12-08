import { Module } from '@nestjs/common';

import { FontModule } from '@/resources/font/font.module';

import { SeedService } from './seed.service';

@Module({
  imports: [FontModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
