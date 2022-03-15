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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

export enum ProfileLimitTypeRole {
  PREMATCH = 'prematch',
  LIVE = 'live',
}

@Entity('profile_limit')
export class ProfileLimit {
  constructor(partial: Partial<ProfileLimit>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ type: 'uuid' })
  @Exclude()
  profile_id: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ProfileLimitTypeRole,
    default: ProfileLimitTypeRole.PREMATCH,
  })
  @Exclude()
  type: ProfileLimitTypeRole;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bet_max: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bet_max_multiple: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bet_max_event: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bet_max_win: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bet_max_multiple_win: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bet_min: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bet_min_multiple: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quote_min_ticket: number;

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
