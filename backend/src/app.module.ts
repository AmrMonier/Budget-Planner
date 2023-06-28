import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { VerifiedMiddleware } from './middlewares/verified.middleware';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        host: configService.env.DB_HOST,
        password: configService.env.DB_PASSWORD,
        database: configService.env.DB_NAME,
        username: configService.env.DB_USER,
        port: configService.env.DB_PORT,
        type: 'postgres',
        synchronize: true,
        autoLoadEntities: true,
        ssl: configService.env.DB_SSL,
        entities: ['src/**/**.entity.(ts|js)'],
      }),
    }),
    MailerModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
