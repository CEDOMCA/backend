import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GcpServiceAccountKey } from '@/gcp-storage/gcp-storage.interfaces';

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'STORAGE_CONNECTION',
      useFactory: (configService: ConfigService) => {
        const decodedGcpSa = JSON.parse(
          Buffer.from(configService.get<string>('GCP_SA_ENCODED_KEY'), 'base64').toString('utf-8'),
        ) as GcpServiceAccountKey;

        return new Storage({
          projectId: decodedGcpSa.project_id,
          credentials: decodedGcpSa,
        });
      },
    },
  ],
  exports: ['STORAGE_CONNECTION'],
})
export class GcpStorageModule {}
