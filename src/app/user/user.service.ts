import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/user_address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
  ) {}

  async create(data: CreateUserDto): Promise<void> {
    const { email, password, address } = data;
    const userExist = await this.findByEmail(email);

    if (userExist) {
      throw new UnprocessableEntityException('E-mail já cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    try {
      const { id } = await this.repository.save({
        ...data,
        password: hashedPassword,
      });
      if (id) {
        if (address) {
          await this.userAddressRepository.save({
            ...address,
            user: { id },
          });
        }
      } else {
        throw new BadRequestException({ error: 'User not created' });
      }
    } catch (err) {
      throw new BadRequestException({ error: 'User not created' });
    }
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: { id, visible: true },
      relations: ['address', 'address.city', 'address.state'],
    });

    if (!user) {
      throw new BadRequestException('Token not valid');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ email });
  }

  async update(id: string): Promise<void> {
    const client = await this.repository.findOne(id);

    if (!client) {
      throw new NotFoundException(
        'Não foi possível atualizar os dados. Tente novamente mais tarde.',
      );
    }
  }
}
