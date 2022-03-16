import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientAddress } from './entities/client-address.entity';
import { ClientRequestDataMiddleware } from 'src/common/middlewares/client-request-data.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Client, ClientAddress])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClientRequestDataMiddleware)
      .forRoutes({ path: 'client', method: RequestMethod.POST });
  }
}
