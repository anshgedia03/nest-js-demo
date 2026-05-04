import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UiModule } from './ui.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UiModule);
  app.setBaseViewsDir(join(process.cwd(), 'apps/ui-service/views'));
  app.setViewEngine('ejs');
  await app.listen(process.env.UI_PORT ?? 7000);
}
bootstrap();
