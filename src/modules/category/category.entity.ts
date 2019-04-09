import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum CategoryStatus {
    DEFAULT = 0,
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

    @Column({ default: CategoryStatus.DEFAULT })
    status: number;

    @CreateDateColumn({ type: 'datetime' })
    createAt: string;

    @UpdateDateColumn({ type: 'datetime' })
    updateAt: string;
}
