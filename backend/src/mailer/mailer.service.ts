import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { join } from 'path';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendEmail(email: string, name: string): Promise<void> {
    // const template = join(__dirname, '..', 'templates', 'welcome.hbs');
    const context = { name };
    const subject = 'Welcome to our app!';
    const to = email;

    await this.mailerService.sendMail({
      to,
      subject,
      template: 'verify-account.hbs',
      context,
    });
  }
  async sendVerificationMail(user: User, token: string): Promise<void> {
    const context = {
      user,
      token,
      app_url: this.configService.env.APP_URL,
      app_name: 'Budget Planner',
      url: `${this.configService.env.APP_URL}/auth/verify?token=${token}&user_id=${user.id}`,
    };
    const subject = 'Verify your account';
    const to = user['email'];

    await this.mailerService.sendMail({
      to,
      subject,
      template: 'verify-account.hbs',
      context,
    });
  }

  async sendForgetPasswordMail(user: object, token: string): Promise<void> {
    const context = {
      user,
      token,
      app_url: this.configService.env.APP_URL,
      app_name: 'Budget Planner',
      url: `${this.configService.env.APP_URL}/auth/reset-password?token=${token}&user_id=${user['id']}`,
    };
    const subject = 'Reset your password';
    const to = user['email'];

    await this.mailerService.sendMail({
      to,
      subject,
      template: 'forget-password.hbs',
      context,
    });
  }
}
