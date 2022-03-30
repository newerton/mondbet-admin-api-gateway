import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { JwtData } from 'src/common/auth/jwt/jwt.strategy';
import { Connection, getManager, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { ManagerService } from '../manager/manager.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentAddress } from './entities/agent-address.entity';
import { AgentLimit } from './entities/agent-limit.entity';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private repository: Repository<Agent>,
    @InjectRepository(AgentAddress)
    private agentAddressRepository: Repository<AgentAddress>,
    @InjectRepository(AgentLimit)
    private agentLimitRepository: Repository<AgentLimit>,
    private connection: Connection,
    private managerService: ManagerService,
  ) {}

  async create(data: CreateAgentDto, user: JwtData): Promise<void> {
    const { email, password, address, limit } = data;
    const exist = await this.findByEmail(email);

    if (exist) {
      throw new UnprocessableEntityException('E-mail já cadastrado');
    }

    if (user.entity === 'manager') {
      const manager = await this.managerService.findById(user.id);
      if (manager.manager_id === null) {
        data.manager_id = user.id;
        data.submanager_id = data.submanager_id || null;
      } else {
        data.submanager_id = user.id;
        data.manager_id = manager.manager_id;
      }
    }

    const hashedPassword = await hash(password, 8);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const model = await queryRunner.manager.save(Agent, {
        ...data,
        password: hashedPassword,
      });
      if (model.id && address) {
        await queryRunner.manager.save(AgentAddress, {
          ...address,
          agent_id: model.id,
        });
      }
      if (model.id && limit) {
        await queryRunner.manager.save(AgentLimit, {
          ...limit,
          agent_id: model.id,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Gerente não criado');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: any, user: JwtData): Promise<PagingResult<Agent>> {
    const queryBuilder = this.repository
      .createQueryBuilder('agent')
      .leftJoin('agent.manager', 'manager', 'manager.visible = true')
      .leftJoin('agent.submanager', 'submanager', 'submanager.visible = true')
      .leftJoin('agent.collect', 'collect', 'collect.visible = true')
      .addSelect([
        'manager.id',
        'manager.first_name',
        'manager.last_name',
        'submanager.id',
        'submanager.first_name',
        'submanager.last_name',
        'collect.id',
        'collect.first_name',
        'collect.last_name',
      ]);

    if (user.entity === 'manager') {
      const isManager = await this.managerService.isManager(user.id);
      if (isManager) {
        queryBuilder.where('agent.manager_id = :id', { id: user.id });
      } else {
        queryBuilder.where('agent.submanager_id = :id', { id: user.id });
      }
    }

    if (query?.visible) {
      queryBuilder.andWhere({ visible: true });
    }

    const paginator = buildPaginator({
      entity: Agent,
      paginationKeys: ['first_name', 'id'],
      query: {
        limit: 20,
        order: 'ASC',
        afterCursor: query?.page?.next,
        beforeCursor: query?.page?.prev,
      },
    });

    return paginator.paginate(queryBuilder);
  }

  async findById(id: string): Promise<Agent | undefined> {
    const model = await this.repository.findOne({
      where: { id },
      relations: ['address', 'address.city', 'address.state', 'limit'],
    });

    if (!model) {
      throw new BadRequestException('Token inválido');
    }
    return model;
  }

  async findByEmail(email: string): Promise<Agent | undefined> {
    return this.repository.findOne({ email });
  }

  exist(id: string): Promise<Agent | undefined> {
    return this.repository.findOne({
      select: ['id'],
      where: { id, visible: true },
    });
  }

  async update(id: string, payload: UpdateAgentDto): Promise<void> {
    const model = await this.repository.findOne(id, {
      relations: ['address', 'limit'],
    });

    if (!model) {
      throw new BadRequestException('Gerente não encontrado.');
    }

    const newPayload = { id, ...payload };
    delete newPayload.email;

    const password = newPayload.password;
    const passwordIsValid =
      password !== undefined && password !== null && password.length >= 6;
    delete newPayload.password;
    delete newPayload.repeat_password;
    if (passwordIsValid) {
      const hashedPassword = await hash(password, 8);
      newPayload.password = hashedPassword;
    }

    this.repository.metadata.ownRelations.map(
      (item) => delete newPayload[item.propertyName],
    );

    await getManager().transaction(async () => {
      await this.repository.save(newPayload);

      const { address, limit } = payload;

      if (address) {
        if (model.address) {
          await this.agentAddressRepository.save({
            ...address,
            id: model.address.id,
          });
        } else {
          await this.agentAddressRepository.save({
            ...address,
            agent_id: model.id,
          });
        }
      } else {
        await this.agentAddressRepository.delete({
          agent_id: model.id,
        });
      }

      if (limit) {
        await this.agentLimitRepository.save({
          ...limit,
          id: model.limit.id,
        });
      }
    });
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new BadRequestException('Gerente não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}
