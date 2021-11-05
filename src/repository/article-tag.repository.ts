import { EntityRepository, Repository } from 'typeorm';
import { ArticleTag } from '../entity/article-tag.entity';

@EntityRepository(ArticleTag)
export class ArticleTagRepository extends Repository<ArticleTag> {}
