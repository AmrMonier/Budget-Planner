// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IsVerifiedGuard } from '../utils/IsVerified.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return {
      message: 'Registration successful, check your mail for verification ',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginDto) {
    const user = await this.authService.login({ email, password });
    return user;
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Query() verificationPayload: VerifyUserDto) {
    await this.authService.verifyAccount(verificationPayload);
    return {
      message: 'Account verified successfully, you can login now',
    };
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() { email }: ForgetPasswordDto) {
    await this.authService.forgetPassword({ email });
    return {
      message:
        'if we found an account associated with this email, we will send you an email with the reset password instructions',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() { email, password, code }: ResetPasswordDto) {
    await this.authService.resetPassword({
      email,
      password,
      code,
    });
    return { message: 'password reset successfully' };
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'), IsVerifiedGuard)
  // @UseGuards(IsVerifiedGuard)
  async getLoggedInUser(@Req() { user }: Request) {
    return { ...user, password: undefined };
  }
}
