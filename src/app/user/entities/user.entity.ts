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
import { UserAddress } from './userAddress.entity';

@Entity('user')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @OneToOne(() => UserAddress, (address) => address.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  address: UserAddress;
}
