import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PostStatus {
  DELETED = -1,
  DRAFT = 0,
  PUBLISHED = 1,
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: number;

  @Column()
  abstract: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  preview: string;

  @Column()
  author: number;

  @Column({ default: PostStatus.DRAFT })
  status: PostStatus;

  @CreateDateColumn({ type: 'datetime' })
  createAt: string;

  @UpdateDateColumn({ type: 'datetime' })
  updateAt: string;
}
