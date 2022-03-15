import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
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

  findAll(): Promise<PagingResult<Sport>> {
    const queryBuilder = getConnection()
      .getRepository(Sport)
      .createQueryBuilder('sport');

    const paginator = buildPaginator({
      entity: Sport,
      paginationKeys: ['id'],
      query: {
        limit: 4,
        order: 'ASC',
      },
    });

    return paginator.paginate(queryBuilder);
  }

  findOne(id: string): Promise<Sport | undefined> {
    return this.repository.findOne(id);
  }

  async update(id: string, payload: UpdateSportDto): Promise<void> {
    const sport = await this.repository.findOne(id);

    if (!sport) {
      throw new BadRequestException('Esporte não encontrado.');
    }

    await this.repository.save({ id, ...payload });
  }

  async remove(id: string): Promise<void> {
    const sport = await this.repository.findOne(id);

    if (!sport) {
      throw new BadRequestException('Esporte não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}
