import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Connection, getManager, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { CreateCollectDto } from './dto/create-collect.dto';
import { UpdateCollectDto } from './dto/update-collect.dto';
import { Collect } from './entities/collect.entity';
import { CollectAddress } from './entities/collect-address.entity';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(Collect) private repository: Repository<Collect>,
    @InjectRepository(CollectAddress)
    private collectAddressRepository: Repository<CollectAddress>,
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
      throw new BadRequestException({
        error: 'Recolhe não criado',
      });
    } finally {
      await queryRunner.release();
    }
  }

  findAll(query: any): Promise<PagingResult<Collect>> {
    const queryBuilder = this.repository.createQueryBuilder('collect');

    const paginator = buildPaginator({
      entity: Collect,
      paginationKeys: ['first_name'],
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
      where: { id, visible: true },
      relations: ['address', 'address.city', 'address.state'],
    });

    if (!model) {
      throw new BadRequestException('Token inválido');
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
      throw new BadRequestException('Recolhe não encontrado.');
    }

    const newPayload = { id, ...payload };
    delete newPayload.email;

    this.repository.metadata.ownRelations.map(
      (item) => delete newPayload[item.propertyName],
    );

    await getManager().transaction(async () => {
      await this.repository.save(newPayload);

      const { address } = payload;
      if (address) {
        await this.collectAddressRepository.save({
          ...address,
          id: model.address.id,
        });
      }
    });
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new BadRequestException('Recolhe não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}