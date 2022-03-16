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

@Entity('manager_limit')
export class ManagerLimit {
  constructor(partial: Partial<ManagerLimit>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ type: 'uuid' })
  @Exclude()
  manager_id: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  general_limit: number;

  @ApiProperty()
  @Column({ type: 'integer' })
  agent_max: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  daily_limit_single_bet: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weekly_limit_single_bet: number;

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
