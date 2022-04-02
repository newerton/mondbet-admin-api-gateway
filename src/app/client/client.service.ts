import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private repository: Repository<Client>,
  ) {}

  async create(data: CreateClientDto): Promise<void> {
    const { email, password } = data;
    const exist = await this.findByEmail(email);

    if (exist) {
      throw new UnprocessableEntityException('E-mail já cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    await this.repository.save({
      ...data,
      password: hashedPassword,
    });
  }

  findAll(query: any): Promise<PagingResult<Client>> {
    const queryBuilder = this.repository.createQueryBuilder('client');

    if (query?.visible) {
      queryBuilder.andWhere({ visible: true });
    }

    const paginator = buildPaginator({
      entity: Client,
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

  async findById(id: string): Promise<Client | undefined> {
    const model = await this.repository.findOne({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return model;
  }

  async findByEmail(email: string): Promise<Client | undefined> {
    return this.repository.findOne({ email });
  }

  exist(id: string): Promise<Client | undefined> {
    return this.repository.findOne({
      select: ['id'],
      where: { id, visible: true },
    });
  }

  async update(id: string, payload: UpdateClientDto): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const newPayload = { id, ...payload };
    delete newPayload.email;

    this.repository.metadata.ownRelations.map(
      (item) => delete newPayload[item.propertyName],
    );

    await this.repository.save(newPayload);
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new NotFoundException('Cliente não encontrado');
    }

    await this.repository.softDelete(id);
  }
}
