import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EntityBase } from './base/entity-base';
import { User } from './user.entity';

@Entity()
export class Article extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToOne(() => User)
  author: User;
}
