import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Connection, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { CreateCollectDto } from './dto/create-collect.dto';
import { UpdateCollectDto } from './dto/update-collect.dto';
import { Collect } from './entities/collect.entity';
import { CollectAddress } from './entities/collect-address.entity';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(Collect) private repository: Repository<Collect>,
    private connection: Connection,
  ) {}

  async create(data: CreateCollectDto): Promise<void> {
    const { email, password, address } = data;
    const exist = await this.findByEmail(email);

    if (exist) {
      throw new UnprocessableEntityException('E-mail já cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const model = await queryRunner.manager.save(Collect, {
        ...data,
        password: hashedPassword,
      });
      if (model.id && address) {
        await queryRunner.manager.save(CollectAddress, {
          ...address,
          collect_id: model.id,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Recolhe não criado');
    } finally {
      await queryRunner.release();
    }
  }

  findAll(query: any): Promise<PagingResult<Collect>> {
    const queryBuilder = this.repository.createQueryBuilder('collect');

    if (query?.visible) {
      queryBuilder.andWhere({ visible: true });
    }

    const paginator = buildPaginator({
      entity: Collect,
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

  async findById(id: string): Promise<Collect | undefined> {
    const model = await this.repository.findOne({
      where: { id },
      relations: ['address', 'address.city', 'address.state'],
    });

    if (!model) {
      throw new NotFoundException('Recolhe não encontrado');
    }
    return model;
  }

  async findByEmail(email: string): Promise<Collect | undefined> {
    return this.repository.findOne({ email });
  }

  exist(id: string): Promise<Collect | undefined> {
    return this.repository.findOne({
      select: ['id'],
      where: { id, visible: true },
    });
  }

  async update(id: string, payload: UpdateCollectDto): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new NotFoundException('Recolhe não encontrado');
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
      await queryRunner.manager.save(Collect, newPayload);

      const { address } = payload;

      if (address) {
        if (model.address) {
          await queryRunner.manager.save(CollectAddress, {
            ...address,
            id: model.address.id,
          });
        } else {
          await queryRunner.manager.save(CollectAddress, {
            ...address,
            collect_id: model.id,
          });
        }
      } else {
        await queryRunner.manager.delete(Collect, {
          collect_id: model.id,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Recolhe não atualizado');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new NotFoundException('Recolhe não encontrado');
    }

    await this.repository.softDelete(id);
  }
}
