import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { ConfigModule } from 'src/config/config.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { Token } from './entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    ConfigModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
