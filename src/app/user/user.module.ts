import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRequestDataMiddleware } from 'src/common/middlewares/user-request-data.middleware';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/user_address.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserRequestDataMiddleware)
      .forRoutes({ path: 'user', method: RequestMethod.POST });
  }
}
