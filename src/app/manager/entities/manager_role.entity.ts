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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Manager } from './manager.entity';

@Entity('manager_role')
export class ManagerRole {
  constructor(partial: Partial<ManagerRole>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Exclude()
  manager_id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  resource: string;

  @Column()
  manager: boolean;

  @ApiProperty()
  @Column()
  create: boolean;

  @ApiProperty()
  @Column()
  read: boolean;

  @ApiProperty()
  @Column()
  update: boolean;

  @Column()
  delete: boolean;

  @Column()
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

  @ManyToOne(() => Manager, (manager) => manager.roles)
  @JoinColumn({ name: 'manager_id' })
  owner: Manager;
}
