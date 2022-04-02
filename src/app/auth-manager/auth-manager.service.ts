import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginAuthDto } from '../auth/dto/login-auth.dto';
import { Manager } from '../manager/entities/manager.entity';
import { ManagerService } from '../manager/manager.service';

@Injectable()
export class AuthManagerService {
  constructor(
    private readonly managerService: ManagerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  validateUser(id: string): Promise<Manager | undefined> {
    return this.managerService.exist(id);
  }

  async login({ email, password }: LoginAuthDto) {
    const user = await this.managerService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('E-mail e/ou senha inválidos.');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new BadRequestException('E-mail e/ou senha inválidos.');
    }

    if (!user.visible) {
      throw new BadRequestException('E-mail e/ou senha inválidos.');
    }

    // const resource_access = user.roles.map((item) => ({
    //   resource: item.resource,
    //   roles: {
    //     create: item.create,
    //     read: item.read,
    //     update: item.update,
    //   },
    // }));

    const payload = {
      jti: randomUUID(),
      sub: user.id,
      entity: 'manager',
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      header: {
        alg: 'HS256',
        kid: randomUUID(),
      },
    });

    return {
      access_token,
    };
  }
}
