import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/auth/entities/user.entity';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { compile as CompileTemplate } from 'handlebars';
import { InformativeMail, TokenizedMail } from './utils/mailer.types';
@Injectable()
export class MailerService {
  private mailService: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.mailService = createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.env.NODEMAILER_USER,
        pass: this.configService.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendVerificationMail(user: User, token: string) {
    const dynamicTemplateData = {
      url: `${this.configService.env.APP_URL}/auth/verify?token=${token}&user_id=${user.id}`,
      app_name: 'Budget Planner',
      app_url: this.configService.env.APP_URL,
    };
    const htmlTemplate = readFileSync(
      join(__dirname, '../', 'mails', 'verify-account.html'),
      'utf-8',
    );
    const template = CompileTemplate<TokenizedMail>(htmlTemplate);
    return this.send({
      to: user.email,
      from: this.configService.env.NODEMAILER_USER,
      subject: 'E-Mail verification',
      html: template(dynamicTemplateData),
    });
  }

  async sendForgetPasswordMail(user: User, token: string) {
    const dynamicTemplateData = {
      url: `${this.configService.env.APP_URL}/auth/reset-password?token=${token}&user_id=${user.id}`,
      app_name: 'Budget Planner',
      app_url: this.configService.env.APP_URL,
    };

    const htmlTemplate = readFileSync(
      join(__dirname, '../', 'mails', 'forget-password.html'),
      'utf-8',
    );

    const template = CompileTemplate<TokenizedMail>(htmlTemplate);
    return this.send({
      to: user.email,
      from: this.configService.env.NODEMAILER_USER,
      subject: 'Reset your Budget planner Password',
      html: template(dynamicTemplateData),
    });
  }
  async sendRestedPasswordMail(user: User) {
    const dynamicTemplateData: InformativeMail = {
      app_name: 'Budget Planner',
      app_url: this.configService.env.APP_URL,
    };

    const htmlTemplate = readFileSync(
      join(__dirname, '../', 'mails', 'forget-password.html'),
      'utf-8',
    );

    const template = CompileTemplate<InformativeMail>(htmlTemplate);
    return this.send({
      to: user.email,
      from: this.configService.env.NODEMAILER_USER,
      subject: 'Reset your Budget planner Password',
      html: template(dynamicTemplateData),
    });
  }

  async send(emailPayload: SendMailOptions): Promise<void> {
    try {
      await this.mailService.sendMail(emailPayload);
    } catch (error) {
      throw new Error('Failed to send email.');
    }
  }
}
