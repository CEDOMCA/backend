import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app/app.module';
import { SeedModule } from '@/database/seeds/seed.module';
import { SeedService } from '@/database/seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });

  const seedService = app.select(SeedModule).get(SeedService);
  const predefinedFonts = await seedService.seedPredefinedFonts();

  console.log(predefinedFonts);

  return app.close();
}

bootstrap()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
