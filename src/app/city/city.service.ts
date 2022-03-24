import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(@InjectRepository(City) private repository: Repository<City>) {}

  findAll(state_id: string): Promise<City[]> {
    return this.repository.find({
      where: { state_id },
      order: { title: 'ASC' },
    });
  }

  findOne(id: string): Promise<City | undefined> {
    return this.repository.findOne(id);
  }

  findOneByStateAndTitle(
    state_id: string,
    title: string,
  ): Promise<City | undefined> {
    const city = title.replace(' ', '%');
    return this.repository.findOne({
      where: `"state_id" = '${state_id}' AND "title" ILIKE '${city}'`,
    });
  }
}
