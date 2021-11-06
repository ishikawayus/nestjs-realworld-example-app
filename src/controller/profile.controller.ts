import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserFollowRepository, UserRepository } from '../repository';
import { ProfileRes } from '../model/profile-res';
import { UserId } from '../jwt-auth.decorator';
import { UserFollow } from '../entity';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller()
export class ProfileController {
  constructor(
    private userRepository: UserRepository,
    private userFollowRepository: UserFollowRepository,
  ) {}

  @Get('/api/profiles/:username')
  async getProfile(
    @Param('username') username: string,
    @UserId() userId: number,
  ): Promise<ProfileRes> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user == null) {
      throw new HttpException(
        `The user does not exist: username=${username}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const following =
      userId == null
        ? false
        : (await this.userFollowRepository.findOne({
            where: { follower: { id: userId }, followee: user },
          })) != null;
    return {
      profile: {
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
        following,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/profiles/:username/follow')
  async followUser(
    @Param('username') username: string,
    @UserId() userId: number,
  ): Promise<ProfileRes> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user == null) {
      throw new HttpException(
        `The user does not exist: username=${username}`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userFollowRepository.save(
      UserFollow.forNew({ follower: { id: userId }, followee: user }),
    );
    return {
      profile: {
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
        following: true,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/profiles/:username/follow')
  async unfollowUser(
    @Param('username') username: string,
    @UserId() userId: number,
  ): Promise<ProfileRes> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user == null) {
      throw new HttpException(
        `The user does not exist: username=${username}`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userFollowRepository.delete(
      UserFollow.forNew({ follower: { id: userId }, followee: user }),
    );
    return {
      profile: {
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
        following: false,
      },
    };
  }
}
