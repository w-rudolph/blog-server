import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column()
  toUser: number;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: string;
}
