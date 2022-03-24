import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentRequestDataMiddleware } from 'src/common/middlewares/agent-request-data.middleware';
import { AgentLimit } from './entities/agent-limit.entity';
import { Agent } from './entities/agent.entity';
import { AgentAddress } from './entities/agent-address.entity';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { Manager } from '../manager/entities/manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent, AgentAddress, AgentLimit, Manager]),
  ],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AgentRequestDataMiddleware).forRoutes(AgentController);
  }
}
