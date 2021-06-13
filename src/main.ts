import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  const port = process.env.port || serverConfig.port;
  await app.listen(port);
  logger.log(`Application Listening on port ${port}`);
}
bootstrap();
