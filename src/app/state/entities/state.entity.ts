import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { City } from 'src/app/city/entities/city.entity';
import { UserAddress } from 'src/app/user/entities/user_address.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('state')
export class State {
  constructor(partial: Partial<State>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  letter: string;

  @ApiProperty()
  @Column()
  @Exclude()
  iso_code: string;

  @Column({ default: true })
  @Exclude()
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

  @ManyToOne(() => City, (city) => city.state)
  @JoinColumn({ name: 'id' })
  city: City;

  @ManyToOne(() => UserAddress, (userAddress) => userAddress.state)
  @JoinColumn({ name: 'id' })
  userAddress: UserAddress;
}
