import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile } from './entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileLimit } from './entities/profile-limit.entity';
import { ProfileRequestDataMiddleware } from 'src/common/middlewares/profile-request-data.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, ProfileLimit])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProfileRequestDataMiddleware).forRoutes(ProfileController);
  }
}
