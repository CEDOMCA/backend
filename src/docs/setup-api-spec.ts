import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SetupApiSpecOptions, SwaggerOptions } from './setup-api-docs.interfaces';
import { CaseInsensitiveFilterPlugin } from './swagger-ui-plugins';

export const setupApiSpec = (app: INestApplication, specOpts: SetupApiSpecOptions = {}) => {
  const { pageTitle = 'CEDOMCA API Specification', path = 'swagger' } = specOpts;

  const baseDocument = new DocumentBuilder()
    .setTitle('CEDOMCA API')
    .setDescription('The CEDOMCA API description')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, baseDocument);

  SwaggerModule.setup(path, app, swaggerDocument, {
    customSiteTitle: pageTitle,
    swaggerOptions: <SwaggerOptions>{
      plugins: [CaseInsensitiveFilterPlugin],
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
      persistAuthorization: true,
      withCredentials: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      defaultModelRendering: 'model',
      tagsSorter: 'alpha',
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
    },
  });

  return swaggerDocument;
};
