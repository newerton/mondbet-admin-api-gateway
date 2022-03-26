import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Connection, getManager, IsNull, Not, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerLimit } from './entities/manager-limit.entity';
import { Manager } from './entities/manager.entity';
import { ManagerAddress } from './entities/manager-address.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager) private repository: Repository<Manager>,
    @InjectRepository(ManagerAddress)
    private managerAddressRepository: Repository<ManagerAddress>,
    @InjectRepository(ManagerLimit)
    private managerLimitRepository: Repository<ManagerLimit>,
    private connection: Connection,
  ) {}

  async create(data: CreateManagerDto): Promise<void> {
    const { email, password, address, limit } = data;
    const exist = await this.findByEmail(email);

    if (exist) {
      throw new UnprocessableEntityException('E-mail já cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const model = await queryRunner.manager.save(Manager, {
        ...data,
        password: hashedPassword,
      });
      if (model.id && address) {
        await queryRunner.manager.save(ManagerAddress, {
          ...address,
          manager_id: model.id,
        });
      }
      if (model.id && limit) {
        await queryRunner.manager.save(ManagerLimit, {
          ...limit,
          manager_id: model.id,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Gerente não criado');
    } finally {
      await queryRunner.release();
    }
  }

  findAll(query: any): Promise<PagingResult<Manager>> {
    const queryBuilder = this.repository
      .createQueryBuilder('manager')
      .leftJoinAndSelect('manager.manager', 'parent_manager');

    if (query?.manager) {
      queryBuilder.andWhere({ manager_id: IsNull() });
    }

    if (query?.submanager) {
      queryBuilder.andWhere({ manager_id: Not(IsNull()) });
    }

    if (query?.visible) {
      queryBuilder.andWhere({ visible: true });
    }

    const paginator = buildPaginator({
      entity: Manager,
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

  async findById(id: string): Promise<Manager | undefined> {
    const model = await this.repository.findOne({
      where: { id },
      relations: ['address', 'address.city', 'address.state', 'limit'],
    });

    if (!model) {
      throw new BadRequestException('Token inválido');
    }
    return model;
  }

  async findByEmail(email: string): Promise<Manager | undefined> {
    return this.repository.findOne({ email });
  }

  exist(id: string): Promise<Manager | undefined> {
    return this.repository.findOne({
      select: ['id'],
      where: { id, visible: true },
    });
  }

  async update(id: string, payload: UpdateManagerDto): Promise<void> {
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
          await this.managerAddressRepository.save({
            ...address,
            id: model.address.id,
          });
        } else {
          await this.managerAddressRepository.save({
            ...address,
            manager_id: model.id,
          });
        }
      } else {
        await this.managerAddressRepository.delete({
          manager_id: model.id,
        });
      }
      if (limit) {
        await this.managerLimitRepository.save({
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
