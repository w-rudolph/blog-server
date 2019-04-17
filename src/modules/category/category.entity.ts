import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CategoryStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  DELETED = -1,
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  alias: string;

  @Column({ default: 100 })
  sort: number;

  @Column({ default: CategoryStatus.DRAFT })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: string;
}
