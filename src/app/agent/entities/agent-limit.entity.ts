import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('agent_limit')
export class AgentLimit {
  constructor(partial: Partial<AgentLimit>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ type: 'uuid' })
  @Exclude()
  agent_id: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  general_limit: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  reward_percentage: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  daily_limit_single_bet: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  daily_limit_double_bet: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  daily_limit_triple_bet: number;

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
}
