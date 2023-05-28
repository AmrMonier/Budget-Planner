// src/auth/user.service.ts

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { ConfigService } from 'src/config/config.service';
import { MailerService } from 'src/mailer/mailer.service';
import { Token } from '../entities/token.entity';
import { randomBytes } from 'crypto';
import { VerifyUserDto } from '../dto/verify-user.dto';
import {
  createUser,
  forgetPassword,
  login,
  resetPassword,
} from '../utils/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async register(createUserDto: createUser): Promise<void> {
    // Check if user with the provided email already exists
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException({
        errors: ['Email is already registered'],
      });
    }

    // Create a new user entity and save it to the database
    const user = this.userRepository.create({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });
    await this.userRepository.save(user);

    this.mailerService.sendVerificationMail(
      user,
      await this.generateVerificationToken(user.id || 5, 'verify'),
    );
  }

  async login({
    email,
    password,
  }: login): Promise<{ user: object; token: string }> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !(await compare(password, user.password))) {
      throw new BadRequestException({ errors: ['Invalid email or password'] });
    }

    if (!user.isVerified) {
      this.mailerService.sendVerificationMail(
        user,
        await this.generateVerificationToken(user.id, 'verify'),
      );
      throw new ForbiddenException({
        errors: [
          'your email is not verified, a mail with the verification link was sent to you. check your inbox',
        ],
      });
    }

    // Generate JWT token
    const token = sign({ userId: user.id }, this.configService.env.APP_SECRET, {
      expiresIn: '1h',
    });
    return {
      user: { ...user, password: undefined },
      token,
    };
  }

  async forgetPassword({ email }: forgetPassword): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return;
    }
    await this.tokenRepository.delete({ user_id: user.id });
    this.mailerService.sendForgetPasswordMail(
      user,
      await this.generateVerificationToken(user.id, 'reset'),
    );
  }

  async resetPassword({ code, email, password }: resetPassword) {
    const token = await this.tokenRepository.findOne({
      where: {
        type: 'reset',
        token: code,
      },
      relations: {
        user: true,
      },
    });
    if (
      token ||
      token.expires_at.getTime() < Date.now() ||
      token.user.email !== email
    )
      throw new BadRequestException({ errors: ['Invalid Code'] });
    token.user.password = await hash(password, 10);
    await token.user.save();
  }

  async verifyAccount({ token, user_id }: VerifyUserDto) {
    const verificationToken = await this.tokenRepository.findOneBy({
      type: 'verify',
      user_id,
      token,
    });
    if (
      !verificationToken ||
      verificationToken.expires_at.getTime() < Date.now()
    )
      throw new ForbiddenException({ errors: ['Invalid token'] });
    const user = await this.userRepository.findOneBy({ id: user_id });
    if (user.isVerified) {
      await verificationToken.remove();
      throw new ForbiddenException({
        errors: ['Account already been verified'],
      });
    }
    user.isVerified = true;
    await user.save();
    await verificationToken.remove();
  }

  private async generateVerificationToken(
    userId: number,
    type: 'verify' | 'reset',
  ) {
    let token: string;
    switch (type) {
      case 'verify':
        token = randomBytes(16).toString('hex');
        break;
      case 'reset':
        token = Math.random().toString(36).slice(2);
        break;
    }
    const verificationToken = this.tokenRepository.create({
      user_id: userId,
      token,
      expires_at: new Date(Date.now() + 30 * 60 * 1000),
      type,
    });
    await verificationToken.save();
    return verificationToken.token;
  }
}
