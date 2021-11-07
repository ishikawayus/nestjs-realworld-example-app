import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ArticleRepository,
  CommentRepository,
  UserFollowRepository,
  UserRepository,
} from '../repository';
import { UserId } from '../jwt-auth.decorator';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { Comment } from '../entity';
import { SingleCommentRes, MultipleCommentRes } from '../model/comment-res';
import { AddCommentDto } from './comment.dto';

@Controller()
export class CommentController {
  constructor(
    private articleRepository: ArticleRepository,
    private commentRepository: CommentRepository,
    private userFollowRepository: UserFollowRepository,
    private userRepository: UserRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/api/articles/:slug/comments')
  async addComment(
    @Param('slug') slug: string,
    @Body() dto: AddCommentDto,
    @UserId() userId: number,
  ): Promise<SingleCommentRes> {
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
    const comment = new Comment();
    comment.article = article;
    comment.body = dto.comment.body;
    comment.author = user;
    await this.commentRepository.save(comment);
    return {
      comment: {
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        author: {
          username: user.username,
          bio: user.bio || null,
          image: user.image || null,
          following: false,
        },
      },
    };
  }

  @Get('/api/articles/:slug/comments')
  async getComments(
    @Param('slug') slug: string,
    @UserId() userId: number,
  ): Promise<MultipleCommentRes> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });
    if (article == null) {
      throw new HttpException(
        `The article does not exist: slug=${slug}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const comments = await this.commentRepository.find({
      relations: ['author'],
      where: { article },
    });
    const followingByAuthorId = new Map<number, boolean>();
    for (const comment of comments) {
      const following =
        userId == null
          ? false
          : (await this.userFollowRepository.findOne({
              where: { follower: { id: userId }, followee: comment.author },
            })) != null;
      followingByAuthorId.set(comment.author.id, following);
    }
    return {
      comments: comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        author: {
          username: comment.author.username,
          bio: comment.author.bio || null,
          image: comment.author.image || null,
          following: followingByAuthorId.get(comment.author.id),
        },
      })),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/articles/:slug/comments/:id')
  async deleteComment(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @UserId() userId: number,
  ): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });
    if (article == null) {
      throw new HttpException(
        `The article does not exist: slug=${slug}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const comment = await this.commentRepository.findOne({
      relations: ['author'],
      where: { id, article },
    });
    if (comment == null) {
      return;
    }
    if (comment.author.id !== userId) {
      throw new HttpException(
        `The comment is not yours: id=${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.commentRepository.delete(comment.id);
  }
}
