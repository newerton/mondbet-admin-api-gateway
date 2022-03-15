import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  IsNull,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_address')
export class UserAddress {
  constructor(partial: Partial<UserAddress>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('uuid')
  user_id: string;

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

  @ApiProperty()
  @Column()
  state_id: string;

  @ApiProperty()
  @Column()
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
}
