import { Entity, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { EntityBase } from './base/entity-base';
import { User } from './user.entity';

@Entity()
export class ArticleFavorite extends EntityBase {
  @ManyToOne(() => Article, { primary: true })
  article: Article;

  @ManyToOne(() => User, { primary: true })
  user: User;
}
