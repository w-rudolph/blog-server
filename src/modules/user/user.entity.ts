import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Sex {
  MALE = 0,
  FEMAL = 1,
  UNKNOWN = -1,
}

export enum AccountStatus {
  DELETED = -1,
  BLOCKED = 0,
  ACTIVED = 1,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: Sex.UNKNOWN })
  sex: Sex;

  @Column()
  role: number;

  @Column({ default: AccountStatus.BLOCKED, type: 'int' })
  status: AccountStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: string;
}
