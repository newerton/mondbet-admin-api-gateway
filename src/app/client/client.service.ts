import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Connection, getManager, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { ClientAddress } from './entities/client-address.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private repository: Repository<Client>,
    @InjectRepository(ClientAddress)
    private clientAddressRepository: Repository<ClientAddress>,
    private connection: Connection,
  ) {}

  async create(data: CreateClientDto): Promise<void> {
    const { email, password } = data;
    const exist = await this.findByEmail(email);

    if (exist) {
      throw new UnprocessableEntityException('E-mail já cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Client, {
        ...data,
        password: hashedPassword,
      });
      // if (model.id && address) {
      //   await queryRunner.manager.save(ClientAddress, {
      //     ...address,
      //     client_id: model.id,
      //   });
      // }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException({
        error: 'Cliente não criado',
      });
    } finally {
      await queryRunner.release();
    }
  }

  findAll(query: any): Promise<PagingResult<Client>> {
    const queryBuilder = this.repository.createQueryBuilder('client');

    const paginator = buildPaginator({
      entity: Client,
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

  async findById(id: string): Promise<Client | undefined> {
    const model = await this.repository.findOne({
      where: { id },
    });

    if (!model) {
      throw new BadRequestException('Token inválido');
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
      throw new BadRequestException('Cliente não encontrado.');
    }

    const newPayload = { id, ...payload };
    delete newPayload.email;

    this.repository.metadata.ownRelations.map(
      (item) => delete newPayload[item.propertyName],
    );

    await getManager().transaction(async () => {
      await this.repository.save(newPayload);

      // const { address } = payload;
      // if (address) {
      //   await this.clientAddressRepository.save({
      //     ...address,
      //     id: model.address.id,
      //   });
      // }
    });
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new BadRequestException('Cliente não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}
