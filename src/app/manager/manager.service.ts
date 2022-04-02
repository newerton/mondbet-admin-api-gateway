import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerLimit } from './entities/manager-limit.entity';
import { Manager } from './entities/manager.entity';
import { ManagerAddress } from './entities/manager-address.entity';
import { JwtData } from 'src/common/auth/jwt/jwt.strategy';
import { ManagerRole } from './entities/manager_role.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager) private repository: Repository<Manager>,
    private connection: Connection,
  ) {}

  async create(data: CreateManagerDto, user: JwtData): Promise<void> {
    const { email, password, address, limit, roles } = data;
    const exist = await this.findByEmail(email);

    if (exist) {
      throw new UnprocessableEntityException('E-mail já cadastrado');
    }

    if (user.entity === 'manager') {
      const isManager = await this.isManager(user.id);
      if (isManager) {
        data.manager_id = user.id;
      }
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
      if (model.id && roles) {
        const saveAll = roles.map(
          async (role: ManagerRole) =>
            await queryRunner.manager.save(ManagerRole, {
              ...role,
              manager_id: model.id,
            }),
        );
        await Promise.all(saveAll);
      }
      await queryRunner.commitTransaction();
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Gerente não criado');
    } finally {
      await queryRunner.release();
    }
  }

  findAll(query: any, user: JwtData): Promise<PagingResult<Manager>> {
    const queryBuilder = this.repository
      .createQueryBuilder('manager')
      .leftJoinAndSelect('manager.manager', 'parent_manager');

    if (user.entity === 'manager') {
      queryBuilder.andWhere({ manager_id: user.id });
    }

    if (query?.manager) {
      queryBuilder.andWhere({ manager_id: IsNull() });
    }

    if (query?.submanager) {
      queryBuilder.andWhere({ manager_id: Not(IsNull()) });
    }

    if (query?.visible) {
      queryBuilder.andWhere({ visible: true });
    }

    if (query?.manager_id) {
      queryBuilder.andWhere({ manager_id: query?.manager_id });
    }

    const paginator = buildPaginator({
      entity: Manager,
      paginationKeys: ['first_name', 'id'],
      query: {
        limit: query?.manager_id ? 0 : 20,
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
      relations: ['address', 'address.city', 'address.state', 'limit', 'roles'],
    });

    if (!model) {
      throw new NotFoundException('Gerente não encontrado');
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
      relations: ['roles'],
    });
  }

  async update(id: string, payload: UpdateManagerDto): Promise<void> {
    const model = await this.repository.findOne(id, {
      relations: ['address', 'limit'],
    });

    if (!model) {
      throw new NotFoundException('Gerente não encontrado');
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

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Manager, newPayload);

      const { address, limit, roles } = payload;

      if (address) {
        if (model.address) {
          await queryRunner.manager.save(ManagerAddress, {
            ...address,
            id: model.address.id,
          });
        } else {
          await queryRunner.manager.save(ManagerAddress, {
            ...address,
            manager_id: model.id,
          });
        }
      } else {
        await queryRunner.manager.delete(ManagerAddress, {
          manager_id: model.id,
        });
      }

      if (limit) {
        await queryRunner.manager.save(ManagerLimit, {
          ...limit,
          id: model.limit.id,
        });
      }

      if (roles) {
        await queryRunner.manager.delete(ManagerRole, {
          manager_id: model.id,
        });

        const saveAll = roles.map(
          async (role: ManagerRole) =>
            await queryRunner.manager.save(ManagerRole, {
              ...role,
              manager_id: model.id,
            }),
        );
        await Promise.all(saveAll);
      }
      await queryRunner.commitTransaction();
    } catch (error: any) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Gerente não atualizado');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new NotFoundException('Gerente não encontrado');
    }

    await this.repository.softDelete(id);
  }

  async isManager(id: string): Promise<boolean> {
    const model = await this.repository.findOne(id, {
      where: { visible: true, manager_id: IsNull() },
    });

    return !!model;
  }

  async allSubManager(id: string): Promise<string[]> {
    const model = await this.repository.find({
      select: ['id'],
      where: { visible: true, manager_id: id },
    });

    return model.map((item) => item.id);
  }
}
