import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { In } from 'typeorm';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UserId } from '../jwt-auth.decorator';
import {
  ArticleFavoriteRepository,
  ArticleRepository,
  ArticleTagRepository,
  TagRepository,
  UserFollowRepository,
  UserRepository,
} from '../repository';
import { Article, ArticleTag, Tag } from '../entity';
import { MultipleArticleRes, SingleArticleRes } from '../model/article-res';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';

function createSlugRecursively(slug: string, slugs: string[], number: number) {
  if (slugs.includes(`${slug}-${number}`)) {
    return createSlugRecursively(slug, slugs, number + 1);
  } else {
    return `${slug}-${number}`;
  }
}

function createSlug(title: string, slugs: string[]) {
  const slug = title.toLowerCase().replace(/ /g, '-');
  if (/^[a-z0-9-]+$/.test(slug)) {
    if (slugs.includes(slug)) {
      return createSlugRecursively(slug, slugs, 1);
    } else {
      return slug;
    }
  } else {
    return createSlugRecursively('post', slugs, 1);
  }
}

@Controller()
export class ArticleController {
  constructor(
    private articleFavoriteRepository: ArticleFavoriteRepository,
    private articleRepository: ArticleRepository,
    private articleTagRepository: ArticleTagRepository,
    private tagRepository: TagRepository,
    private userFollowRepository: UserFollowRepository,
    private userRepository: UserRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/api/articles/feed')
  async feedArticles(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @UserId() userId: number,
  ): Promise<MultipleArticleRes> {
    const [articles, articlesCount] = await this.articleRepository.findAndCount(
      { skip: offset, take: limit, relations: ['author'] },
    );
    const tagListByArticleId = new Map<number, string[]>();
    const followingByAuthorId = new Map<number, boolean>();
    for (const article of articles) {
      const tagList = (
        await this.articleTagRepository.find({
          where: { article },
          relations: ['tag'],
        })
      )
        .map((articleTag) => articleTag.tag.value)
        .sort();
      tagListByArticleId.set(article.id, tagList);
      const following =
        userId == null
          ? false
          : (await this.userFollowRepository.findOne({
              where: { follower: { id: userId }, followee: article.author },
            })) != null;
      followingByAuthorId.set(article.author.id, following);
    }
    return {
      articles: articles.map((article) => ({
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: tagListByArticleId.get(article.id) ?? [],
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: article.author.username,
          bio: article.author.bio || null,
          image: article.author.image || null,
          following: followingByAuthorId.get(article.author.id) ?? false,
        },
      })),
      articlesCount,
    };
  }

  @Get('/api/articles')
  async listArticles(
    @Query('tag') tag: string,
    @Query('author') author: string,
    @Query('favorited') favorited: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @UserId() userId: number,
  ): Promise<MultipleArticleRes> {
    let builder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');
    if (tag != null && tag !== '') {
      builder = builder.andWhere(
        (pb) =>
          'EXISTS (' +
          pb
            .subQuery()
            .from(ArticleTag, 'articletag')
            .innerJoin('articletag.tag', 'tag')
            .where('tag.value = :tag')
            .getQuery() +
          ')',
        { tag },
      );
    }
    if (author != null && author !== '') {
      builder = builder.andWhere('author.username = :author', {
        author,
      });
    }
    const [articles, articlesCount] = await builder
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    const tagListByArticleId = new Map<number, string[]>();
    const followingByAuthorId = new Map<number, boolean>();
    for (const article of articles) {
      const tagList = (
        await this.articleTagRepository.find({
          where: { article },
          relations: ['tag'],
        })
      )
        .map((articleTag) => articleTag.tag.value)
        .sort();
      tagListByArticleId.set(article.id, tagList);
      const following =
        userId == null
          ? false
          : (await this.userFollowRepository.findOne({
              where: { follower: { id: userId }, followee: article.author },
            })) != null;
      followingByAuthorId.set(article.author.id, following);
    }
    return {
      articles: articles.map((article) => ({
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: tagListByArticleId.get(article.id) ?? [],
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: article.author.username,
          bio: article.author.bio || null,
          image: article.author.image || null,
          following: followingByAuthorId.get(article.author.id) ?? false,
        },
      })),
      articlesCount,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/articles')
  async createArticle(
    @Body() dto: CreateArticleDto,
    @UserId() userId: number,
  ): Promise<SingleArticleRes> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const slugs = (await this.articleRepository.find()).map(
      (article) => article.slug,
    );
    const article = Article.forCreateArticle({
      ...dto.article,
      slug: createSlug(dto.article.title, slugs),
      authorId: userId,
    });
    await this.articleRepository.save(article);
    if (dto.article.tagList != null) {
      const tagByValue = new Map<string, Tag>();
      const savedTags = await this.tagRepository.find({
        where: { value: In(dto.article.tagList) },
      });
      for (const tag of savedTags) {
        tagByValue.set(tag.value, tag);
      }
      const unsavedTags = dto.article.tagList
        .filter((tag) => !tagByValue.has(tag))
        .map((tag) => {
          const t = new Tag();
          t.value = tag;
          return t;
        });
      if (unsavedTags.length > 0) {
        await this.tagRepository.save(unsavedTags);
        for (const tag of unsavedTags) {
          tagByValue.set(tag.value, tag);
        }
      }
      const articletags = dto.article.tagList.map((tag) => {
        const t = new ArticleTag();
        t.article = article;
        t.tag = tagByValue.get(tag);
        return t;
      });
      await this.articleTagRepository.save(articletags);
    }
    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: dto.article.tagList ?? [],
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: user.username,
          bio: user.bio || null,
          image: user.image || null,
          following: false,
        },
      },
    };
  }

  @Get('/api/articles/:slug')
  async getArticle(
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
    const tagList = (
      await this.articleTagRepository.find({
        where: { article },
        relations: ['tag'],
      })
    )
      .map((articleTag) => articleTag.tag.value)
      .sort();
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
        favoritesCount: 0,
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
  @Put('/api/articles/:slug')
  async updateArticle(
    @Param('slug') slug: string,
    @Body() dto: UpdateArticleDto,
    @UserId() userId: number,
  ): Promise<SingleArticleRes> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
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
    if (article.author.id !== userId) {
      throw new HttpException(
        `The article is not yours: slug=${slug}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.article.title != null) {
      article.title = dto.article.title;
    }
    if (dto.article.description != null) {
      article.description = dto.article.description;
    }
    if (dto.article.body != null) {
      article.body = dto.article.body;
    }
    await this.articleRepository.save(article);
    const tagList = (
      await this.articleTagRepository.find({
        where: { article },
        relations: ['tag'],
      })
    )
      .map((articleTag) => articleTag.tag.value)
      .sort();
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
        favoritesCount: 0,
        author: {
          username: user.username,
          bio: user.bio || null,
          image: user.image || null,
          following: false,
        },
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/articles/:slug')
  async deleteArticle(
    @Param('slug') slug: string,
    @UserId() userId: number,
  ): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });
    if (article == null) {
      return;
    }
    if (article.author.id !== userId) {
      throw new HttpException(
        `The article is not yours: slug=${slug}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.articleTagRepository.delete({ article });
    await this.articleRepository.delete(article.id);
  }
}
