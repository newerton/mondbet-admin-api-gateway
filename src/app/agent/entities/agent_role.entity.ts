import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agent } from './agent.entity';

export enum AgentResources {
  COLLECT = 'Collect',
}

@Entity('agent_role')
export class AgentRole {
  constructor(partial: Partial<AgentRole>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column('uuid')
  @Exclude()
  agent_id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  resource: string;

  @Column()
  @Exclude()
  manager: boolean;

  @ApiProperty()
  @Column()
  create: boolean;

  @ApiProperty()
  @Column()
  read: boolean;

  @ApiProperty()
  @Column()
  update: boolean;

  @Column()
  @Exclude()
  delete: boolean;

  @Column()
  @Exclude()
  visible: boolean;

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

  @ManyToOne(() => Agent, (agent) => agent.roles)
  @JoinColumn({ name: 'agent_id' })
  owner: Agent;
}
