import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { EntityBase } from './base/entity-base';
import { User } from './user.entity';

@Entity()
export class Comment extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article)
  article: Article;

  @Column()
  body: string;

  @ManyToOne(() => User)
  author: User;
}
