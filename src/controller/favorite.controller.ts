import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ArticleFavoriteRepository,
  ArticleRepository,
  ArticleTagRepository,
  UserFollowRepository,
} from '../repository';
import { UserId } from '../jwt-auth.decorator';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ArticleFavorite, User } from '../entity';
import { SingleArticleRes } from '../model/article-res';

@Controller()
export class FavoriteController {
  constructor(
    private articleFavoriteRepository: ArticleFavoriteRepository,
    private articleRepository: ArticleRepository,
    private articleTagRepository: ArticleTagRepository,
    private userFollowRepository: UserFollowRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/api/articles/:slug/favorite')
  async favoriteArticle(
    @Param('slug') slug: string,
    @UserId() userId: number,
  ): Promise<SingleArticleRes> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });
    if (article == null) {
      throw new HttpException(
        `The article does not exist: slug=${slug}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const favorite = new ArticleFavorite();
    favorite.article = article;
    favorite.user = User.forId({ id: userId });
    await this.articleFavoriteRepository.save(favorite);
    const tagList = (
      await this.articleTagRepository.find({
        where: { article },
        relations: ['tag'],
      })
    )
      .map((articleTag) => articleTag.tag.value)
      .sort();
    const favoritesCount = await this.articleFavoriteRepository.count({
      article,
    });
    const following =
      userId == null
        ? false
        : (await this.userFollowRepository.findOne({
            where: { follower: { id: userId }, followee: article.author },
          })) != null;
    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        favorited: true,
        favoritesCount,
        author: {
          username: article.author.username,
          bio: article.author.bio || null,
          image: article.author.image || null,
          following,
        },
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/articles/:slug/favorite')
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @UserId() userId: number,
  ): Promise<SingleArticleRes> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });
    if (article == null) {
      throw new HttpException(
        `The article does not exist: slug=${slug}`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.articleFavoriteRepository.delete({
      article: { id: article.id },
      user: { id: userId },
    });
    const tagList = (
      await this.articleTagRepository.find({
        where: { article },
        relations: ['tag'],
      })
    )
      .map((articleTag) => articleTag.tag.value)
      .sort();
    const favoritesCount = await this.articleFavoriteRepository.count({
      article,
    });
    const following =
      userId == null
        ? false
        : (await this.userFollowRepository.findOne({
            where: { follower: { id: userId }, followee: article.author },
          })) != null;
    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        favorited: false,
        favoritesCount,
        author: {
          username: article.author.username,
          bio: article.author.bio || null,
          image: article.author.image || null,
          following,
        },
      },
    };
  }
}
