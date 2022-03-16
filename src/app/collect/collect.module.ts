import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CollectService } from './collect.service';
import { CollectController } from './collect.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collect } from './entities/collect.entity';
import { CollectAddress } from './entities/collect-address.entity';
import { CollectRequestDataMiddleware } from 'src/common/middlewares/collect-request-data.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Collect, CollectAddress])],
  controllers: [CollectController],
  providers: [CollectService],
  exports: [CollectService],
})
export class CollectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CollectRequestDataMiddleware)
      .forRoutes({ path: 'collect', method: RequestMethod.POST });
  }
}
