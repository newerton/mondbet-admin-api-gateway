import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { City } from 'src/app/city/entities/city.entity';
import { State } from 'src/app/state/entities/state.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('agent_address')
export class AgentAddress {
  constructor(partial: Partial<AgentAddress>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Exclude()
  agent_id: string;

  @ApiProperty()
  @Column()
  zipcode: string;

  @ApiProperty()
  @Column()
  street: string;

  @ApiProperty()
  @Column()
  number: string;

  @ApiProperty()
  @Column()
  neighborhood: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  complement: string;

  @Column()
  @Exclude()
  state_id: string;

  @Column()
  @Exclude()
  city_id: string;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @BeforeInsert()
  private setCreateDate(): void {
    this.created_at = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  private setUpdateDate(): void {
    this.updated_at = new Date();
  }

  @ApiProperty()
  @OneToOne(() => City, (city) => city.id)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ApiProperty()
  @OneToOne(() => State, (state) => state.id)
  @JoinColumn({ name: 'state_id' })
  state: State;
}
