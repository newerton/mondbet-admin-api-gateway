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

@Entity('country')
export class Country {
  constructor(partial: Partial<Country>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  iso_code: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  calling_code: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  latitude: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  longitude: string;

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
