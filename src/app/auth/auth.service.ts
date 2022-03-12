import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login({ email }: LoginAuthDto) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('E-mail e/ou senha inválidos.');
    }

    // const passwordMatched = await compare(passwordCurrent, user.passwordCurrent);
    // if (!passwordMatched) {
    //   throw new BadRequestException('E-mail e/ou senha inválidos.');
    // }

    if (!user.visible) {
      throw new BadRequestException('E-mail e/ou senha inválidos.');
    }

    const payload = {
      jti: randomUUID(),
      sub: user.id,
    };

    // const keysFolder = resolve(
    //   __dirname,
    //   '..',
    //   '..',
    //   '..',
    //   'src',
    //   'common',
    //   'auth',
    //   'keys',
    // );
    // const privateKey = fs.readFileSync(`${keysFolder}/private_key.pem`);
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      // privateKey,
      // algorithm: 'HS256',
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
