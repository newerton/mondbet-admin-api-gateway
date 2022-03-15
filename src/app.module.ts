import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ExceptionFilter } from './common/filters/rpc-exception.filter';
import { AuthModule } from './app/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AllExceptionFilter } from './common/filters/exception.filter';
import configuration from './common/config/configuration';
import { ErrorFilter } from './common/filters/error.filter';
import { JoiValidationExceptionFilter } from './common/filters/joi.validation-exception.filter';
import { UserModule } from './app/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportModule } from './app/sport/sport.module';
import config from 'ormconfig';
import { StateModule } from './app/state/state.module';
import { CityModule } from './app/city/city.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(config),
    AuthModule,
    UserModule,
    StateModule,
    CityModule,
    SportModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ResourceGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: JoiValidationExceptionFilter,
    },
  ],
})
export class AppModule {}
