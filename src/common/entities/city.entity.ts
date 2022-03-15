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

@Entity('city')
export class City {
  constructor(partial: Partial<City>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('uuid')
  state_id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  iso_code: string;

  @ApiProperty()
  @Column()
  iso_calling: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  latitude: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  longitude: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  timezone: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  gmt: string;

  @ApiProperty()
  @Column({ default: true })
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
}
