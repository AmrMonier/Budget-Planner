import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.env.APP_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await User.findOneBy({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
