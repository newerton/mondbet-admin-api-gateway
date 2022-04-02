import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
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
  ) {}

  async create(data: CreateUserDto): Promise<void> {
    const { email, password, address } = data;
    const exist = await this.findByEmail(email);

    if (exist) {
      throw new UnprocessableEntityException('E-mail já cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    const model = await this.repository.save({
      ...data,
      password: hashedPassword,
    });

    if (address) {
      await this.userAddressRepository.save({
        ...address,
        user_id: model.id,
      });
    }
  }

  async findById(id: string): Promise<User | undefined> {
    const model = await this.repository.findOne({
      where: { id },
      relations: ['address', 'address.city', 'address.state'],
    });

    if (!model) {
      throw new NotFoundException('Usuário não encontrado');
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
      throw new NotFoundException('Usuário não encontrado');
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
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.repository.softDelete(id);
  }
}
