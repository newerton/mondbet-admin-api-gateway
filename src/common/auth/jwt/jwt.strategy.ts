import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthManagerService } from 'src/app/auth-manager/auth-manager.service';
import { AuthService } from 'src/app/auth/auth.service';

type ResourceAccessProps = {
  resource: string;
  create: boolean;
  read: boolean;
  update: boolean;
};

export type JwtData = {
  id: string;
  manager_id?: string;
  entity: string;
  resource_access: ResourceAccessProps[] | null;
};
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

  async validate(payload: any): Promise<JwtData> {
    const id = payload.sub;
    const entity = payload.entity;
    let manager_id = null;
    let resource_access = [];

    let userExists = null;
    if (entity === 'user') {
      userExists = await this.authService.validateUser(id);
    } else if (entity === 'manager') {
      userExists = await this.authManagerService.validateUser(id);
      manager_id = userExists.manager_id;
      resource_access = userExists.roles;
    }
    if (!userExists) {
      throw new UnauthorizedException();
    }
    return { id, manager_id, resource_access, entity: payload.entity };
  }
}
