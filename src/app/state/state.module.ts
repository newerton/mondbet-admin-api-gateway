import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, State])],
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
