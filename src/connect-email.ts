import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const ConnectEmail = MailerModule.forRootAsync({
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
});
