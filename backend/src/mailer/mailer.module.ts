import { Module } from '@nestjs/common';
import {
  HandlebarsAdapter,
  MailerOptions,
  MailerModule as NodeMailerModule,
} from '@nest-modules/mailer';
import { ConfigService } from 'src/config/config.service';
import { EmailService } from './mailer.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    ConfigModule,
    NodeMailerModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<MailerOptions> => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.env.NODEMAILER_USER,
            pass: configService.env.NODEMAILER_PASSWORD,
          },
        },
        defaults: {
          from: `"No Reply" <${configService.env.NODEMAILER_USER}>`,
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class MailerModule {}
