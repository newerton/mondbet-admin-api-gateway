import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthManagerService } from 'src/app/auth-manager/auth-manager.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly authManagerService: AuthManagerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    const id = payload.sub;
    const entity = payload.entity;
    let userExists = null;

    if (entity === 'user') {
      userExists = await this.authService.validateUser(id);
    } else if (entity === 'manager') {
      userExists = await this.authManagerService.validateUser(id);
    }
    if (!userExists) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, entity: payload.entity };
  }
}
