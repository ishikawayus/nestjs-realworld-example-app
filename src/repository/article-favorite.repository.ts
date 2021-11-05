import { EntityRepository, Repository } from 'typeorm';
import { ArticleFavorite } from '../entity/article-favorite.entity';

@EntityRepository(ArticleFavorite)
export class ArticleFavoriteRepository extends Repository<ArticleFavorite> {}
