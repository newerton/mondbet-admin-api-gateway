import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerRequestDataMiddleware } from 'src/common/middlewares/manager-request-data.middleware';
import { ManagerLimit } from './entities/manager-limit.entity';
import { Manager } from './entities/manager.entity';
import { ManagerAddress } from './entities/manager-address.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([Manager, ManagerAddress, ManagerLimit])],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ManagerRequestDataMiddleware)
      .forRoutes({ path: 'manager', method: RequestMethod.POST });
  }
}
