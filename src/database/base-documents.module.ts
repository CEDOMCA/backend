import { Module } from '@nestjs/common';

import { BaseDocumentsProfile } from '@/database/base-documents.profile';

@Module({
  providers: [BaseDocumentsProfile],
})
export class BaseDocumentsModule {}
