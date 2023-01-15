import { TypeOrmConectDB } from './ormconfig';
import { Module } from '@nestjs/common';
import { UserModule } from '@User/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from '@Systems/http-error.filter';
import { LoggingInterceptor } from '@Systems/logging.interceptor';

@Module({
  imports: [TypeOrmConectDB, UserModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter, // import httpError vào module
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // import interceptor vào module
    },
  ],
})
export class AppModule {}
