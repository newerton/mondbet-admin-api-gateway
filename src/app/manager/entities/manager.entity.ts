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
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ManagerAddress } from './manager-address.entity';
import { ManagerLimit } from './manager-limit.entity';
import { ManagerRole } from './manager_role.entity';

@Entity('manager')
export class Manager {
  constructor(partial: Partial<Manager>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('uuid')
  profile_id: string;

  @ApiProperty()
  @Column('uuid')
  manager_id?: string;

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

  @ApiProperty()
  @Column()
  permission_delete_ticket: boolean;

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
  @OneToOne(() => ManagerAddress, (address) => address.manager_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'manager_id' })
  address?: ManagerAddress;

  @ApiProperty()
  @OneToOne(() => ManagerLimit, (managerLimit) => managerLimit.manager_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'manager_id' })
  limit: ManagerLimit;

  @ApiProperty()
  @OneToOne(() => Manager, (manager) => manager.manager_id)
  @JoinColumn({ name: 'manager_id' })
  manager: Manager;

  @ApiProperty()
  @OneToMany(() => ManagerRole, (namagerRole) => namagerRole.owner)
  @JoinColumn({ name: 'id', referencedColumnName: 'manager_id' })
  roles?: ManagerRole[];
}
