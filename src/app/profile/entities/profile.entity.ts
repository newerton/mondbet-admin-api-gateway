import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Sport } from 'src/app/sport/entities/sport.entity';
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
import { ProfileLimit } from './profile-limit.entity';

@Entity('profile')
export class Profile {
  constructor(partial: Partial<Profile>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  @Exclude()
  sport_id: string;

  @ApiProperty()
  @Column()
  combined: number;

  @ApiProperty()
  @Column()
  visible: boolean;

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
  @OneToOne(() => Sport, (sport) => sport.id)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @ApiProperty()
  @OneToOne(() => ProfileLimit, (profileLimit) => profileLimit.profile_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'profile_id' })
  limit: ProfileLimit;
}
