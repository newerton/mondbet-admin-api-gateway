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
import { CollectAddress } from './collect-address.entity';

@Entity('collect')
export class Collect {
  constructor(partial: Partial<Collect>) {
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
  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true, select: false })
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
  @OneToOne(() => CollectAddress, (address) => address.collect_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'collect_id' })
  address: CollectAddress;
}
