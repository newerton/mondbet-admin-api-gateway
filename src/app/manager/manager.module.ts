import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerRequestDataMiddleware } from 'src/common/middlewares/manager-request-data.middleware';
import { ManagerLimit } from './entities/manager-limit.entity';
import { Manager } from './entities/manager.entity';
import { ManagerAddress } from './entities/manager-address.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { CaslModule } from 'src/common/casl/casl.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt-auth.guard';
import { ManagerRole } from './entities/manager_role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Manager,
      ManagerAddress,
      ManagerLimit,
      ManagerRole,
    ]),
    CaslModule,
  ],
  controllers: [ManagerController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ManagerService,
  ],
  exports: [ManagerService],
})
export class ManagerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ManagerRequestDataMiddleware).forRoutes(ManagerController);
  }
}
