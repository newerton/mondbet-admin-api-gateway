import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './app/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { JoiValidationExceptionFilter } from './common/filters/joi.validation-exception.filter';
import { UserModule } from './app/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportModule } from './app/sport/sport.module';
import config from 'ormconfig';
import { StateModule } from './app/state/state.module';
import { CityModule } from './app/city/city.module';
import { ProfileModule } from './app/profile/profile.module';
import { ManagerModule } from './app/manager/manager.module';
import { AuthManagerModule } from './app/auth-manager/auth-manager.module';
import { AgentModule } from './app/agent/agent.module';
import { CollectModule } from './app/collect/collect.module';
import { ClientModule } from './app/client/client.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(config),
    AuthModule,
    AuthManagerModule,
    AgentModule,
    CollectModule,
    ClientModule,
    ManagerModule,
    ProfileModule,
    SportModule,
    UserModule,
    StateModule,
    CityModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: JoiValidationExceptionFilter,
    },
  ],
})
export class AppModule {}
