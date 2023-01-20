import { ENV_CONFIG } from './constants/env.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const ConnectDatabase = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get(ENV_CONFIG.DB_HOST),
    port: +configService.get(ENV_CONFIG.DB_PORT),
    username: configService.get(ENV_CONFIG.DB_USER),
    password: configService.get(ENV_CONFIG.DB_PASSWORD),
    database: configService.get(ENV_CONFIG.DB_NAME),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    // logging: true,
    synchronize: true,
  }),
  inject: [ConfigService],
});
