import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ProfileLimit,
  ProfileLimitTypeRole,
} from './entities/profile-limit.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private repository: Repository<Profile>,
    @InjectRepository(ProfileLimit)
    private profileLimitRepository: Repository<ProfileLimit>,
  ) {}

  async create(data: CreateProfileDto): Promise<void> {
    const { limit } = data;
    const { id } = await this.repository.save(data);
    if (id && limit) {
      await this.profileLimitRepository.save({
        ...limit,
        type: ProfileLimitTypeRole.PREMATCH,
        profile_id: id,
      });
    }
  }

  findAll(query: any): Promise<PagingResult<Profile>> {
    const queryBuilder = this.repository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.sport', 'sport');

    const paginator = buildPaginator({
      entity: Profile,
      paginationKeys: ['id'],
      query: {
        limit: 20,
        order: 'ASC',
        afterCursor: query?.page?.next,
        beforeCursor: query?.page?.prev,
      },
    });

    return paginator.paginate(queryBuilder);
  }

  async findOne(id: string): Promise<Profile | undefined> {
    const model = await this.repository.findOne(id, {
      relations: ['sport', 'limit'],
    });

    if (!model) {
      throw new BadRequestException('Perfil não encontrado.');
    }

    return model;
  }

  async update(id: string, payload: UpdateProfileDto): Promise<void> {
    const model = await this.repository.findOne(id, {
      relations: ['sport', 'limit'],
    });

    if (!model) {
      throw new BadRequestException('Perfil não encontrado.');
    }

    const newPayload = { id, ...payload };

    this.repository.metadata.ownRelations.map(
      (item) => delete newPayload[item.propertyName],
    );
    await this.repository.save(newPayload);

    const { limit } = payload;
    if (limit) {
      await this.profileLimitRepository.save({ ...limit, id: model.limit.id });
    }
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new BadRequestException('Perfil não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}
