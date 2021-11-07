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

  static forCreateArticle(
    property: Pick<Article, 'slug' | 'title' | 'description' | 'body'> & {
      authorId: User['id'];
    },
  ): Article {
    const article = new Article();
    article.slug = property.slug;
    article.title = property.title;
    article.description = property.description;
    article.body = property.body;
    article.author = User.forId({ id: property.authorId });
    return article;
  }
}
