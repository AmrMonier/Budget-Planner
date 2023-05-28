import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { ConfigModule } from 'src/config/config.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailerModule, ConfigModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
