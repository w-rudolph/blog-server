import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as multiparty from 'connect-multiparty';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(multiparty());
  app.use((req: any, res: any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'content-type,x-requested-with',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'PUT,POST,GET,DELETE,OPTIONS',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method.toLowerCase() === 'options') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  await app.listen(4000);
}
bootstrap();
