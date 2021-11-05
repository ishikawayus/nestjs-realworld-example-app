import { Entity, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { EntityBase } from './base/entity-base';
import { Tag } from './tag.entity';

@Entity()
export class ArticleTag extends EntityBase {
  @ManyToOne(() => Article, { primary: true })
  article: Article;

  @ManyToOne(() => Tag, { primary: true })
  tag: Tag;
}
