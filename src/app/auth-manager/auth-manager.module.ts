import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/auth/jwt/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { ManagerModule } from '../manager/manager.module';
import { AuthManagerController } from './auth-manager.controller';
import { AuthManagerService } from './auth-manager.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.expiresIn'),
        },
      }),
    }),
    forwardRef(() => AuthModule),
    ManagerModule,
  ],
  controllers: [AuthManagerController],
  providers: [AuthManagerService, JwtStrategy],
  exports: [AuthManagerService],
})
export class AuthManagerModule {}
