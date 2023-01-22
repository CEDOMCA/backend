import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'STORAGE_CONNECTION',
      useFactory: () => {
        return new Storage({
          // adicionar variáveis de ambiente
          projectId: 'cedomca',
          keyFilename: 'secrets/cedomca-3f1f43e49e36.json',
        });
      },
    },
  ],
  exports: ['STORAGE_CONNECTION'],
})
export class GcpStorageModule {}
