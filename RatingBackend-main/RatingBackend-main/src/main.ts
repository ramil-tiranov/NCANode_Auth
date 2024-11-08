import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/logger.service';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); 
  const app = await NestFactory.create(AppModule);
  const logger = app.get(CustomLogger);
  
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = process.env.PORT || 5000; 
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
  logger.log(`Application is running in ${process.env.DEBUG_LOGS === 'true' ?  'debug mode' : 'normal mode'}`)

}
bootstrap();
