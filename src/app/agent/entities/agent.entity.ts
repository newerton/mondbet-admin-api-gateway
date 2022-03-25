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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentLimit } from './agent-limit.entity';
import { AgentAddress } from './agent-address.entity';
import { Manager } from 'src/app/manager/entities/manager.entity';
import { Profile } from 'src/app/profile/entities/profile.entity';

@Entity('agent')
export class Agent {
  constructor(partial: Partial<Agent>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('uuid')
  profile_id: string;

  @ApiProperty()
  @Column('uuid')
  manager_id: string;

  @ApiProperty()
  @Column()
  first_name: string;

  @ApiProperty()
  @Column()
  last_name: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  email_verified?: boolean;

  @Column()
  @Exclude()
  password: string;

  repeat_password: string;

  @ApiProperty()
  @Column()
  document?: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  birthday?: string;

  @ApiProperty()
  @Column()
  phone?: string;

  @ApiProperty()
  @Column()
  description?: string;

  @Column()
  visible?: boolean;

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
  @OneToOne(() => AgentAddress, (address) => address.agent_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'agent_id' })
  address: AgentAddress;

  @ApiProperty()
  @OneToOne(() => AgentLimit, (agentLimit) => agentLimit.agent_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'agent_id' })
  limit: AgentLimit;

  @ApiProperty()
  @OneToOne(() => Profile, (profile) => profile.id)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ApiProperty()
  @OneToOne(() => Manager, (manager) => manager.id)
  @JoinColumn({ name: 'manager_id' })
  manager: Manager;
}
