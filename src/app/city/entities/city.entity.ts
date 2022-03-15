import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { State } from 'src/app/state/entities/state.entity';
import { UserAddress } from 'src/app/user/entities/userAddress.entity';
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

@Entity('city')
export class City {
  constructor(partial: Partial<City>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Exclude()
  state_id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  @Exclude()
  iso_code: string;

  @ApiProperty()
  @Column()
  @Exclude()
  iso_calling: string;

  @ApiProperty()
  @Column({ nullable: true, default: true })
  @Exclude()
  latitude?: string;

  @ApiProperty()
  @Column({ nullable: true, default: true })
  @Exclude()
  longitude?: string;

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

  @OneToOne(() => State, (state) => state.city)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @ManyToOne(() => UserAddress, (userAddress) => userAddress.city)
  @JoinColumn({ name: 'id' })
  userAddress: UserAddress;
}
