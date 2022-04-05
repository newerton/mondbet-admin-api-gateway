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
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentLimit } from './agent-limit.entity';
import { AgentAddress } from './agent-address.entity';
import { Manager } from 'src/app/manager/entities/manager.entity';
import { Profile } from 'src/app/profile/entities/profile.entity';
import { Collect } from 'src/app/collect/entities/collect.entity';
import { AgentRole } from './agent_role.entity';

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
  @Column('uuid')
  submanager_id: string;

  @ApiProperty()
  @Column('uuid')
  collect_id: string;

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
  address?: AgentAddress;

  @ApiProperty()
  @OneToOne(() => AgentLimit, (agentLimit) => agentLimit.agent_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'agent_id' })
  limit: AgentLimit;

  @ApiProperty()
  @OneToOne(() => Manager, (manager) => manager.id, { cascade: true })
  @JoinColumn({ name: 'manager_id' })
  manager: Manager;

  @ApiProperty()
  @OneToOne(() => Manager, (manager) => manager.id, { cascade: true })
  @JoinColumn({ name: 'submanager_id' })
  submanager: Manager;

  @ApiProperty()
  @OneToOne(() => Collect, (collect) => collect.id, { cascade: true })
  @JoinColumn({ name: 'collect_id' })
  collect: Collect;

  @ApiProperty()
  @OneToOne(() => Profile, (profile) => profile.id, { cascade: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ApiProperty()
  @OneToMany(() => AgentRole, (agentRole) => agentRole.owner)
  @JoinColumn({ name: 'id', referencedColumnName: 'agent_id' })
  roles?: AgentRole[];
}
