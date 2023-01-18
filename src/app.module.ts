import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmConectDB } from './ormconfig';
import { Module } from '@nestjs/common';
import { UserModule } from '@User/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from '@Systems/http-error.filter';
import { LoggingInterceptor } from '@Systems/logging.interceptor';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmConectDB,
    UserModule,
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `From mail ${config.get('MAIL_USER')}`,
        },
        template: {
          dir: join(__dirname, 'src/templateMail'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
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
