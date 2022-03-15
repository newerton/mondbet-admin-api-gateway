import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './entities/state.entity';

@Injectable()
export class StateService {
  constructor(@InjectRepository(State) private repository: Repository<State>) {}

  findAll(): Promise<State[]> {
    return this.repository.find({ order: { title: 'ASC' } });
  }

  findOne(id: string): Promise<State | undefined> {
    return this.repository.findOne(id);
  }
}
