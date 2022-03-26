import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';

@Injectable()
export class SportService {
  constructor(@InjectRepository(Sport) private repository: Repository<Sport>) {}

  async create(data: CreateSportDto): Promise<void> {
    await this.repository.save(data);
  }

  findAll(query: any): Promise<PagingResult<Sport>> {
    const queryBuilder = this.repository.createQueryBuilder('sport');

    if (query?.visible) {
      queryBuilder.andWhere({ visible: true });
    }

    const paginator = buildPaginator({
      entity: Sport,
      paginationKeys: ['title', 'id'],
      query: {
        limit: 2,
        order: 'ASC',
        afterCursor: query?.page?.next,
        beforeCursor: query?.page?.prev,
      },
    });

    return paginator.paginate(queryBuilder);
  }

  async findOne(id: string): Promise<Sport | undefined> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new BadRequestException('Esporte não encontrado.');
    }
    return model;
  }

  async update(id: string, payload: UpdateSportDto): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new BadRequestException('Esporte não encontrado.');
    }

    await this.repository.save({ id, ...payload });
  }

  async remove(id: string): Promise<void> {
    const model = await this.repository.findOne(id);

    if (!model) {
      throw new BadRequestException('Esporte não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}
