import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/user-address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
    private connection: Connection,
  ) {}

  async create(data: CreateUserDto): Promise<void> {
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
      const model = await queryRunner.manager.save(User, {
        ...data,
        password: hashedPassword,
      });
      if (model.id && address) {
        await queryRunner.manager.save(UserAddress, {
          ...address,
          manager_id: model.id,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Usuário não criado');
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string): Promise<User | undefined> {
    const model = await this.repository.findOne({
      where: { id },
      relations: ['address', 'address.city', 'address.state'],
    });

    if (!model) {
      throw new BadRequestException('Token inválido');
    }
    return model;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ email });
  }

  exist(id: string): Promise<User | undefined> {
    return this.repository.findOne({
      select: ['id'],
      where: { id, visible: true },
    });
  }

  async update(id: string, payload: UpdateUserDto): Promise<void> {
    const model = await this.repository.findOne(id, {
      relations: ['address', 'limit'],
    });

    if (!model) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    const newPayload = { id, ...payload };
    delete newPayload.email;

    this.repository.metadata.ownRelations.map(
      (item) => delete newPayload[item.propertyName],
    );
    await this.repository.save(newPayload);

    const { address } = payload;
    if (address) {
      await this.userAddressRepository.save({
        ...address,
        id: model.address.id,
      });
    }
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}
